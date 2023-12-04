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
# Create your views here.

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