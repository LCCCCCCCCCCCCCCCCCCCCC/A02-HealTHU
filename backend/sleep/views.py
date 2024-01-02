from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from utils.jwt import login_required
from .models import SleepInfo
from datetime import datetime,timedelta
import requests
import json


# Create your views here.
@csrf_exempt
@login_required
def changeSleep(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        date = request.POST.get('date')
        data = request.POST.get('data')
        if data is None:
            data = []
        else:
            data = json.loads(data)
        # find the corresponding user, if not exist, create one
        targetSleepInfo = SleepInfo.objects.filter(userId=id).first()
        if targetSleepInfo is None:
            targetSleepInfo = SleepInfo.objects.create(userId=id, sleepingInfo={})
        targetSleepInfo.sleepingInfo[date] = data
        print(targetSleepInfo.sleepingInfo)
        targetSleepInfo.save()
        return HttpResponse("Change Success")
@csrf_exempt
@login_required
def changeSleepState(request):
    if request.method == 'POST':
        # !!! no need to implement this function
        return HttpResponse("Change Success")
@login_required
def getSleep(request):
    if request.method == 'GET':
        id = int(request.GET.get('id'))
        date = request.GET.get('date')
        # for this day and the 7 days before,
        targetSleepInfo = SleepInfo.objects.filter(userId=id).first()
        targetSleepInfo = SleepInfo.objects.filter(userId=id).first()
        if targetSleepInfo is None:
            targetSleepInfo = SleepInfo.objects.create(userId=id, sleepingInfo={})
        targetSleepingInfo = targetSleepInfo.sleepingInfo
        sleepInfo = {}
        year, month, day = date.split('-')
        startDate = datetime(int(year), int(month), int(day))
        for timeDelta in range(8):
            currentDate = startDate + timedelta(days=-timeDelta)
            currentDateStr = currentDate.strftime("%Y-%m-%d")
            # if currentDateStr is one of targetSleepingInfo's key put key,val into sleepInfo
            if currentDateStr in targetSleepingInfo:
                sleepInfo[currentDateStr] = targetSleepingInfo[currentDateStr]
            else:
                sleepInfo[currentDateStr] = [0,0,0,0,0,0,0,0,0,0,0,0]
        return HttpResponse(json.dumps(sleepInfo, ensure_ascii=False))
