from django.db import models

# Create your models here.
class Todo(models.Model):
    todoID = models.AutoField(primary_key=True) # an int automatically incremented
    date = models.CharField(max_length=50) # the date, in the form of "yyyy/mm/dd"
    title = models.CharField(max_length=100)
    start = models.CharField(max_length=50)
    end = models.CharField(max_length=50)
    label = models.CharField(max_length=20)
    type = models.CharField(max_length=20)
    state = models.IntegerField()
    sportType = models.IntegerField()
    sportState = models.CharField(max_length=20)

class Activity(models.Model):
    promoter = models.IntegerField()
    participants = models.JSONField()
    minimum_participants = models.IntegerField()
    maximum_participants = models.IntegerField()
    date = models.CharField(max_length=50)
    detail = models.CharField(max_length=200)
    images = models.JSONField()
    tags = models.JSONField()
    state = models.IntegerField()

class Appointment(models.Model):
    gym = models.CharField(max_length=20)
    place = models.CharField(max_length=20)
    start = models.CharField(max_length=50)
    end = models.CharField(max_length=50)
    
class Schedule(models.Model):
    id = models.AutoField(primary_key=True) # an int automatically incremented
    userid = models.CharField(max_length=20) # the openid from wechat
    todos = models.JSONField()
    partiActs = models.JSONField()
    initiActs = models.JSONField()
    appoints = models.JSONField()