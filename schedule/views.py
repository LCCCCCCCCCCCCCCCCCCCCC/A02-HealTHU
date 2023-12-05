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
    if request.method == 'GET':
        id = request.GET.get("id") # the id of the schedule
        date = request.GET.get("date") # the date, in the form of "yyyy/mm/dd"
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # find in Schedule.todos by the date
            allTodos = targetSchedule.todos # JSONField
            targetTodos = [todo for todo in allTodos if todo['date'] == date]
            return HttpResponse(json.dumps(targetTodos, ensure_ascii=False))
        # else: not found
        return HttpResponse("Schedule not found", status=400)
           
def deleteTodo(request):
    if request.method == 'GET':
        id = request.GET.get("id")
        oldTodo = request.GET.get("oldTodo")
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # find in Schedule.todos by the date, title, start and end
            allTodos = targetSchedule.todos # JSONField 
            todoFound = False
            for todo in allTodos:
                if todo['date'] == oldTodo['date']\
                and todo['title'] == oldTodo['title']\
                and todo['start'] == oldTodo['start']\
                and todo['end'] == oldTodo['end']:
                    
                    todoFound = True
                    
                    todo.delete() # delte all todos with the same date, title, start and end
            if todoFound:
                return HttpResponse("Delete successfully")
            # nothitng to delete
            return HttpResponse("Todo not found", status=400)
        # else: not found
        return HttpResponse("Schedule not found", status=400)
                  
            
def changeTodo(request):
    if request.method == 'GET':
        id = request.GET.get("id")
        oldTodo = request.GET.get("oldTodo")
        newTodo = request.GET.get("newTodo")
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # find in Schedule.todos by the date, title, start and end
            allTodos = targetSchedule.todos
            todoFound = False
            for todo in allTodos:
                if todo['date'] == oldTodo['date']\
                and todo['title'] == oldTodo['title']\
                and todo['start'] == oldTodo['start']\
                and todo['end'] == oldTodo['end']:
                    
                    todoFound = True
                    
                    todo['date'] = newTodo['date']
                    todo['title'] = newTodo['title']
                    todo['start'] = newTodo['start']
                    todo['end'] = newTodo['end']
                    todo['label'] = newTodo['label']
                    todo['type'] = newTodo['type']
                    todo['state'] = newTodo['state']
                    todo['sportType'] = newTodo['sportType']
                    todo['sportState'] = newTodo['sportState']
            if todoFound:
                return HttpResponse("Change successfully")
            # nothing to change
            return HttpResponse("Todo not found", status=400)
        # else: not found
        return HttpResponse("Schedule not found", status=400)

def addAct(request):
    if request.method == 'GET':
        id = request.GET.get("id")
        activity = request.GET.get("activity")
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # todo: add activity to Schedule.initiActs
            return HttpResponse("Add successfully")
    return HttpResponse("Hello, world. You're at the schedule addAct.")

def deleteAct(request):
    return HttpResponse("Hello, world. You're at the schedule deleteAct.")

def changeAct(request):
    return HttpResponse("Hello, world. You're at the schedule changeAct.")

def findAct(request):
    return HttpResponse("Hello, world. You're at the schedule findAct.")

def partAct(request):
    return HttpResponse("Hello, world. You're at the schedule partAct.")
