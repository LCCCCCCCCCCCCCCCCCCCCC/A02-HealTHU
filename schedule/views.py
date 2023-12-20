from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from apscheduler.schedulers.background import BackgroundScheduler

from .models import Schedule
from .models import Todo
from .models import Appointment
from .models import Comment
from .models import Application
from .models import Activity
from user.models import User
from .__init__ import access_token
import requests
import json
import datetime
import random

# Create your views here.

# 全局 todo 任务 list
todo_schedule = BackgroundScheduler()
todo_schedule.start()


# 微信提醒函数，参数为用户 openid,todo 项 name，开始时间，结束时间
def wx_reminder(touser, todoname, starttime, endtime):
    url = "https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=" + access_token
    data = {
        "template_id": "fHPE-sivPSATvWyAsqHrlIFKo6-6NN20DmVxFx8q4I8",
        "touser": touser,
        "page": "pages/personalcenter/mainpage",
        "data": {
            "thing1": {
                "value": todoname
            },
            "time2": {
                "value": starttime
            },
            "time9": {
                "value": endtime
            }
        },
        "miniprogram_state": "developer",
        "lang": "zh_CN"
    }
    response = requests.post(url, json=data)
    print(response.json())


def todos(request):
    if request.method == 'GET':
        id = request.GET.get("id")  # the id of the schedule
        date = request.GET.get("date")  # the date, in the form of "yyyy/mm/dd"
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # find in Schedule.todos by the date
            allTodos = targetSchedule.todos  # JSONField
            # NEW STUFF:
            # now todos store the id of the todo object, instead of the todo object itself
            ansArray = []
            for todoID in allTodos:
                todo = Todo.objects.filter(id=todoID).first()
                if todo:
                    # found
                    # check if the todo satisfies the date
                    if todo.date == date:
                        # put the todo into ansArray
                        newTodo = {
                            'title': todo.title,
                            'date': todo.date,
                            'start': todo.start,
                            'end': todo.end,
                            'label': todo.label,
                            'type': todo.type,
                            'state': todo.state,
                            'sportType': todo.sportType,
                            'sportState': todo.sportState,
                            'readOnly': todo.readOnly,
                            'promoter': todo.promoter
                        }
                        ansArray.append(newTodo)
            # return ansArray
            return HttpResponse(json.dumps(ansArray, ensure_ascii=False))
        # else: not found
        return HttpResponse(json.dumps([], ensure_ascii=False))


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
            # find in Schedule.todos by the date, start, end and title
            allTodos = targetSchedule.todos
            todoFound = False
            for todoID in allTodos:
                todo = Todo.objects.filter(id=todoID).first()
                if todo:
                    # exists
                    if todo.date == oldTodoDate \
                            and todo.start == oldTodoStart \
                            and todo.end == oldTodoEnd \
                            and todo.title == oldTodoTitle:
                        # a match
                        todoFound = True
                        if todo.type == "活动" or todo.type == "运动":
                            global todo_schedule
                            todo_schedule.remove_job(todo.jobId)
                        # delete not only the todoID in targetSchedule.todos;
                        allTodos.remove(todoID)
                        targetSchedule.save()
                        # but also the todo object itself in Todo.objects
                        todo.delete()
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
            # find in Schedule.todos by the date, start, end and title
            allTodos = targetSchedule.todos
            todoFound = False
            for todoID in allTodos:
                todo = Todo.objects.filter(id=todoID).first()
                if todo:
                    # exists
                    if todo.date == oldTodoDate \
                            and todo.start == oldTodoStart \
                            and todo.end == oldTodoEnd \
                            and todo.title == oldTodoTitle:
                        # a match
                        newjobId = ""
                        if todo.type == "活动" or todo.type == "运动":
                            global todo_schedule
                            todo_schedule.remove_job(todo.jobId)
                        if newTodoType == "活动" or newTodoType == "运动":
                            user = User.objects.filter(id=id).first()
                            touser = user.userid
                            todo_year, todo_month, todo_day = newTodoDate.split("/")
                            start_time = todo_year + "年" + todo_month + "月" + todo_day + "日" + " " + newTodoStart
                            end_time = todo_year + "年" + todo_month + "月" + todo_day + "日" + " " + newTodoEnd
                            remind_time = todo_year + "-" + todo_month + "-" + todo_day + " " + newTodoStart + ":00"
                            job = todo_schedule.add_job(wx_reminder, 'date', run_date=remind_time,
                                                        args=[touser, newTodoTitle, start_time, end_time])
                            print(job)
                            newjobId = job.id
                        todoFound = True
                        # change only the corresponding todo object in Todo.objects,
                        # since the todoID itself is not changed
                        todo.title = newTodoTitle
                        todo.date = newTodoDate
                        todo.start = newTodoStart
                        todo.end = newTodoEnd
                        todo.label = newTodoLabel
                        todo.type = newTodoType
                        todo.state = newTodoState
                        todo.sportType = newTodoSportType
                        todo.sportState = newTodoSportState
                        todo.jobId = newjobId
                        todo.save()
            if todoFound:
                return HttpResponse("Change successfully")
            return HttpResponse("Todo not found", status=400)
        # else: not found
        return HttpResponse("Schedule not found", status=400)


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
        todoReadOnly = request.POST.get("readOnly")
        jobId = ""
        # 添加定时向用户发送微信提醒
        if todoType == "活动" or todoType == "运动":
            user = User.objects.filter(id=id).first()
            touser = user.userid
            todo_year, todo_month, todo_day = todoDate.split("/")
            start_time = todo_year + "年" + todo_month + "月" + todo_day + "日" + " " + todoStart
            end_time = todo_year + "年" + todo_month + "月" + todo_day + "日" + " " + todoEnd
            remind_time = todo_year + "-" + todo_month + "-" + todo_day + " " + todoStart + ":00"
            global todo_schedule
            job = todo_schedule.add_job(wx_reminder, 'date', run_date=remind_time,
                                        args=[touser, todoTitle, start_time, end_time])
            print(job)
            jobId = job.id
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if not targetSchedule:
            # create a new schedule
            newSchedule = Schedule.objects.create(id=id, todos=[], partiActs=[], initiActs=[], appoints=[],
                                                  applications=[])
            newSchedule.save()
            targetSchedule = newSchedule
            pass
        # find in Schedule.todos by the date, title, start and end
        # put the new todoID into Schedule.todos, which is a JSONField
        # NEW STUFF:
        # first create a new Todo object
        newTodo = Todo.objects.create( \
            title=todoTitle, \
            date=todoDate, \
            start=todoStart, \
            end=todoEnd, \
            label=todoLabel, \
            type=todoType, \
            state=todoState, \
            sportType=todoSportType, \
            sportState=todoSportState, \
            readOnly=todoReadOnly, \
            promoter=id, \
            jobId=jobId)
        # then get the newTodo's id in Todo.objects
        newTodoId = newTodo.id
        # finally append this id into targetSchedule.todos
        targetSchedule.todos.append(newTodoId)
        targetSchedule.save()
        return HttpResponse("Add successfully")


@csrf_exempt
def doTodo(request):
    if request.method == 'POST':
        id = request.POST.get("id")
        todoDate = request.POST.get("date")
        todoStart = request.POST.get("start")
        todoEnd = request.POST.get("end")
        todoTitle = request.POST.get("title")
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # find in Schedule.todos by the date, start, end and title
            allTodos = targetSchedule.todos
            todoFound = False
            for todoID in allTodos:
                todo = Todo.objects.filter(id=todoID).first()
                if todo:
                    # exists
                    if todo.date == todoDate \
                            and todo.start == todoStart \
                            and todo.end == todoEnd \
                            and todo.title == todoTitle:
                        # found
                        # set the state to 1, and readOnly to True
                        todoFound = True
                        todo.state = 1
                        todo.readOnly = 1
                        todo.save()
            if todoFound:
                return HttpResponse("Do successfully")
            # else: todo not found
            return HttpResponse("Todo not found", status=400)
        # else: schedule not found
        return HttpResponse("Schedule not found", status=400)


@csrf_exempt
def addAct(request):
    if request.method == 'POST':
        id = request.POST.get("id")
        actPubTime = request.POST.get("pubTime")
        actTitle = request.POST.get("title")
        actPromoter = request.POST.get("promoter")
        actPartNumMin = request.POST.get("partNumMin")
        actPartNumMax = request.POST.get("partNumMax")
        actDate = request.POST.get("date")
        actStart = request.POST.get("start")
        actEnd = request.POST.get("end")
        actLabel = request.POST.get("label")
        actDetail = request.POST.get("detail")
        actState = request.POST.get("state")
        img = request.POST.get("images")
        parts = request.POST.get("participants")
        if parts:
            actParticipants = json.loads(parts)
        else:
            actParticipants = []
        if img:
            actImages = json.loads(img)
        else:
            actImages = []
        tags = request.POST.get("tags")
        if tags:
            actTags = json.loads(tags)
        else:
            actTags = []
        comments = request.POST.get("comments")
        if comments:
            actComments = json.loads(comments)
        else:
            actComments = []
        user = User.objects.filter(id=id).first()
        touser = user.userid
        todo_year, todo_month, todo_day = actDate.split("/")
        start_time = todo_year + "年" + todo_month + "月" + todo_day + "日" + " " + actStart
        end_time = todo_year + "年" + todo_month + "月" + todo_day + "日" + " " + actEnd
        remind_time = todo_year + "-" + todo_month + "-" + todo_day + " " + actStart + ":00"
        global todo_schedule
        job = todo_schedule.add_job(wx_reminder, 'date', run_date=remind_time,
                                    args=[touser, actTitle, start_time, end_time])
        print(job)
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if not targetSchedule:
            # create a new schedule
            newSchedule = Schedule.objects.create(id=id, todos=[], partiActs=[], initiActs=[], appoints=[],
                                                  applications=[])
            newSchedule.save()
            targetSchedule = newSchedule
            pass
        # >> put this into Activity.objects
        new_act = Activity.objects.create( \
            pubTime=actPubTime, \
            title=actTitle, \
            promoter=actPromoter, \
            participants=actParticipants, \
            partNumMin=actPartNumMin, \
            partNumMax=actPartNumMax, \
            date=actDate, \
            start=actStart, \
            end=actEnd, \
            label=actLabel, \
            detail=actDetail, \
            images=actImages, \
            tags=actTags, \
            state=actState, \
            comments=actComments)
        # >> get this new_act's id in Activity.objects
        new_act_id = new_act.id
        # append this id in targetSchedule.initiActs and targetSchedule.partiActs
        targetSchedule.initiActs.append(new_act_id)
        targetSchedule.partiActs.append(new_act_id)
        targetSchedule.save()
        # >> also append a newTodoID into targetSchedule.todos
        # the newTodo satisfy:
        # 1. type == "活动", state = 0, readOnly = True
        # 2. title = "(我发起的)"+actTitle, note the the braket are English brakets, instead of Chinese ones
        newTodo = Todo.objects.create( \
            title="(我发起的)" + actTitle, \
            date=actDate, \
            start=actStart, \
            end=actEnd, \
            label=actLabel, \
            type="活动", \
            state=0, \
            sportType=0, \
            sportState="", \
            readOnly=1, \
            promoter=actPromoter, \
            jobId=job.id)
        # >> get the newTodo's id in Todo.objects
        newTodoId = newTodo.id
        # >> append this id into targetSchedule.todos
        targetSchedule.todos.append(newTodoId)
        targetSchedule.save()
        return HttpResponse("Add successfully")


@csrf_exempt
def deleteAct(request):
    if request.method == 'POST':
        actId = request.POST.get("actId")
        # find the activity (if any) according to the actId
        targetAct = Activity.objects.filter(id=actId).first()
        if targetAct:
            # found
            # 1. first delete the activity in it's promoter's initiActs
            # , also: delete the corresponding todo in the promoter's schedule
            promoterId = targetAct.promoter
            # find the schedule (if any) according to the promoterId
            promotorSchedule = Schedule.objects.filter(id=promoterId).first()
            if promotorSchedule:
                # found
                # 1.1 delete the activity in promotorSchedule.initiActs
                promotorSchedule.initiActs.remove(actId)
                promotorSchedule.save()
                # 1.2 delete the corresponding todo
                allTodos = promotorSchedule.todos
                for todoID in allTodos:
                    todo = Todo.objects.filter(id=todoID).first()
                    if todo:
                        # found
                        if todo.title == "(我发起的)" + targetAct.title \
                                and todo.date == targetAct.date \
                                and todo.start == targetAct.start \
                                and todo.end == targetAct.end:
                            todoFound = True
                            global todo_schedule
                            todo_schedule.remove_job(todo.jobId)
                            # delete not only the todoID in promotorSchedule.todos;
                            allTodos.remove(todoID)
                            promotorSchedule.save()
                            # but also the todo object itself in Todo.objects
                            todo.delete()
            # 2. then delete the activity in it's participants' partiActs
            # , also: delete the corresponding todos in their schedules
            participantsId = targetAct.participants  # which is an array
            for participantId in participantsId:
                # find the schedule (if any) according to the participantId
                participantSchedule = Schedule.objects.filter(id=participantId).first()
                if participantSchedule:
                    # found
                    # 2.1 delete the activity in participantSchedule.partiActs
                    participantSchedule.partiActs.remove(actId)
                    participantSchedule.save()
                    # 2.2 delete the corresponding todo
                    allTodos = participantSchedule.todos
                    for todoID in allTodos:
                        todo = Todo.objects.filter(id=todoID).first()
                        if todo:
                            # found
                            if (todo.title == "(我参与的)" + targetAct.title \
                                or todo.title == "(申请中)" + targetAct.title) \
                                    and todo.date == targetAct.date \
                                    and todo.start == targetAct.start \
                                    and todo.end == targetAct.end:
                                todoFound = True
                                todo_schedule.remove_job(todo.jobId)
                                # delete not only the todoID in participantSchedule.todos;
                                allTodos.remove(todoID)
                                participantSchedule.save()
                                # but also the todo object itself in Todo.objects
                                todo.delete()
            # 3. finally delete the activity in Activity.objects
            targetAct.delete()
            return HttpResponse("Delete successfully")


@csrf_exempt
def changeAct(request):
    if request.method == 'POST':
        actId = request.POST.get("actId")
        newActTitle = request.POST.get("newTitle")
        newActPartNumMin = request.POST.get("newPartNumMin")
        newActPartNumMax = request.POST.get("newPartNumMax")
        newActLabel = request.POST.get("newLabel")
        newActDetail = request.POST.get("newDetail")
        img = request.POST.get("newImages")
        if img:
            newActImages = json.loads(img)
        else:
            newActImages = []
        tags = request.POST.get("newTags")
        if tags:
            newActTags = json.loads(tags)
        else:
            newActTags = []
        # find the activity (if any) according to the actId
        targetAct = Activity.objects.filter(id=actId).first()
        if targetAct:
            # found
            # first change the todos in Todo.objects
            promoter = targetAct.promoter
            promoterSchedule = Schedule.objects.filter(id=promoter).first()
            promoterTodos = promoterSchedule.todos
            for todoId in promoterTodos:
                todo = Todo.objects.filter(id=todoId).first()
                if todo:
                    # found
                    if todo.title == "(我发起的)" + targetAct.title \
                            and todo.date == targetAct.date \
                            and todo.start == targetAct.start \
                            and todo.end == targetAct.end:
                        # found
                        global todo_schedule
                        todo_schedule.remove_job(todo.jobId)
                        user = User.objects.filter(id=targetAct.promoter).first()
                        touser = user.userid
                        todo_year, todo_month, todo_day = targetAct.date.split("/")
                        start_time = todo_year + "年" + todo_month + "月" + todo_day + "日" + " " + targetAct.start
                        end_time = todo_year + "年" + todo_month + "月" + todo_day + "日" + " " + targetAct.end
                        remind_time = todo_year + "-" + todo_month + "-" + todo_day + " " + targetAct.start + ":00"
                        job = todo_schedule.add_job(wx_reminder, 'date', run_date=remind_time,
                                                    args=[touser, newActTitle, start_time, end_time])
                        print(job)
                        # change!
                        todo.title = "(我发起的)" + newActTitle
                        todo.label = newActLabel
                        todo.jobId = job.id
                        todo.save()
            participants = targetAct.participants
            for participantId in participants:
                participantSchedule = Schedule.objects.filter(id=participantId).first()
                participantTodos = participantSchedule.todos
                for todoId in participantTodos:
                    todo = Todo.objects.filter(id=todoId).first()
                    if todo:
                        # found
                        if todo.title == "(我参与的)" + targetAct.title \
                                and todo.date == targetAct.date \
                                and todo.start == targetAct.start \
                                and todo.end == targetAct.end:
                            # found
                            todo_schedule.remove_job(todo.jobId)
                            user = User.objects.filter(id=participantId).first()
                            touser = user.userid
                            todo_year, todo_month, todo_day = targetAct.date.split("/")
                            start_time = todo_year + "年" + todo_month + "月" + todo_day + "日" + " " + targetAct.start
                            end_time = todo_year + "年" + todo_month + "月" + todo_day + "日" + " " + targetAct.end
                            remind_time = todo_year + "-" + todo_month + "-" + todo_day + " " + targetAct.start + ":00"
                            job = todo_schedule.add_job(wx_reminder, 'date', run_date=remind_time,
                                                        args=[touser, newActTitle, start_time, end_time])
                            print(job)
                            # change!
                            todo.title = "(我参与的)" + newActTitle
                            todo.label = newActLabel
                            todo.jobId = job.id
                            todo.save()
                        if todo.title == "(申请中)" + targetAct.title \
                                and todo.date == targetAct.date \
                                and todo.start == targetAct.start \
                                and todo.end == targetAct.end:
                            # found
                            # change!
                            todo.title = "(申请中)" + newActTitle
                            todo.label = newActLabel
                            todo.save()
            # then change the activity in Activity.objects
            targetAct.title = newActTitle
            targetAct.partNumMin = newActPartNumMin
            targetAct.partNumMax = newActPartNumMax
            targetAct.label = newActLabel
            targetAct.detail = newActDetail
            targetAct.images = newActImages
            targetAct.tags = newActTags
            targetAct.save()
            return HttpResponse("Change successfully")
        # else: not found
        return HttpResponse("Activity not found", status=400)


def findAct(request):
    if request.method == 'GET':
        ansArray = []
        promoterId = request.GET.get("promoter")  # optional
        participantsId = request.GET.get("participants")  # optional
        keyForSearch = request.GET.get("keyForSearch")  # optional
        minDate = request.GET.get("minDate")  # optional, >= minDate
        maxDate = request.GET.get("maxDate")  # optional, <= maxDate
        # note that the preceding five params are filters that are conencted by OR
        # i.e. activities satisfiying any of the five filters will be returned
        isRandom = request.GET.get("isRandom")
        ansArray = []
        # find in Activity.objects by the five filters
        if participantsId:
            participantsId = json.loads(participantsId)
            set_of_participantsId = set(participantsId)
        for act in Activity.objects.all():
            # check if the activity satisfies the filters
            if promoterId and act.promoter != int(promoterId):
                print("DEBUG: promoterId not satisfied")
                continue
            if participantsId and not set_of_participantsId.intersection(set(act.participants)):
                print("DEBUG: promoterId not satisfied")
                continue
            if keyForSearch and (keyForSearch not in act.title) and (keyForSearch not in act.detail):
                print("DEBUG: promoterId not satisfied")
                continue
            if minDate and act.date < minDate:
                print("DEBUG: promoterId not satisfied")
                continue
            if maxDate and act.date > maxDate:
                print("DEBUG: promoterId not satisfied")
                continue
            # if the activity satisfies the filters, put it into ansArray
            newAct = {
                'id': act.id,
                'title': act.title,
                'promoter': act.promoter,
                'participants': act.participants,
                'partNumMin': act.partNumMin,
                'partNumMax': act.partNumMax,
                'date': act.date,
                'start': act.start,
                'end': act.end,
                'label': act.label,
                'detail': act.detail,
                'images': act.images,
                'tags': act.tags,
                'state': act.state,
                'comments': act.comments
            }
            ansArray.append(newAct)  
        # now ansArray contains all the activities that satisfy the filters
        # now check id isRandom == 1
        if isRandom and isRandom == "1":
            # isRandom == 1
            # if ansArray has <= 20 elems: just shuffle
            # else: shuffle and cut
            if len(ansArray) <= 20:
                # just shuffle
                random.shuffle(ansArray)
            else:
                # shuffle and cut
                random.shuffle(ansArray)
                ansArray = ansArray[:20]
        # return ansArray
        return HttpResponse(json.dumps(ansArray, ensure_ascii=False))


def getActDetail(request):
    if request.method == 'GET':
        actId = request.GET.get("actId")
        # find the activity (if any) according to the actId
        targetAct = Activity.objects.filter(id=actId).first()
        if targetAct:
            # found
            # return the activity
            # since id is a PK, there is only one activity, so we can return directly
            newAct = {
                'id': targetAct.id,
                'title': targetAct.title,
                'promoter': targetAct.promoter,
                'participants': targetAct.participants,
                'partNumMin': targetAct.partNumMin,
                'partNumMax': targetAct.partNumMax,
                'date': targetAct.date,
                'start': targetAct.start,
                'end': targetAct.end,
                'label': targetAct.label,
                'detail': targetAct.detail,
                'images': targetAct.images,
                'tags': targetAct.tags,
                'state': targetAct.state,
                'comments': targetAct.comments
            }
            return HttpResponse(json.dumps(newAct, ensure_ascii=False))
        # else: not found
        return HttpResponse("Activity not found", status=400)


@csrf_exempt
def partAct(request):
    if request.method == 'POST':
        id = request.POST.get("id")
        otherId = request.POST.get("otherId")
        actId = request.POST.get("actId")
        message = request.POST.get("message")
        # send a apply message about actId from id to otherId
        # first, find id and otherId in Schedule.objects
        senderSchedule = Schedule.objects.filter(id=id).first()
        receiverSchedule = Schedule.objects.filter(id=otherId).first()
        if not senderSchedule:
            # create a new schedule
            newSchedule = Schedule.objects.create(id=id, todos=[], partiActs=[], initiActs=[], appoints=[],
                                                  applications=[])
            newSchedule.save()
            senderSchedule = newSchedule
        if senderSchedule and receiverSchedule:
            # both found
            # then, find actId in Activity.objects
            targetAct = Activity.objects.filter(id=actId).first()
            if targetAct:
                # found
                # then, append a new Application to receiverSchedule.appoints
                newApplication = Application.objects.create( \
                    applyerId=id, \
                    actId=actId, \
                    message=message, \
                    title="关于活动\'" + targetAct.title + "\'的申请")
                receiverSchedule.applications.append(newApplication.id)
                receiverSchedule.save()
                # next: put a todo in senderSchedule.todos
                # try check the corresponding todo in receiverSchedule.todos

                newTodo = Todo.objects.create( \
                    title="(申请中)" + targetAct.title, \
                    date=targetAct.date, \
                    start=targetAct.start, \
                    end=targetAct.end, \
                    label=targetAct.label, \
                    type="活动", \
                    state=0, \
                    sportType=0, \
                    sportState="", \
                    readOnly=1, \
                    promoter=otherId, \
                    jobId="")
                senderSchedule.todos.append(newTodo.id)
                senderSchedule.save()
                return HttpResponse("Apply successfully")
            # else: not found
            return HttpResponse("Activity not found", status=400)


def getApplication(request):
    if request.method == 'GET':
        id = request.GET.get("id")
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # found
            # find all applications in targetSchedule.applications
            allApplications = targetSchedule.applications
            ansArray = []
            for applicationID in allApplications:
                application = Application.objects.filter(id=applicationID).first()
                if application:
                    # found
                    newApplication = {
                        'id': application.id,
                        'applyerId': application.applyerId,
                        'actId': application.actId,
                        'message': application.message,
                        'title': application.title
                    }
                    ansArray.append(newApplication)
            return HttpResponse(json.dumps(ansArray, ensure_ascii=False))
        # else: not found
        return HttpResponse("Schedule not found", status=400)


@csrf_exempt
def appReply(request):
    if request.method == 'POST':
        id = request.POST.get("id")
        applicationId = request.POST.get("applicationId")
        isAgree = request.POST.get("isAgree")  # 0 <--> false, 1 <--> true
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # found
            # find the info of the application
            application = Application.objects.filter(id=applicationId).first()
            if application:
                # found
                # get the info of this application
                applyerId = application.applyerId
                actId = application.actId
                applicantSchedule = Schedule.objects.filter(id=applyerId).first()
                activity = Activity.objects.filter(id=actId).first()
                # find the corresponding todo in applicantSchedule.
                allTodos = applicantSchedule.todos
                for todoId in allTodos:
                    todo = Todo.objects.filter(id=todoId).first()
                    if todo:
                        # found
                        if todo.title == "(申请中)" + activity.title \
                                and todo.date == activity.date \
                                and todo.start == activity.start \
                                and todo.end == activity.end:
                            # found
                            if isAgree == 1:
                                # agree
                                # change the corresponding todo
                                user = User.objects.filter(id=id).first()
                                touser = user.userid
                                todo_year, todo_month, todo_day = todo.date.split("/")
                                start_time = todo_year + "年" + todo_month + "月" + todo_day + "日" + " " + todo.start
                                end_time = todo_year + "年" + todo_month + "月" + todo_day + "日" + " " + todo.end
                                remind_time = todo_year + "-" + todo_month + "-" + todo_day + " " + todo.start + ":00"
                                global todo_schedule
                                job = todo_schedule.add_job(wx_reminder, 'date', run_date=remind_time,
                                                            args=[touser, activity.title, start_time, end_time])
                                print(job)

                                todo.title = "(我参与的)" + activity.title
                                todo.readOnly = 1
                                todo.jobId = job.id
                                todo.save()
                                # add the applicant to activity.participants
                                activity.participants.append(applyerId)
                                activity.save()
                            else:
                                # isAgree == 0, disagree
                                # delete the corresponding todo
                                applicantSchedule.todos.remove(todoId)
                                applicantSchedule.save()
                                todo.delete()
                                # do nothing to activity.participants
                            # whatever the result is, delete the application
                            targetSchedule.applications.remove(applicationId)
                            targetSchedule.save()
                            application.delete()
                            return HttpResponse("Reply successfully")
            # else: not found
            return HttpResponse("Application not found", status=400)
        # else: not found
        return HttpResponse("Schedule not found", status=400)


def nDays(date, n):
    # date is a string in the form of "yyyy/mm/dd"
    # n>0 is an integer
    # output is an array, whose elements are strings in the form of "yyyy/mm/dd"
    # the output array has n elements, starting from date
    # for example, nDays("2020/12/31", 3) = ["2020/12/31", "2021/01/01", "2021/01/02"]
    # Note that the 'date' is included
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
        ddlRange = int(request.GET.get("range"))
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
                for todoID in allTodos:
                    todo = Todo.objects.filter(id=todoID).first()
                    if todo:
                        # exists
                        if todo.date == date \
                                and todo.type == "ddl":
                            # a match
                            newTodo = {
                                'title': todo.title,
                                'date': todo.date,
                                'start': todo.start,
                                'end': todo.end,
                                'label': todo.label,
                                'type': todo.type,
                                'state': todo.state,
                                'sportType': todo.sportType,
                                'sportState': todo.sportState,
                                'readOnly': todo.readOnly
                            }
                            targetTodos.append(newTodo)
            return HttpResponse(json.dumps(targetTodos, ensure_ascii=False))
        # else: not found
        return HttpResponse(json.dumps([], ensure_ascii=False))
    
 
@csrf_exempt   
def exitAct(request):
    if request.method == 'POST':
        id = request.POST.get("id")
        exitId = request.POST.get("exitId")
        actId = request.POST.get("actId")
        # the exitId wishes to exit the actId promoted by id
        promoterSchedule = Schedule.objects.filter(id=id).first()
        exiterSchedule = Schedule.objects.filter(id=exitId).first()
        targetAct = Activity.objects.filter(id=actId).first()
        if promoterSchedule and exiterSchedule and targetAct:
            # all three found
            # remove this participant from targetAct.participants
            targetAct.participants.remove(exitId)
            targetAct.save()
            # then, remove the corresponding todo in exiterSchedule.todos
            allTodos = exiterSchedule.todos
            todoFound = False
            for todoId in allTodos:
                todo = Todo.objects.filter(id=todoId).first()
                if todo:
                    # found
                    if (todo.title == "(我参与的)" + targetAct.title \
                        or todo.title == "(申请中)" + targetAct.title) \
                        and todo.date == targetAct.date \
                        and todo.start == targetAct.start \
                        and todo.end == targetAct.end:
                        # found
                        # delete the corresponding todo
                        todoFound = True
                        global todo_schedule
                        todo_schedule.remove_job(todo.jobId)
                        exiterSchedule.todos.remove(todoId)
                        exiterSchedule.save()
                        todo.delete()
            if todoFound:
                return HttpResponse("Exit successfully")
            # else: todo not found
            return HttpResponse("Todo not found")
        # else: not found
        return HttpResponse("Schedule or activity not found")
    

@csrf_exempt
def commentAct(request):
    if request.method == 'POST':
        commenterId = request.POST.get("commenterId")
        actId = request.POST.get("actId")
        comment = request.POST.get("comment")
        pubTime = request.POST.get("pubTime")
        targetUser = User.objects.filter(id=commenterId).first()
        targetAct = Activity.objects.filter(id=actId).first()
        if targetUser and targetAct:
            commenterAvatarUrl = targetUser.userInfo.avatarUrl
            commenterNickName = targetUser.userInfo.nickName
            newComment = Comment.objects.create( \
                commenterId=commenterId, \
                nickname=commenterNickName, \
                avatarUrl=commenterAvatarUrl, \
                actId=actId, \
                comment=comment, \
                likes=0, \
                likesId=[], \
                pubTime=pubTime)
            newCommentDict = {
                'id': newComment.id,
                'commenterId': newComment.commenterId,
                'nickname': newComment.nickname,
                'avatarUrl': newComment.avatarUrl,
                'actId': newComment.actId,
                'comment': newComment.comment,
                'likes': newComment.likes,
                'likesId': newComment.likesId,
                'pubTime': newComment.pubTime
            }
            targetAct.comments.append(newCommentDict)
            targetAct.save()
            return HttpResponse("Comment successfully")
        # else: not found
        return HttpResponse("User or activity not found")
                
        
    
@csrf_exempt
def likeComment(request):
    if request.method == 'POST':
        id = int(request.POST.get("id"))
        actId = int(request.POST.get("actId"))
        likerId = int(request.POST.get("likerId"))
        # likerId likes the comment id in activity actId
        targetAct = Activity.objects.filter(id=actId).first()
        if targetAct:
            # found
             # first, change the corresponding Comment object in Comment.objects as well
            targetComment = Comment.objects.filter(id=id).first()
            if targetComment:
                # found
                # check if already liked
                if likerId in targetComment.likesId:
                    # already liked
                    return HttpResponse("Already liked")
                # else: not liked
                targetComment.likesId.append(likerId)
                targetComment.likes += 1
                targetComment.save()
            allComments = targetAct.comments
            for comment in allComments:
                # print out the comment
                if comment['id'] == id:
                    # found
                    # then check if likerId is in comment.likesId
                    if likerId in comment['likesId']:
                        # likerId is already in comment.likesId
                        continue
                    # else: likerId is not in comment.likesId
                    # append likerId to comment.likesId
                    comment['likesId'].append(likerId)
                    comment['likes'] += 1
                    targetAct.save()
                    return HttpResponse("Like successfully")
            # else: not found
            return HttpResponse("Comment not found")
        # else: not found
        return HttpResponse("Activity not found")



@csrf_exempt
def dislikeComment(request):
    if request.method == 'POST':
        id = int(request.POST.get("id"))
        actId = int(request.POST.get("actId"))
        dislikerId = int(request.POST.get("dislikerId"))
        # dislikerId dislikes the comment id in activity actId
        targetAct = Activity.objects.filter(id=actId).first()
        if targetAct:
            # found
             # first, change the corresponding Comment object in Comment.objects as well
            targetComment = Comment.objects.filter(id=id).first()
            if targetComment:
                # found
                # check if already liked
                if dislikerId not in targetComment.likesId:
                    # already disliked
                    return HttpResponse("Already disliked")
                # else: not disliked
                targetComment.likesId.remove(dislikerId)
                targetComment.likes -= 1
                targetComment.save()
            allComments = targetAct.comments
            for comment in allComments:
                if comment['id'] == id:
                    # found
                    # then check if dislikerId is in comment.likesId
                    if dislikerId not in comment['likesId']:
                        # dislikerId is already not in comment.likesId
                        continue
                    # else: dislikerId is in comment.likesId
                    # remove dislikerId from comment.likesId
                    comment['likesId'].remove(dislikerId)
                    comment['likes'] -= 1
                    targetAct.save()
                    return HttpResponse("Dislike successfully")
            # else: not found
            return HttpResponse("Comment not found")
        # else: not found
        return HttpResponse("Activity not found")

@csrf_exempt
def deleteComment(request):
    if request.method == 'POST':
        id = int(request.POST.get("id"))
        actId = int(request.POST.get("actId"))
        targetAct = Activity.objects.filter(id=actId).first()
        targetComment = Comment.objects.filter(id=id).first()
        if targetAct:
            if targetComment:
                # both found
                # delete the comment in Activity.objects
                for comment in targetAct.comments:
                    if comment['id'] == id:
                        # found
                        targetAct.comments.remove(comment)
                        targetAct.save()
                        # delete the comment itself in Comment.objects
                        targetComment.delete()
                        return HttpResponse("Delete successfully")
            # else: not found
            return HttpResponse("Comment not found")
        # else: not found
        return HttpResponse("Activity not found")