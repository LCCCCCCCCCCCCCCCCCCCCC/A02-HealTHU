from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import SleepInfo
from datetime import datetime,timedelta
import requests
import json


# Create your views here.
@csrf_exempt
def changeSleep(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        date = request.POST.get('date')
        data = request.POST.get('data')
        # find the corresponding user, if not exist, create one
        targetSleepInfo = SleepInfo.objects.filter(userId=id)
        if targetSleepInfo is None:
            targetSleepInfo = SleepInfo.objects.create(userId=id, sleepingInfo={})
        targetSleepInfo.sleepingInfo[date] = data
        targetSleepInfo.save()
        return HttpResponse("Change Success")
    
@csrf_exempt
def changeSleepState(request):
    if request.method == 'POST':
        # !!! no need to implement this function
        return HttpResponse("Change Success")
    
def getSleep(request):
    if request.method == 'GET':
        id = int(request.GET.get('id'))
        date = request.GET.get('date')
        # for this day and the 7 days before,
        targetSleepInfo = SleepInfo.objects.filter(userId=id).first()
        if targetSleepInfo is None:
            targetSleepInfo = SleepInfo.objects.create(userId=id, sleepingInfo={})
        timeDelta = 0
        sleepInfo = {}
        while timeDelta >= -7:
            # date being a string, get thisDate as a new string that this date += timeDelta
            thisDate = datetime.strptime(date, '%Y-%m-%d') + timedelta(days=timeDelta)
            thisDate = thisDate.strftime('%Y-%m-%d')
            # if the date is not in the database, put a date, [0,0,0,0,0,0,0,0,0,0,0,0] into the dict
            if targetSleepInfo.sleepingInfo.get(thisDate) is None:
                sleepInfo[thisDate] = [0,0,0,0,0,0,0,0,0,0,0,0]
            else:
                sleepInfo[thisDate] = targetSleepInfo.sleepingInfo.get(thisDate)
            timeDelta -= 1
        print(sleepInfo)
        return HttpResponse(json.dumps(sleepInfo, ensure_ascii=False))
            
        
        
        
        








