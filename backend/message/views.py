from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Message
from .models import MessageBox
from utils.jwt import login_required
import requests
import json


# Create your views here.
@login_required
def getMessages(request):
    if request.method == 'GET':
        id = request.GET.get('id')
        # actually the userId
        targetMessageBox = MessageBox.objects.filter(userId=id).first()
        # if not found, create a new one
        if targetMessageBox is None:
            newMessageBox = MessageBox.objects.create(userId=id, messages=[])
            # find all messages destined here
            messages = Message.objects.filter(destUserId=id)
            for message in messages:
                newMessageBox.messages.append(message.id)
            targetMessageBox.save()
        # then, find all messages destined here
        msgArray = []
        for messageId in targetMessageBox.messages:
            message = Message.objects.filter(id=messageId).first()
            if message is None:
                targetMessageBox.messages.remove(messageId)
                targetMessageBox.save()
                continue
            # found
            msgFound = {}
            msgFound['id'] = message.id
            msgFound['time'] = message.time
            msgFound['state'] = message.state
            msgFound['content'] = message.content
            msgFound['url'] = message.url
            msgArray.append(msgFound)
        # reverse the order
        msgArray.reverse()
        return HttpResponse(json.dumps(msgArray, ensure_ascii=False))

@csrf_exempt
@login_required
def read(request):
    if request.method == "POST":
        id = request.POST.get('id')
        messageId = request.POST.get('messageId')
        # actually the userId
        targetMessageBox = MessageBox.objects.filter(userId=id).first()
        # if not found, create a new one
        if targetMessageBox is None:
            newMessageBox = MessageBox.objects.create(userId=id, messages=[])
            # find all messages destined here
            messages = Message.objects.filter(destUserId=id)
            for message in messages:
                newMessageBox.messages.append(message.id)
            targetMessageBox.save()
        # find the message
        message = Message.objects.filter(id=messageId).first()
        if message is None:
            return HttpResponse("No such message")
        # found
        message.state = 1
        message.save()
        return HttpResponse("Success")

@csrf_exempt
@login_required
def sendMessage(request):
    if request.method == "POST":
        receiverId = int(request.POST.get('receiverId'))
        time = request.POST.get('time')
        content = request.POST.get('content')
        toUrl = request.POST.get('toUrl')
        newMessage = Message.objects.create(destUserId=receiverId, time=time, state=0, content=content, url=toUrl)
        # find the receiver's message box
        targetMessageBox = MessageBox.objects.filter(userId=receiverId).first()
        # if not found, create a new one
        if targetMessageBox is None:
            newMessageBox = MessageBox.objects.create(userId=id, messages=[])
            # find all messages destined here
            messages = Message.objects.filter(destUserId=id)
            for message in messages:
                newMessageBox.messages.append(message.id)
            targetMessageBox.save()
        # add the message to the message box
        if newMessage.id not in targetMessageBox.messages:
            targetMessageBox.messages.append(newMessage.id)
            targetMessageBox.save()
        return HttpResponse("Success")

@csrf_exempt
@login_required
def deleteMessage(request):
    if request.method == "POST":
        id = request.POST.get('id')
        messageId = request.POST.get('messageId')
        # actually the userId
        targetMessageBox = MessageBox.objects.filter(userId=id).first()
        # if not found, create a new one
        if targetMessageBox is None:
            newMessageBox = MessageBox.objects.create(userId=id, messages=[])
            # find all messages destined here
            messages = Message.objects.filter(destUserId=id)
            for message in messages:
                newMessageBox.messages.append(message.id)
            targetMessageBox.save()
        # find the message
        if messageId not in targetMessageBox.messages:
            return HttpResponse("No such message")
        targetMessageBox.messages.remove(messageId)
        targetMessageBox.save()
        message = Message.objects.filter(id=messageId).first()
        message.delete()
        return HttpResponse("Success")
