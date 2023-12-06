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
        oldTodoDate = request.GET.get("oldDate")
        oldTodoStart = request.GET.get("oldStart")
        oldTodoEnd = request.GET.get("oldEnd")
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # find in Schedule.todos by the date, start and end
            allTodos = targetSchedule.todos
            todoFound = False
            for todo in allTodos:
                if todo['date'] == oldTodoDate\
                and todo['start'] == oldTodoStart\
                and todo['end'] == oldTodoEnd:
                    todoFound = True
                    allTodos.remove(todo)
                    targetSchedule.save()
            if todoFound:
                return HttpResponse("Delete successfully")
            return HttpResponse("Todo not found", status=400)
        # else: not found
        return HttpResponse("Schedule not found", status=400)
                  
            
def changeTodo(request):
    if request.method == 'GET':
        id = request.GET.get("id")
        oldTodoDate = request.GET.get("oldDate")
        oldTodoStart = request.GET.get("oldStart")
        oldTodoEnd = request.GET.get("oldEnd")
        newTodoTitle = request.GET.get("newTitle")
        newTodoDate = request.GET.get("newDate")
        newTodoStart = request.GET.get("newStart")
        newTodoEnd = request.GET.get("newEnd")
        newTodoLabel = request.GET.get("newLabel")
        newTodoType = request.GET.get("newType")
        newTodoState = request.GET.get("newState")
        newTodoSportType = request.GET.get("newSportType")
        newTodoSportState = request.GET.get("newSportState")
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # find in Schedule.todos by the date, start and end
            allTodos = targetSchedule.todos
            todoFound = False
            for todo in allTodos:
                if todo['date'] == oldTodoDate\
                and todo['start'] == oldTodoStart\
                and todo['end'] == oldTodoEnd:
                    todoFound = True
                    todo['title'] = newTodoTitle
                    todo['date'] = newTodoDate
                    todo['start'] = newTodoStart
                    todo['end'] = newTodoEnd
                    todo['label'] = newTodoLabel
                    todo['type'] = newTodoType
                    todo['state'] = newTodoState
                    todo['sportType'] = newTodoSportType
                    todo['sportState'] = newTodoSportState
                    targetSchedule.save()
            if todoFound:
                return HttpResponse("Change successfully")
            return HttpResponse("Todo not found", status=400)

def addTodo(request):
    if request.method == 'GET':
        id = request.GET.get("id")
        todoTitle = request.GET.get("title")
        todoDate = request.GET.get("date")
        todoStart = request.GET.get("start")
        todoEnd = request.GET.get("end")
        todoLabel = request.GET.get("label")
        todoType = request.GET.get("type")
        todoState = request.GET.get("state")
        todoSportType = request.GET.get("sportType")
        todoSportState = request.GET.get("sportState")
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if not targetSchedule:
            # create a new schedule
            newSchedule = Schedule.objects.create(id=id, todos=[], partiActs=[], initiActs=[], appoints=[])
            newSchedule.save()
            targetSchedule = newSchedule
            pass
        # find in Schedule.todos by the date, title, start and end
        # put the new todo into Schedule.todos, which is a JSONField
        newTodo = {
            'title': todoTitle,
            'date': todoDate,
            'start': todoStart,
            'end': todoEnd,
            'label': todoLabel,
            'type': todoType,
            'state': todoState,
            'sportType': todoSportType,
            'sportState': todoSportState
        }
        targetSchedule.todos.append(newTodo)
        targetSchedule.save()
        return HttpResponse("Add successfully")
        

def addAct(request):
    if request.method == 'GET':
        id = request.GET.get("id")
        activity = request.GET.get("activity")
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # add activity to Schedule.initiActs, which is a JSONField
            # also add activity to Schedule.partActs, which is a JSONField
            targetSchedule.initiActs.append(activity)
            targetSchedule.partiActs.append(activity)
            targetSchedule.save()
            return HttpResponse("Add successfully")
        # else: not found
        return HttpResponse("Schedule not found", status=400)

def deleteAct(request):
    if request.method == 'GET':
        id = request.GET.get("id")
        activity = request.GET.get("activity")
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # delete activity from Schedule.initiActs, which is a JSONField
            # also delete activity from Schedule.partActs, which is a JSONField
            targetSchedule.initiActs.remove(activity)
            targetSchedule.partiActs.remove(activity)
            targetSchedule.save()
            return HttpResponse("Delete successfully")
        # else: not found
        return HttpResponse("Schedule not found", status=400)

def changeAct(request):
    return HttpResponse("Hello, world. You're at the schedule changeAct.")

def findAct(request):
    return HttpResponse("Hello, world. You're at the schedule findAct.")

def partAct(request):
    return HttpResponse("Hello, world. You're at the schedule partAct.")
