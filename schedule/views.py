from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Schedule
from .models import Todo
from .models import Appointment
from .models import Activity
import requests
import json
# Create your views here.
def todos(request):
    return HttpResponse("Hello, world. You're at the schedule todos.")

def changeTodo(request):
    return HttpResponse("Hello, world. You're at the schedule changeTodo.")

def addAct(request):
    return HttpResponse("Hello, world. You're at the schedule addAct.")

def findAct(request):
    return HttpResponse("Hello, world. You're at the schedule findAct.")

def partAct(request):
    return HttpResponse("Hello, world. You're at the schedule partAct.")
