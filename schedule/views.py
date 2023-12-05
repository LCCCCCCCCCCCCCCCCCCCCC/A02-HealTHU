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
