from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import User
from .models import UserInfo
from .models import CustomSettings
import requests
import json
import os
# Create your views here.

@csrf_exempt
def postImage(request):
    if request.method == 'POST':
        id = request.POST.get("id")
        print(id)
        user = User.objects.filter(id=id).first()
        if user:
            # 找到匹配的用户
            image = request.FILES['image']
            #获取images文件夹下的文件数量
            num = len(os.listdir('images'))
            #将图片存储到images文件夹下，并且给每个id都自动编号命名，如id_1.jpg
            with open('images/'+str(id)+'_'+str(num+1)+'.jpg', 'wb') as f:
                for chunk in image.chunks():
                    f.write(chunk)
            #返回图片的存储路径
            return HttpResponse('images/'+str(id)+'_'+str(num+1)+'.jpg')
        else:
            # 用户不存在的情况下返回错误的响应
            return HttpResponse("User not found")
def getId(request):
    if request.method == 'GET':
        code = request.GET.get("code")
        url = "https://api.weixin.qq.com/sns/jscode2session"
        url += "?appid=wx0ed6410d0f2b476f"
        url += "&secret=737153f44349fdde120da7fedce92666"
        url += "&js_code=" + code
        url += "&grant_type=authorization_code"
        r = requests.get(url)
        openid = r.json().get('openid', '')
        # 比较 openid 是否存在于数据库中
        user = User.objects.filter(userid=openid).first()
        if not user:
            # 在数据库中新增一项
            user_info = UserInfo.objects.create(avatarUrl='赫赫', nickName='微信昵称', signature='',
                                                followings=[], followingNum=0,
                                                followers=[], followerNum=0)
            custom_settings = CustomSettings.objects.create(displayMode=0, ddlRange='',
                                                            storageRange='', blackList=[])
            user = User.objects.create(userid=openid, nickName='', userInfo=user_info,
                                customSettings=custom_settings)
        return HttpResponse(user.id)

def getDetail(request):
    if request.method == 'GET':
        hostid = request.GET.get("hostId")
        customerid = request.GET.get("customerId")
        if hostid == customerid:
            user = User.objects.filter(id=customerid).first()
            if user:
                # 找到匹配的用户
                #为了新加最后一项新建一个字典
                user_info_dict = {
                    'avatarUrl': user.userInfo.avatarUrl,
                    'nickName': user.userInfo.nickName,
                    'signature': user.userInfo.signature,
                    'followings': user.userInfo.followings,
                    'followingNum': user.userInfo.followingNum,
                    'followers': user.userInfo.followers,
                    'followerNum': user.userInfo.followerNum,
                    'following_state': 'meaningless'
                }
                user_info_json = json.dumps(user_info_dict, ensure_ascii=False)
                return JsonResponse(user_info_json, safe=False)
            else:
                # 没有找到匹配的用户
                return HttpResponse("User not found", status=400)
        else:
            host = User.objects.filter(id=hostid).first()
            customer = User.objects.filter(id=customerid).first()
            if host and customer:
                if customerid in host.userInfo.followings:
                    user_info_dict = {
                        'avatarUrl': customer.userInfo.avatarUrl,
                        'nickName': customer.userInfo.nickName,
                        'signature': customer.userInfo.signature,
                        'followings': customer.userInfo.followings,
                        'followingNum': customer.userInfo.followingNum,
                        'followers': customer.userInfo.followers,
                        'followerNum': customer.userInfo.followerNum,
                        'following_state': 'true'
                    }
                    user_info_json = json.dumps(user_info_dict, ensure_ascii=False)
                    return JsonResponse(user_info_json, safe=False)
                else:
                    user_info_dict = {
                        'avatarUrl': customer.userInfo.avatarUrl,
                        'nickName': customer.userInfo.nickName,
                        'signature': customer.userInfo.signature,
                        'followings': customer.userInfo.followings,
                        'followingNum': customer.userInfo.followingNum,
                        'followers': customer.userInfo.followers,
                        'followerNum': customer.userInfo.followerNum,
                        'following_state': 'false'
                    }
                    user_info_json = json.dumps(user_info_dict, ensure_ascii=False)
                    return JsonResponse(user_info_json, safe=False)
            else:
                # 没有找到匹配的用户
                return HttpResponse("User not found", status=400)

@csrf_exempt
def changeInfo(request):
    if request.method == 'POST':
        id = request.POST.get("id")
        user = User.objects.filter(id=id).first()
        if user:
            # 找到匹配的用户
            nickname = request.POST.get("nickName")
            avatarurl = request.POST.get("avatarUrl")
            signature = request.POST.get("signature")
            user.userInfo.nickName = nickname
            user.userInfo.avatarUrl = avatarurl
            user.userInfo.signature = signature
            user.userInfo.save()
            # 返回成功的响应
            return HttpResponse("Set Success")
        else:
            # 用户不存在的情况下返回错误的响应
            return HttpResponse("User not found", status=400)

def getAttention(request):
    if request.method == 'GET':
        id = request.GET.get("id")
        user = User.objects.filter(id=id).first()
        if user:
            attentionList = user.userInfo.followings
            result = []
            for id in attentionList:
                # 根据id查找相应的avatarUrl, nickName和signature
                user = User.objects.filter(id=id).first()
                avatarUrl = user.userInfo.avatarUrl
                nickName = user.userInfo.nickName
                signature = user.userInfo.signature
                attention_info = {
                    'id': id,
                    'avatarUrl': avatarUrl,
                    'nickName': nickName,
                    'signature': signature
                }
                result.append(attention_info)
            result_json = json.dumps(result, ensure_ascii=False)
            return JsonResponse(result_json, safe=False)
        else:
            # 用户不存在的情况下返回错误的响应
            return HttpResponse("User not found", status=400)

def getFans(request):
    if request.method == 'GET':
        id = request.GET.get("id")
        user = User.objects.filter(id=id).first()
        if user:
            fansList = user.userInfo.followers
            result = []
            for id in fansList:
                # 根据id查找相应的avatarUrl, nickName和signature
                user = User.objects.filter(id=id).first()
                avatarUrl = user.userInfo.avatarUrl
                nickName = user.userInfo.nickName
                signature = user.userInfo.signature
                if id in user.userInfo.followings:
                    fan_info = {
                        'id': id,
                        'avatarUrl': avatarUrl,
                        'nickName': nickName,
                        'signature': signature,
                        'following_state': 'true'
                    }
                    result.append(fan_info)
                else:
                    fan_info = {
                        'id': id,
                        'avatarUrl': avatarUrl,
                        'nickName': nickName,
                        'signature': signature,
                        'following_state': 'false'
                    }
                    result.append(fan_info)
            result_json = json.dumps(result, ensure_ascii=False)
            return JsonResponse(result_json, safe=False)
        else:
            # 用户不存在的情况下返回错误的响应
            return HttpResponse("User not found", status=400)

@csrf_exempt
def addAttention(request):
    if request.method == 'POST':
        #host关注customer
        hostid = request.POST.get("hostId")
        customerid = request.POST.get("customerId")
        if hostid == customerid:
            return HttpResponse("Self Attention Prohibited", status=400)
        else:
            host = User.objects.filter(id=hostid).first()
            customer = User.objects.filter(id=customerid).first()
            if host and customer:
                host.userInfo.followings.append(customerid)
                host.userInfo.followingNum += 1
                customer.userInfo.followers.append(hostid)
                customer.userInfo.followerNum += 1
                host.userInfo.save()
                customer.userInfo.save()
                return HttpResponse("Add Attention Success", status=200)
            else:
                return HttpResponse("User not found", status=400)

@csrf_exempt
def delAttention(request):
    if request.method == 'POST':
        #host取消关注customer
        hostid = request.POST.get("hostId")
        customerid = request.POST.get("customerId")
        if hostid == customerid:
            return HttpResponse("Self Delete Attention Prohibited", status=400)
        else:
            host = User.objects.filter(id=hostid).first()
            customer = User.objects.filter(id=customerid).first()
            if host and customer:
                for item in host.userInfo.followings:
                    if item == customerid:
                        # 找到匹配项，从列表中删除
                        host.userInfo.followings.remove(item)
                        break
                host.userInfo.followingNum -= 1
                for item in customer.userInfo.followers:
                    if item == hostid:
                        # 找到匹配项，从列表中删除
                        customer.userInfo.followers.remove(item)
                        break
                customer.userInfo.followerNum -= 1
                host.userInfo.save()
                customer.userInfo.save()
                return HttpResponse("Delete Attention Success", status=200)
            else:
                return HttpResponse("User not found", status=400)