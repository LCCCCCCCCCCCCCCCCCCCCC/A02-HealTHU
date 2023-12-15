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
import datetime
import random
# Create your views here.
def todos(request):
        # if request.method == 'GET':
        #     id = request.GET.get("id") # the id of the schedule
        #     date = request.GET.get("date") # the date, in the form of "yyyy/mm/dd"
        #     # find the schedule (if any) according to the id
        #     targetSchedule = Schedule.objects.filter(id=id).first()
        #     if targetSchedule:
        #         # find in Schedule.todos by the date
        #         allTodos = targetSchedule.todos # JSONField
        #         targetTodos = [todo for todo in allTodos if todo['date'] == date]
        #         return HttpResponse(json.dumps(targetTodos, ensure_ascii=False))
        #     # else: not found
        #     return HttpResponse("Schedule not found", status=400)
    if request.method == 'GET':
        id = request.GET.get("id") # the id of the schedule
        date = request.GET.get("date") # the date, in the form of "yyyy/mm/dd"
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if targetSchedule:
            # find in Schedule.todos by the date
            allTodos = targetSchedule.todos # JSONField
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
        return HttpResponse("Schedule not found", status=400)

@csrf_exempt
def deleteTodo(request):
        # if request.method == 'POST':
        #     id = request.POST.get("id")
        #     oldTodoDate = request.POST.get("oldDate")
        #     oldTodoStart = request.POST.get("oldStart")
        #     oldTodoEnd = request.POST.get("oldEnd")
        #     oldTodoTitle = request.POST.get("oldTitle")
        #     # find the schedule (if any) according to the id
        #     targetSchedule = Schedule.objects.filter(id=id).first()
        #     if targetSchedule:
        #         # find in Schedule.todos by the date, start and end
        #         allTodos = targetSchedule.todos
        #         todoFound = False
        #         for todo in allTodos:
        #             if todo['date'] == oldTodoDate\
        #             and todo['start'] == oldTodoStart\
        #             and todo['end'] == oldTodoEnd\
        #             and todo['title'] == oldTodoTitle:
        #                 todoFound = True
        #                 allTodos.remove(todo)
        #                 targetSchedule.save()
        #         if todoFound:
        #             return HttpResponse("Delete successfully")
        #         return HttpResponse("Todo not found", status=400)
        #     # else: not found
        #     return HttpResponse("Schedule not found", status=400)
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
                    if todo.date == oldTodoDate\
                    and todo.start == oldTodoStart\
                    and todo.end == oldTodoEnd\
                    and todo.title == oldTodoTitle:
                        # a match
                        todoFound = True
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
        # if request.method == 'POST':
        #     id = request.POST.get("id")
        #     oldTodoDate = request.POST.get("oldDate")
        #     oldTodoStart = request.POST.get("oldStart")
        #     oldTodoEnd = request.POST.get("oldEnd")
        #     oldTodoTitle = request.POST.get("oldTitle")
        #     newTodoTitle = request.POST.get("newTitle")
        #     newTodoDate = request.POST.get("newDate")
        #     newTodoStart = request.POST.get("newStart")
        #     newTodoEnd = request.POST.get("newEnd")
        #     newTodoLabel = request.POST.get("newLabel")
        #     newTodoType = request.POST.get("newType")
        #     newTodoState = request.POST.get("newState")
        #     newTodoSportType = request.POST.get("newSportType")
        #     newTodoSportState = request.POST.get("newSportState")
        #     # find the schedule (if any) according to the id
        #     targetSchedule = Schedule.objects.filter(id=id).first()
        #     if targetSchedule:
        #         # find in Schedule.todos by the date, start and end
        #         allTodos = targetSchedule.todos
        #         todoFound = False
        #         for todo in allTodos:
        #             if todo['date'] == oldTodoDate\
        #             and todo['start'] == oldTodoStart\
        #             and todo['end'] == oldTodoEnd\
        #             and todo['title'] == oldTodoTitle:
        #                 todoFound = True
        #                 todo['title'] = newTodoTitle
        #                 todo['date'] = newTodoDate
        #                 todo['start'] = newTodoStart
        #                 todo['end'] = newTodoEnd
        #                 todo['label'] = newTodoLabel
        #                 todo['type'] = newTodoType
        #                 todo['state'] = newTodoState
        #                 todo['sportType'] = newTodoSportType
        #                 todo['sportState'] = newTodoSportState
        #                 targetSchedule.save()
        #         if todoFound:
        #             return HttpResponse("Change successfully")
        #         return HttpResponse("Todo not found", status=400)
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
                    if todo.date == oldTodoDate\
                    and todo.start == oldTodoStart\
                    and todo.end == oldTodoEnd\
                    and todo.title == oldTodoTitle:
                        # a match
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
                        todo.save()
            if todoFound:
                return HttpResponse("Change successfully")
            return HttpResponse("Todo not found", status=400)
        # else: not found
        return HttpResponse("Schedule not found", status=400)

@csrf_exempt
def addTodo(request):
        # if request.method == 'POST':
        #     id = request.POST.get("id")
        #     todoTitle = request.POST.get("title")
        #     todoDate = request.POST.get("date")
        #     todoStart = request.POST.get("start")
        #     todoEnd = request.POST.get("end")
        #     todoLabel = request.POST.get("label")
        #     todoType = request.POST.get("type")
        #     todoState = request.POST.get("state")
        #     todoSportType = request.POST.get("sportType")
        #     todoSportState = request.POST.get("sportState")
        #     todoReadOnly = request.POST.get("readOnly")
        #     # find the schedule (if any) according to the id
        #     targetSchedule = Schedule.objects.filter(id=id).first()
        #     if not targetSchedule:
        #         # create a new schedule
        #         newSchedule = Schedule.objects.create(id=id, todos=[], partiActs=[], initiActs=[], appoints=[])
        #         newSchedule.save()
        #         targetSchedule = newSchedule
        #         pass
        #     # find in Schedule.todos by the date, title, start and end
        #     # put the new todo into Schedule.todos, which is a JSONField
        #     newTodo = {
        #         'title': todoTitle,
        #         'date': todoDate,
        #         'start': todoStart,
        #         'end': todoEnd,
        #         'label': todoLabel,
        #         'type': todoType,
        #         'state': todoState,
        #         'sportType': todoSportType,
        #         'sportState': todoSportState,
        #         'readOnly': todoReadOnly
        #     }
        #     targetSchedule.todos.append(newTodo)
        #     targetSchedule.save()
        #     return HttpResponse("Add successfully")
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
        # find the schedule (if any) according to the id
        targetSchedule = Schedule.objects.filter(id=id).first()
        if not targetSchedule:
            # create a new schedule
            newSchedule = Schedule.objects.create(id=id, todos=[], partiActs=[], initiActs=[], appoints=[])
            newSchedule.save()
            targetSchedule = newSchedule
            pass
        # find in Schedule.todos by the date, title, start and end
        # put the new todoID into Schedule.todos, which is a JSONField
        # NEW STUFF:
        # first create a new Todo object
        newTodo = Todo.objects.create(\
            title=todoTitle,\
            date=todoDate,\
            start=todoStart,\
            end=todoEnd,\
            label=todoLabel,\
            type=todoType,\
            state=todoState,\
            sportType=todoSportType,\
            sportState=todoSportState,\
            readOnly=todoReadOnly,\
            promoter=id)
        # then get the newTodo's id in Todo.objects
        newTodoId = newTodo.id
        # finally append this id into targetSchedule.todos
        targetSchedule.todos.append(newTodoId)
        targetSchedule.save()
        return HttpResponse("Add successfully")

@csrf_exempt 
def doTodo(request):
        # if request.method == 'POST':
        #     id = request.POST.get("id")
        #     todoDate = request.POST.get("date")
        #     todoStart = request.POST.get("start")
        #     todoEnd = request.POST.get("end")
        #     todoTitle = request.POST.get("title")
        #     # find the schedule (if any) according to the id
        #     targetSchedule = Schedule.objects.filter(id=id).first()
        #     if targetSchedule:
        #         # find in Schedule.todos by the date, start, end and title
        #         allTodos = targetSchedule.todos
        #         todoFound = False
        #         for todo in allTodos:
        #             if todo['date'] == todoDate\
        #             and todo['start'] == todoStart\
        #             and todo['end'] == todoEnd\
        #             and todo['title'] == todoTitle:
        #                 # found
        #                 # set the state to 1, and readOnly to True
        #                 todoFound = True
        #                 todo['state'] = 1
        #                 todo['readOnly'] = True
        #                 targetSchedule.save()
        #         if todoFound:
        #             return HttpResponse("Do successfully")
        #         # else: todo not found
        #         return HttpResponse("Todo not found", status=400)
        #     # else: schedule not found
        #     return HttpResponse("Schedule not found", status=400)
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
                    if todo.date == todoDate\
                    and todo.start == todoStart\
                    and todo.end == todoEnd\
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
        actTitle = request.POST.get("title")
        actPromoter = request.POST.get("promoter")
        actParticipants = request.POST.get("participants")
        actPartNumMin = request.POST.get("partNumMin")
        actPartNumMax = request.POST.get("partNumMax")
        actDate = request.POST.get("date")
        actStart = request.POST.get("start")
        actEnd = request.POST.get("end")
        actPlace = request.POST.get("place")
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
        # >> put this into Activity.objects
        new_act = Activity.objects.create(\
            title=actTitle,\
            promoter=actPromoter,\
            participants=actParticipants,\
            partNumMin=actPartNumMin,\
            partNumMax=actPartNumMax,\
            date=actDate,\
            start=actStart,\
            end=actEnd,\
            place=actPlace,\
            label=actLabel,\
            detail=actDetail,\
            images=actImages,\
            tags=actTags,\
            state=actState)
        # >> get this new_act's id in Activity.objects
        new_act_id = new_act.id
        # append this id in targetSchedule.initiActs and targetSchedule.partiActs
        targetSchedule.initiActs.append(new_act_id)
        targetSchedule.partiActs.append(new_act_id)
        targetSchedule.save()
            # # >> also append a newTodo into targetSchedule.todos
            # # the newTodo satisfy:
            # # 1. type == "活动", state = 0, readOnly = True
            # # 2. title = "(我发起的)"+actTitle
            # newTodo = {
            #     'title': "(我发起的)"+actTitle,
            #     'date': actDate,
            #     'start': actStart,
            #     'end': actEnd,
            #     'label': actLabel,
            #     'type': "活动",
            #     'state': 0,
            #     'sportType': 0,
            #     'sportState': "",
            #     'readOnly': True
            # }
            # targetSchedule.todos.append(newTodo)
            # targetSchedule.save()
        # >> also append a newTodoID into targetSchedule.todos
        # the newTodo satisfy:
        # 1. type == "活动", state = 0, readOnly = True
        # 2. title = "(我发起的)"+actTitle, note the the braket are English brakets, instead of Chinese ones
        newTodo = Todo.objects.create(\
            title="(我发起的)"+actTitle,\
            date=actDate,\
            start=actStart,\
            end=actEnd,\
            label=actLabel,\
            type="活动",\
            state=0,\
            sportType=0,\
            sportState="",\
            readOnly=1,\
            promoter=actPromoter)
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
                    # allTodos = promotorSchedule.todos
                    # for todo in allTodos:
                    #     if todo['title'] == "(我发起的)"+targetAct.title\
                    #     and todo['date'] == targetAct.date\
                    #     and todo['start'] == targetAct.start\
                    #     and todo['end'] == targetAct.end:
                    #         todoFound = True
                    #         allTodos.remove(todo)
                    #         promotorSchedule.save()
                allTodos = promotorSchedule.todos
                for todoID in allTodos:
                    todo = Todo.objects.filter(id=todoID).first()
                    if todo:
                        # found
                        if todo.title == "(我发起的)"+targetAct.title\
                        and todo.date == targetAct.date\
                        and todo.start == targetAct.start\
                        and todo.end == targetAct.end:
                            todoFound = True
                            # delete not only the todoID in promotorSchedule.todos;
                            allTodos.remove(todoID)
                            promotorSchedule.save()
                            # but also the todo object itself in Todo.objects
                            todo.delete()
            # 2. then delete the activity in it's participants' partiActs
            # , also: delete the corresponding todos in their schedules
            participantsId = targetAct.participants # which is an array
            for participantId in participantsId:
                # find the schedule (if any) according to the participantId
                participantSchedule = Schedule.objects.filter(id=participantId).first()
                if participantSchedule:
                    # found
                    # 2.1 delete the activity in participantSchedule.partiActs
                    participantSchedule.partiActs.remove(actId)
                    participantSchedule.save()
                    # 2.2 delete the corresponding todo
                        # allTodos = participantSchedule.todos
                        # for todo in allTodos:
                        #     if todo['title'] == "(我参与的)"+targetAct.title\
                        #     and todo['date'] == targetAct.date\
                        #     and todo['start'] == targetAct.start\
                        #     and todo['end'] == targetAct.end:
                        #         todoFound = True
                        #         allTodos.remove(todo)
                        #         participantSchedule.save()
                    allTodos = participantSchedule.todos
                    for todoID in allTodos:
                        todo = Todo.objects.filter(id=todoID).first()
                        if todo:
                            # found
                            if (todo.title == "(我参与的)"+targetAct.title\
                            or todo.title == "(申请中)"+targetAct.title)\
                            and todo.date == targetAct.date\
                            and todo.start == targetAct.start\
                            and todo.end == targetAct.end:
                                todoFound = True
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
        newActImages = request.POST.get("newImages")
        newActTags = request.POST.get("newTags")
        newActPlace = request.POST.get("newPlace")
        # find the activity (if any) according to the actId
        targetAct = Activity.objects.filter(id=actId).first()
        if targetAct:
            # found
                # # change the activity according to the params
                # targetAct.title = newActTitle
                # targetAct.partNumMin = newActPartNumMin
                # targetAct.partNumMax = newActPartNumMax
                # targetAct.label = newActLabel
                # targetAct.detail = newActDetail
                # targetAct.images = newActImages
                # targetAct.tags = newActTags
                # targetAct.place = newActPlace
                # targetAct.save()
            # first change the todo itself in Todo.objects
            initTodo = Todo.objects.filter(\
                title="(我发起的)"+targetAct.title,\
                date=targetAct.date,\
                start=targetAct.start,\
                end=targetAct.end,\
                promoter=targetAct.promoter).first()
            if initTodo:
                # found
                initTodo.title = "(我发起的)"+newActTitle
                initTodo.label = newActLabel
                initTodo.save()
            # then change the todo in the promoter's schedule
            partTodo = Todo.objects.filter(\
                title="(我参与的)"+targetAct.title,\
                date=targetAct.date,\
                start=targetAct.start,\
                end=targetAct.end,\
                promoter=targetAct.promoter).first()
            if partTodo:
                # found
                partTodo.title = "(我参与的)"+newActTitle
                partTodo.label = newActLabel
                partTodo.save()
            applyingTodo = Todo.objects.filter(\
                title="(申请中)"+targetAct.title,\
                date=targetAct.date,\
                start=targetAct.start,\
                end=targetAct.end,\
                promoter=targetAct.promoter).first()
            if applyingTodo:
                # found
                applyingTodo.title = "(申请中)"+newActTitle
                applyingTodo.label = newActLabel
                applyingTodo.save()
            # finally change the activity in Activity.objects
            targetAct.title = newActTitle
            targetAct.partNumMin = newActPartNumMin
            targetAct.partNumMax = newActPartNumMax
            targetAct.label = newActLabel
            targetAct.detail = newActDetail
            targetAct.images = newActImages
            targetAct.tags = newActTags
            targetAct.place = newActPlace
            targetAct.save()
            return HttpResponse("Change successfully")
        # else: not found
        return HttpResponse("Activity not found", status=400)

def findAct(request):
    if request.method == 'GET':
        promoterId = int(request.GET.get("promoter")) # optional
        participantsId = request.GET.get("participants") # optional
        keyForSearch = request.GET.get("keyForSearch") # optional
        minDate = request.GET.get("minDate") # optional, >= minDate
        maxDate = request.GET.get("maxDate") # optional, <= maxDate
        # note that the preceding five params are filters that are conencted by OR
        # i.e. activities satisfiying any of the five filters will be returned
        isRandom = bool(request.GET.get("isRandom"))
        if isRandom:
            # randomly pick up to 20 activities
            # get the number of objects in Activity.objects
            num_of_acts = Activity.objects.count()
            # if num_of_acts <= 20, then return all the activities
            if num_of_acts <= 20:
                all_acts = Activity.objects.all()
                ansArray = []
                for act in all_acts:
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
                        'place': act.place,
                        'label': act.label,
                        'tags': act.tags,
                        'state': act.state
                    } # remove the detail and images, to save space
                    ansArray.append(newAct)
                # now ansArray contains all the activities
                return HttpResponse(json.dumps(ansArray, ensure_ascii=False))
            # else: num_of_acts > 20
            # then: act.id = 1,2,...,num_of_acts
            # pick 20 random different numbers from 1,2,...,num_of_acts
            # and find the corresponding activities
            selected_actIDs = random.sample(range(1, num_of_acts+1), 20)
            for selected_actID in selected_actIDs:
                # for each randomly picked actid:
                # find the corresponding act
                act = Activity.objects.filter(id=selected_actID).first()
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
                    'place': act.place,
                    'label': act.label,
                    'tags': act.tags,
                    'state': act.state
                } # remove the detail and images, to save space
                ansArray.append(newAct)
            # now ansArray contains all the activities
            return HttpResponse(json.dumps(ansArray, ensure_ascii=False))
        # isRandom == False
        ansArray = []
        # find in Activity.objects by the five filters
        if participantsId:
            set_of_participantsId = set(participantsId)
        for act in Activity.objects.all():
            if promoterId:
                # promoterId is not None
                # filter by promoterId
                if act.promoter == promoterId:
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
                        'place': act.place,
                        'label': act.label,
                        'tags': act.tags,
                        'state': act.state
                    } # remove the detail and images, to save space
                    ansArray.append(newAct)
                    continue # continue to avoid repeated appending
            if participantsId:
                # participantsId is not None
                # filter by participantsId, i.e.
                # if participantsId is in act.participants (i.e. a subset of act.participants):
                # then append act to ansArray
                set_of_act_participants = set(act.participants)
                if set_of_participantsId.issubset(set_of_act_participants):
                    # participantsId is a subset of act.participants
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
                        'place': act.place,
                        'label': act.label,
                        'tags': act.tags,
                        'state': act.state
                    } # remove the detail and images, to save space
                    ansArray.append(newAct)
                    continue # continue to avoid repeated appending
            if keyForSearch:
                # keyForSearch is not None
                # filter by keyForSearch
                # append iff:
                # 1. act.title contains keyForSearch, OR:
                # 2. act.label contains keyForSearch, OR:
                # 3. act.tags contains keyForSearch
                if keyForSearch in act.title\
                or keyForSearch in act.label\
                or keyForSearch in act.tags:
                    # keyForSearch is in act.title, act.label or act.tags
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
                        'place': act.place,
                        'label': act.label,
                        'tags': act.tags,
                        'state': act.state
                    } # remove the detail and images, to save space
                    ansArray.append(newAct)
                    continue # continue to avoid repeated appending
            if minDate:
                # minDate is not None
                # filter by minDate
                # act.date and minDate are in the form of "yyyy/mm/dd"
                # append iff date >= minDate
                if act.date >= minDate:
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
                        'place': act.place,
                        'label': act.label,
                        'tags': act.tags,
                        'state': act.state
                    } # remove the detail and images, to save space
                    ansArray.append(newAct)
                    continue # continue to avoid repeated appending
            if maxDate:
                # similar to minDate:
                # maxDate is not None
                # filter by maxDate
                # act.date and maxDate are in the form of "yyyy/mm/dd"
                # append iff date <= maxDate
                if act.date <= maxDate:
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
                        'place': act.place,
                        'label': act.label,
                        'tags': act.tags,
                        'state': act.state
                    } # remove the detail and images, to save space
                    ansArray.append(newAct)
                    continue # continue to avoid repeated appending
        # now ansArray contains all the activities that satisfy the filters
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
                'place': targetAct.place,
                'label': targetAct.label,
                'detail': targetAct.detail,
                'images': targetAct.images,
                'tags': targetAct.tags,
                'state': targetAct.state
            }
            return HttpResponse(json.dumps(newAct, ensure_ascii=False))
        # else: not found
        return HttpResponse("Activity not found", status=400)

def partAct(request):
    return HttpResponse("Hello, world. You're at the schedule partAct.")

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
                        if todo.date == date\
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
        return HttpResponse("Schedule not found", status=400)