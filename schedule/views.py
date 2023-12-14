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

@csrf_exempt
def deleteTodo(request):
    if request.method == 'POST':
        id = request.POST.get("id")
        oldTodoDate = request.POST.get("oldDate")
        oldTodoStart = request.POST.get("oldStart")
        oldTodoEnd = request.POST.get("oldEnd")
        oldTodoTitle = request.POST.get("oldTitle")
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # find in Schedule.todos by the date, start and end
            allTodos = targetSchedule.todos
            todoFound = False
            for todo in allTodos:
                if todo['date'] == oldTodoDate\
                and todo['start'] == oldTodoStart\
                and todo['end'] == oldTodoEnd\
                and todo['title'] == oldTodoTitle:
                    todoFound = True
                    allTodos.remove(todo)
                    targetSchedule.save()
            if todoFound:
                return HttpResponse("Delete successfully")
            return HttpResponse("Todo not found", status=400)
        # else: not found
        return HttpResponse("Schedule not found", status=400)
                  
@csrf_exempt
def changeTodo(request):
    if request.method == 'POST':
        id = request.POST.get("id")
        oldTodoDate = request.POST.get("oldDate")
        oldTodoStart = request.POST.get("oldStart")
        oldTodoEnd = request.POST.get("oldEnd")
        oldTodoTitle = request.POST.get("oldTitle")
        newTodoTitle = request.POST.get("newTitle")
        newTodoDate = request.POST.get("newDate")
        newTodoStart = request.POST.get("newStart")
        newTodoEnd = request.POST.get("newEnd")
        newTodoLabel = request.POST.get("newLabel")
        newTodoType = request.POST.get("newType")
        newTodoState = request.POST.get("newState")
        newTodoSportType = request.POST.get("newSportType")
        newTodoSportState = request.POST.get("newSportState")
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # find in Schedule.todos by the date, start and end
            allTodos = targetSchedule.todos
            todoFound = False
            for todo in allTodos:
                if todo['date'] == oldTodoDate\
                and todo['start'] == oldTodoStart\
                and todo['end'] == oldTodoEnd\
                and todo['title'] == oldTodoTitle:
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

@csrf_exempt
def addTodo(request):
    if request.method == 'POST':
        id = request.POST.get("id")
        todoTitle = request.POST.get("title")
        todoDate = request.POST.get("date")
        todoStart = request.POST.get("start")
        todoEnd = request.POST.get("end")
        todoLabel = request.POST.get("label")
        todoType = request.POST.get("type")
        todoState = request.POST.get("state")
        todoSportType = request.POST.get("sportType")
        todoSportState = request.POST.get("sportState")
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
        

@csrf_exempt
def addAct(request):
    if request.method == 'POST':
        id = request.POST.get("id")
        actTitle = request.POST.get("title")
        actPromoter = request.POST.get("promoter")
        actParticipants = request.POST.get("participants")
        actPartNumMin = request.POST.get("partNumMin")
        actPartNumMax = request.POST.get("partNumMax")
        actDate = request.POST.get("date")
        actStart = request.POST.get("start")
        actEnd = request.POST.get("end")
        actLabel = request.POST.get("label")
        actDetail = request.POST.get("detail")
        actImages = request.POST.get("images")
        actTags = request.POST.get("tags")
        actState = request.POST.get("state")
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
        newAct = {
            'title': actTitle,
            'promoter': actPromoter,
            'participants': actParticipants,
            'partNumMin': actPartNumMin,
            'partNumMax': actPartNumMax,
            'date': actDate,
            'start': actStart,
            'end': actEnd,
            'label': actLabel,
            'detail': actDetail,
            'images': actImages,
            'tags': actTags,
            'state': actState
        }
        targetSchedule.initiActs.append(newAct)
        targetSchedule.save()
        # then: add a todo according to the act
        # the todo is basically the same as the act
        # except that its title = "(我发起的)"+actTitle
        newTodo = {
            'title': "(我发起的)"+actTitle,
            'date': actDate,
            'start': actStart,
            'end': actEnd,
            'label': actLabel,
            'type': "活动",
            'state': 0,
            'sportType': "0",
            'sportState': "0",
            'readOnly': True
        }
        targetSchedule.todos.append(newTodo)
        targetSchedule.save()
        return HttpResponse("Add successfully")

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

def nDays(date, n):
    # date is a string in the form of "yyyy/mm/dd"
    # n>0 is an integer
    # output is an array, whose elements are strings in the form of "yyyy/mm/dd"
    # the output array has n elements, starting from date
    # for example, nDays("2020/12/31", 3) = ["2020/12/31", "2021/01/01", "2021/01/02"]
    # Note that the 'date' is included
    import datetime
    year = int(date[0:4])
    month = int(date[5:7])
    day = int(date[8:10])
    startDate = datetime.date(year, month, day)
    ansArray = []
    for i in range(n):
        # i = 0, 1, 2, ..., n-1
        thisDay = startDate
        thisDay += datetime.timedelta(days=i)
        # convert thisDay to "yyyy/mm/dd"
        thisDayStr = str(thisDay)
        thisDayStr = thisDayStr.replace("-", "/")
        # add thisDayStr to the output array
        ansArray.append(thisDayStr)
    return ansArray
    

def getddl(request):
    if request.method == 'GET':
        id = request.GET.get("id")
        date = request.GET.get("date")
        ddlRange = request.GET.get("range")
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            allTodos = targetSchedule.todos
            dateArray = nDays(date, ddlRange)
            targetTodos = []
            # find all Todos:
            # 1. whose date is in dateArray
            # 2. whose type is "ddl"
            for date in dateArray:
                # find in Schedule.todos by the date
                for todo in allTodos:
                    if todo['date'] == date and todo['type'] == "ddl":
                        targetTodos.append(todo)
            return HttpResponse(json.dumps(targetTodos, ensure_ascii=False))
        # else: not found
        return HttpResponse("Schedule not found", status=400)