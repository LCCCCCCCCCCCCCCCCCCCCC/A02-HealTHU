from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import User
from .models import UserInfo
from .models import CustomSettings
from schedule.models import Schedule
from schedule.models import Activity
from bbs.models import Topic
from bbs.models import Floor
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
                                                followers=[], followerNum=0, achievements=[])
            custom_settings = CustomSettings.objects.create(displayMode=0, ddlRange='',
                                                            storageRange='', blackList=[],
                                                            achRange=0, actRange=0, postRange=0)
            user = User.objects.create(userid=openid, userInfo=user_info,
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
                # 根据 id 查找相应的 avatarUrl, nickName 和 signature
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
                # 根据 id 查找相应的 avatarUrl, nickName 和 signature
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
        #host 关注 customer
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
        #host 取消关注 customer
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

def search(request):
    if request.method == "GET":
        key = request.GET.get("key")
        # find a user that
        # (1) contains key in his or her nickName, or:
        # (2) id == key
        ansarray = []
        # if key can be converted to int, then search by id
        all_users_whose_id_is_key = []
        if key.isdigit():
            all_users_whose_id_is_key = User.objects.filter(id=int(key))
        all_users_whose_nickName_contains_key = []
        for user in User.objects.all():
            if key in user.userInfo.nickName:
                all_users_whose_nickName_contains_key.append(user)
        for user in all_users_whose_id_is_key:
            newDict = {
                'userId': user.id,
                'avatar': user.userInfo.avatarUrl,
                'name': user.userInfo.nickName,
            }
            ansarray.append(newDict)
        for user in all_users_whose_nickName_contains_key:
            newDict = {
                'userId': user.id,
                'avatar': user.userInfo.avatarUrl,
                'name': user.userInfo.nickName,
            }
            ansarray.append(newDict)
        # then, ensure that there is no duplicate
        ansarray = list({v['userId']:v for v in ansarray}.values())
        return HttpResponse(json.dumps(ansarray, ensure_ascii=False))
    
def getPersonal(request):
    if request.method == 'GET':
        homeUserId = int(request.GET.get("customerId"))
        visitorUserId = int(request.GET.get("hostId"))
        homeUser = User.objects.filter(id=homeUserId).first()
        visitorUser = User.objects.filter(id=visitorUserId).first()
        if homeUser and visitorUser:
            # both users exist
            responseDict = {
                'avatarUrl': homeUser.userInfo.avatarUrl,
                'nickName': homeUser.userInfo.nickName,
                'signature': homeUser.userInfo.signature,
                'followings': homeUser.userInfo.followings,
                'followers': homeUser.userInfo.followers,
                'achievements': [],
                'iniActs': [],
                'partActs': [],
                'posts': []
            }
            if homeUserId in visitorUser.userInfo.followings:
                responseDict['following_state'] = 1
            else:
                responseDict['following_state'] = 0
            if (homeUser.customSettings.achRange == 0) or\
                ((homeUser.customSettings.actRange == 1) and (visitorUserId in homeUser.userInfo.followers)) or\
                ((homeUser.customSettings.actRange == 2) and (homeUserId == visitorUserId)):
                   # achievement CAN BE seen by visitor
                   responseDict['achievements'] = homeUser.userInfo.achievements
            if (homeUser.customSettings.actRange == 0) or\
                ((homeUser.customSettings.actRange == 1) and (visitorUserId in homeUser.userInfo.followers)) or\
                ((homeUser.customSettings.actRange == 2) and (homeUserId == visitorUserId)):
                     # iniActs and partActs CAN BE seen by visitor
                    correspondingSchedule = Schedule.objects.filter(userid=homeUserId).first()
                    if correspondingSchedule:
                        alliniActs = correspondingSchedule.initiActs
                        allpartActs = correspondingSchedule.partiActs
                        for actId in alliniActs:
                            act = Activity.objects.filter(id=actId).first()
                            if act:
                                actDict = {
                                    'id': act.id, # 'id' is the primary key of 'Activity'
                                    'title': act.title,
                                    'participants': act.participants,
                                    'partNumMin': act.partNumMin,
                                    'partNumMax': act.partNumMax,
                                    'date': act.date,
                                    'start': act.start,
                                    'end': act.end,
                                    'label': act.label,
                                    'tags': act.tags,
                                }
                                responseDict['iniActs'].append(actDict)
                        for actId in allpartActs:
                            act = Activity.objects.filter(id=actId).first()
                            if act:
                                actDict = {
                                    'id': act.id, # 'id' is the primary key of 'Activity'
                                    'title': act.title,
                                    'participants': act.participants,
                                    'partNumMin': act.partNumMin,
                                    'partNumMax': act.partNumMax,
                                    'date': act.date,
                                    'start': act.start,
                                    'end': act.end,
                                    'label': act.label,
                                    'tags': act.tags,
                                }
                                responseDict['partActs'].append(actDict)
            if (homeUser.customSettings.postRange == 0) or\
                ((homeUser.customSettings.postRange == 1) and (visitorUserId in homeUser.userInfo.followers)) or\
                ((homeUser.customSettings.postRange == 2) and (homeUserId == visitorUserId)):
                    # posts CAN BE seen by visitor
                    targetTopics = Topic.objects.filter(userId=homeUserId)
                    for topic in targetTopics:
                        topicDict = {
                            'id': topic.id,
                            'title': topic.title,
                            'time': topic.time,
                            'likeNum': topic.likes,
                            'commentNum': topic.floorCnt - 1
                        }
                        responseDict['posts'].append(topicDict)
            return HttpResponse(json.dumps(responseDict, ensure_ascii=False))              
        else:
            return HttpResponse("User not found")
        
def getRange(request):
    if request.method == "GET":
        id = int(request.GET.get("id"))
        targetUser = User.objects.filter(id=id).first()
        if targetUser:
            # targetUser exists
            responseDict = {
                'achRange': targetUser.customSettings.achRange,
                'actRange': targetUser.customSettings.actRange,
                'postRange': targetUser.customSettings.postRange
            }
            return HttpResponse(json.dumps(responseDict, ensure_ascii=False))
        return HttpResponse("User not found")
 
@csrf_exempt       
def changeRange(request):
    if request.method == "POST":
        id = int(request.POST.get("id"))
        achRange = int(request.POST.get("achRange"))
        actRange = int(request.POST.get("actRange"))
        postRange = int(request.POST.get("postRange"))
        targetUser = User.objects.filter(id=id).first()
        if targetUser:)
            targetUser.customSettings.achRange = achRange
            targetUser.customSettings.actRange = actRange
            targetUser.customSettings.postRange = postRange
            targetUser.customSettings.save()
            return HttpResponse("Change Range Success")
        return HttpResponse("User not found")
    