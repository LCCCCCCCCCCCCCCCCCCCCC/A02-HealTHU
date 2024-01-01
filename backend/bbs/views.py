from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Topic
from .models import Floor
from user.models import User
from user.models import UserInfo
import requests
import json


# Create your views here.

@csrf_exempt
def addPost(request):
    if request.method == "POST":
        id = int(request.POST.get('id'))
        title = request.POST.get('title')
        timeNow = request.POST.get('time')
        content = request.POST.get('content')
        print("content: ", content)
        imgs = request.POST.get('images')
        if imgs:
            images = json.loads(imgs)
        else:
            images = []
        # STEP 1: create a floor object
        # first find the user according to the id
        targetUser = User.objects.filter(id=id).first()
        # then get the time now, in the form of "yyyy-mm-dd hh:mm:ss"
        # then create a new floor
        newFloor = Floor.objects.create(
            floorNum=1,
            userId=id,
            name=targetUser.userInfo.nickName,
            avatar=targetUser.userInfo.avatarUrl,
            time=timeNow,
            content=content,
            likes=0,
            likeList=[],
            aboveId=0,
            aboveName="",
            aboveContent="",
            belowIds=[],
            commentNum=0
        )
        # create the topic
        floorDict = {
            1: newFloor.id
        }
        newTopic = Topic.objects.create(
            userId=id,
            name=targetUser.userInfo.nickName,
            avatar=targetUser.userInfo.avatarUrl,
            title=title,
            time=timeNow,
            likes=0,
            likeList=[],
            images=images,
            floorCnt=1,
            floors=floorDict
        )
        return HttpResponse("Post added")


@csrf_exempt
def deletePost(request):
    if request.method == "POST":
        id = int(request.POST.get('id'))
        postId = int(request.POST.get('postId'))
        # find the topic according to the postId
        targetTopic = Topic.objects.filter(id=postId).first()
        if targetTopic is None:
            return HttpResponse("Post does not exist")
        if targetTopic.userId != id:
            return HttpResponse("You are not the op")
        # targetTopic found
        # start deleting
        # first find all the floors in this topic, and delete them
        floorList = targetTopic.floors
        for key, value in floorList.items():
            if value != -1:
                # a floor that is not deleted
                targetFloor = Floor.objects.filter(id=value).first()
                if targetFloor is not None:
                    targetFloor.delete()
                value = -1
        # then delete the topic itself
        targetTopic.delete()
        return HttpResponse("Post deleted")


@csrf_exempt
def likePost(request):
    if request.method == "POST":
        id = int(request.POST.get('id'))
        postId = int(request.POST.get('postId'))
        # first find topic by postId
        targetTopic = Topic.objects.filter(id=postId).first()
        if targetTopic is None:
            return HttpResponse("Post does not exist")
        # Topic found
        if id in targetTopic.likeList:
            return HttpResponse("You have already liked this post")
        targetTopic.likeList.append(id)
        targetTopic.likes += 1
        targetTopic.save()
        # find the floor that is the original post
        opFloorId = targetTopic.floors['1']
        targetOpFloor = Floor.objects.filter(id=opFloorId).first()
        if targetOpFloor is None:
            return HttpResponse("Post does not exist")
        targetOpFloor.likeList.append(id)
        targetOpFloor.likes += 1
        targetOpFloor.save()
        return HttpResponse("Post liked")


@csrf_exempt
def dislikePost(request):
    if request.method == "POST":
        id = int(request.POST.get('id'))
        postId = int(request.POST.get('postId'))
        # first find topic by postId
        targetTopic = Topic.objects.filter(id=postId).first()
        if targetTopic is None:
            return HttpResponse("Post does not exist")
        # Topic found
        if id not in targetTopic.likeList:
            return HttpResponse("You have not liked this post")
        targetTopic.likeList.remove(id)
        targetTopic.likes -= 1
        targetTopic.save()
        # find the floor that is the original post
        opFloorId = targetTopic.floors['1']
        targetOpFloor = Floor.objects.filter(id=opFloorId).first()
        if targetOpFloor is None:
            return HttpResponse("Post does not exist")
        targetOpFloor.likeList.remove(id)
        targetOpFloor.likes -= 1
        targetOpFloor.save()
        return HttpResponse("Post disliked")


@csrf_exempt
def addReply(request):
    if request.method == "POST":
        id = int(request.POST.get('id'))
        postId = int(request.POST.get('postId'))
        time = request.POST.get('time')
        content = request.POST.get('content')
        aboveId = int(request.POST.get('aboveId'))
        # find the user
        targetUser = User.objects.filter(id=id).first()
        if targetUser is None:
            # not found
            return HttpResponse("User does not exist")
        # user found
        targetTopic = Topic.objects.filter(id=postId).first()
        if targetTopic is None:
            # not found
            return HttpResponse("Post does not exist")
        # post found
        targetAboveFloorId = targetTopic.floors[str(aboveId)]
        targetAboveFloor = Floor.objects.filter(id=targetAboveFloorId).first()
        if targetAboveFloor is None:
            # not found
            return HttpResponse("Floor does not exist")
        targetTopic.floorCnt += 1
        targetTopic.save()
        newFloor = Floor.objects.create(
            floorNum=targetTopic.floorCnt,
            userId=id,
            name=targetUser.userInfo.nickName,
            avatar=targetUser.userInfo.avatarUrl,
            time=time,
            content=content,
            likes=0,
            likeList=[],
            aboveId=targetAboveFloorId,
            aboveName=targetAboveFloor.name,
            aboveContent=targetAboveFloor.content,
            belowIds=[],
            commentNum=0
        )
        # add a new floorNum, newFloor.id pair to the floors dict
        targetTopic.floors[str(targetTopic.floorCnt)] = newFloor.id
        targetTopic.save()
        targetAboveFloor.commentNum += 1
        targetAboveFloor.belowIds.append(newFloor.id)
        print("targetAboveFloor.id:", targetAboveFloor.id)
        print("targetAboveFloor.belowIds:", targetAboveFloor.belowIds)
        targetAboveFloor.save()
        return HttpResponse("Reply added")


@csrf_exempt
def deleteReply(request):
    if request.method == "POST":
        id = int(request.POST.get('id'))
        postId = int(request.POST.get('postId'))
        floor = int(request.POST.get('floor'))
        if floor == 1:
            return HttpResponse("You cannot delete the original post")
        # find the post via postId
        targetTopic = Topic.objects.filter(id=postId).first()
        if targetTopic is None:
            return HttpResponse("Post does not exist")
        # post found
        # find in targetTopic.floors the floor, floorId pair
        targetFloorId = targetTopic.floors[str(floor)]
        print("targetTopic.floors:", targetTopic.floors)
        print("targetFloorId:", targetFloorId)
        if targetFloorId == -1 or targetFloorId is None:
            return HttpResponse("FloorId does not exist")
        # floorId found
        # find the floor
        targetFloor = Floor.objects.filter(id=targetFloorId).first()
        if targetFloor is None:
            return HttpResponse("Floor does not exist")
        # floor found
        targetAboveFloorId = targetFloor.aboveId
        targetAboveFloor = Floor.objects.filter(id=targetAboveFloorId).first()
        if targetAboveFloor is None:
            return HttpResponse("Above Floor does not exist")
        # above floor found
        # first find and set all floors in belowIds to such a degree, that
        # its aboveId being -1, and its aboveName and aboveContent being ""
        for belowId in targetFloor.belowIds:
            targetBelowFloor = Floor.objects.filter(id=belowId).first()
            if targetBelowFloor is None:
                continue
            targetBelowFloor.aboveId = -1
            targetBelowFloor.aboveName = ""
            targetBelowFloor.aboveContent = "此评论已被删除"
            targetBelowFloor.save()
        # then remove this from its above's belowIds
        print("targetAboveFloor.id:", targetAboveFloor.id)
        print("targetAboveFloor.belowIds:", targetAboveFloor.belowIds)
        targetAboveFloor.belowIds.remove(targetFloorId)
        targetAboveFloor.commentNum -= 1
        targetAboveFloor.save()
        # then set the floorId in targetTopic.floors to -1
        targetTopic.floors[str(floor)] = -1
        targetTopic.save()
        # then delete the floor itself
        targetFloor.delete()
        print("targetTopic.floors:", targetTopic.floors)
        return HttpResponse("Floor deleted")


@csrf_exempt
def likeReply(request):
    if request.method == "POST":
        id = int(request.POST.get('id'))
        postId = int(request.POST.get('postId'))
        floor = int(request.POST.get('floor'))
        if floor == 1:
            return HttpResponse("You cannot like the original post, use likePost instead")
        # find the post via postId
        targetTopic = Topic.objects.filter(id=postId).first()
        if targetTopic is None:
            return HttpResponse("Post does not exist")
        # post found
        # find in targetTopic.floors the floor, floorId pair
        targetFloorId = int(targetTopic.floors[str(floor)])
        if targetFloorId == -1 or targetFloorId is None:
            return HttpResponse("FloorId does not exist")
        # floorId found
        # find the floor
        targetFloor = Floor.objects.filter(id=targetFloorId).first()
        print("targetFloor.LikeList:", targetFloor.likeList)
        if targetFloor is None:
            return HttpResponse("Floor does not exist")
        # floor found
        if id in targetFloor.likeList:
            return HttpResponse("You have already liked this floor")
        print("targetFloor:", targetFloor)
        targetFloor.likeList.append(id)
        targetFloor.likes += 1
        targetFloor.save()
        return HttpResponse("reply liked")


@csrf_exempt
def dislikeReply(request):
    if request.method == "POST":
        id = int(request.POST.get('id'))
        postId = int(request.POST.get('postId'))
        floor = int(request.POST.get('floor'))
        if floor == 1:
            return HttpResponse("You cannot dislike the original post, use dislikePost instead")
        # find the post via postId
        targetTopic = Topic.objects.filter(id=postId).first()
        if targetTopic is None:
            return HttpResponse("Post does not exist")
        # post found
        # find in targetTopic.floors the floor, floorId pair
        targetFloorId = int(targetTopic.floors[str(floor)])
        if targetFloorId == -1 or targetFloorId is None:
            return HttpResponse("FloorId does not exist")
        # floorId found
        # find the floor
        targetFloor = Floor.objects.filter(id=targetFloorId).first()
        print("targetFloor.LikeList:", targetFloor.likeList)
        if targetFloor is None:
            return HttpResponse("Floor does not exist")
        # floor found
        if id not in targetFloor.likeList:
            return HttpResponse("You have not liked this floor")
        targetFloor.likeList.remove(id)
        targetFloor.likes -= 1
        targetFloor.save()
        return HttpResponse("reply disliked")


def getPost(request):
    if request.method == "GET":
        getPostType = int(request.GET.get('type'))
        id = int(request.GET.get('id'))
        # getPostType:
        # 0: get the newest 50(at most) posts, from the one with the largest id
        # 1: get the 50(at most) posts, from the one with the greatest likes
        # 2: get all posts whose userId is in id's followings
        targetPostArray = []
        if getPostType == 0:
            targetTopicList = Topic.objects.all().order_by('-id')
            # get the first 50 topics, if less than 50, then get all
            targetTopicList = list(targetTopicList)
            if len(targetTopicList) > 50:
                # cut the list
                targetTopicList = targetTopicList[:50]
            for targetTopic in targetTopicList:
                targetPost = {}
                targetPost['id'] = targetTopic.id
                targetPost['title'] = targetTopic.title
                targetPost['time'] = targetTopic.time
                targetPost['name'] = targetTopic.name
                targetPost['likeNum'] = targetTopic.likes
                targetPost['commentNum'] = targetTopic.floorCnt - 1
                targetPost['images'] = targetTopic.images
                targetPostArray.append(targetPost)
        elif getPostType == 1:
            targetTopicList = Topic.objects.all().order_by('-likes')
            # get the first 50 topics, if less than 50, then get all
            targetTopicList = list(targetTopicList)
            if len(targetTopicList) > 50:
                # cut the list
                targetTopicList = targetTopicList[:50]
            for targetTopic in targetTopicList:
                targetPost = {}
                targetPost['id'] = targetTopic.id
                targetPost['title'] = targetTopic.title
                targetPost['time'] = targetTopic.time
                targetPost['name'] = targetTopic.name
                targetPost['likeNum'] = targetTopic.likes
                targetPost['commentNum'] = targetTopic.floorCnt - 1
                targetPost['images'] = targetTopic.images
                targetPostArray.append(targetPost)
        elif getPostType == 2:
            targetUser = User.objects.filter(id=id).first()
            if targetUser is None:
                return HttpResponse(json.dumps([], ensure_ascii=False))
            # user found
            targetFollowingList = targetUser.userInfo.followings
            for topic in Topic.objects.all():
                if topic.userId in targetFollowingList:
                    targetPost = {}
                    targetPost['id'] = topic.id
                    targetPost['title'] = topic.title
                    targetPost['time'] = topic.time
                    targetPost['name'] = topic.name
                    targetPost['likeNum'] = topic.likes
                    targetPost['commentNum'] = topic.floorCnt - 1
                    targetPost['images'] = topic.images
                    targetPostArray.append(targetPost)
        return HttpResponse(json.dumps(targetPostArray, ensure_ascii=False))


def getPostById(request):
    if request.method == "GET":
        id = int(request.GET.get('id'))
        # return all posts whose userId is id
        targetPostArray = []
        for topic in Topic.objects.all():
            if topic.userId == id:
                targetPost = {}
                targetPost['id'] = topic.id
                targetPost['title'] = topic.title
                targetPost['time'] = topic.time
                targetPost['name'] = topic.name
                targetPost['likeNum'] = topic.likes
                targetPost['commentNum'] = topic.floorCnt - 1
                targetPost['images'] = topic.images
                targetPostArray.append(targetPost)
        return HttpResponse(json.dumps(targetPostArray, ensure_ascii=False))


def searchPost(request):
    if request.method == "GET":
        key = request.GET.get('key')
        # return all posts whose title and/or content contains key
        targetPostArray = []
        for topic in Topic.objects.all():
            targetFloor = Floor.objects.filter(id=int(topic.floors['1'])).first()
            if targetFloor is None:
                continue
            if key in topic.title or key in targetFloor.content:
                targetPost = {}
                targetPost['id'] = topic.id
                targetPost['title'] = topic.title
                targetPost['time'] = topic.time
                targetPost['name'] = topic.name
                targetPost['likeNum'] = topic.likes
                targetPost['commentNum'] = topic.floorCnt - 1
                targetPost['images'] = topic.images
                targetPostArray.append(targetPost)
        return HttpResponse(json.dumps(targetPostArray, ensure_ascii=False))


def getPostDetail(request):
    if request.method == "GET":
        id = int(request.GET.get('id'))
        postId = int(request.GET.get('postId'))
        # find the topic first
        targetTopic = Topic.objects.filter(id=postId).first()
        targetReplyArray = []
        targetPost = {}
        for floor, floorId in targetTopic.floors.items():
            if int(floor) == -1:
                continue
            targetFloor = Floor.objects.filter(id=floorId).first()
            if targetFloor is None:
                continue
            if int(floor) == 1:
                targetPost['content'] = targetFloor.content
                continue
            targetReply = {}
            targetReply['floor'] = floor
            targetReply['userId'] = targetFloor.userId
            targetReply['name'] = targetFloor.name
            targetReply['avatar'] = targetFloor.avatar
            targetReply['time'] = targetFloor.time
            targetReply['content'] = targetFloor.content
            targetReply['likeList'] = targetFloor.likeList
            targetReply['aboveId'] = targetFloor.aboveId
            for key, value in targetTopic.floors.items():
                if value == targetFloor.aboveId:
                    targetReply['aboveId'] = key
                    break
            targetReply['aboveName'] = targetFloor.aboveName
            targetReply['aboveContent'] = targetFloor.aboveContent
            targetReplyArray.append(targetReply)
        targetPost['id'] = targetTopic.id
        targetPost['userId'] = targetTopic.userId
        targetPost['name'] = targetTopic.name
        targetPost['avatar'] = targetTopic.avatar
        targetPost['title'] = targetTopic.title
        targetPost['time'] = targetTopic.time
        targetPost['images'] = targetTopic.images
        targetPost['likeList'] = targetTopic.likeList
        targetPost['replies'] = targetReplyArray
        # print("targetPost: ", targetPost)
        return HttpResponse(json.dumps(targetPost, ensure_ascii=False))







