from django.db import models

# Create your models here.
class Todo(models.Model):
    title = models.CharField(max_length=100)
    promoter = models.IntegerField()
    date = models.CharField(max_length=50)
    start = models.CharField(max_length=50)
    end = models.CharField(max_length=50)
    label = models.CharField(max_length=50)
    type = models.CharField(max_length=20)
    state = models.IntegerField()
    sportType = models.IntegerField()
    sportState = models.CharField(max_length=20)
    readOnly = models.IntegerField() # 0 <--> false, 1 <--> true

class Comment(models.Model):
    commenterId = models.IntegerField()
    actId = models.IntegerField()
    comment = models.CharField(max_length=200)
    likes = models.IntegerField()
    likesID = models.JSONField()
    pubTime = models.CharField(max_length=50)

class Activity(models.Model):
    pubTime = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    promoter = models.IntegerField()
    participants = models.JSONField()
    partNumMin = models.IntegerField()
    partNumMax = models.IntegerField()
    date = models.CharField(max_length=50)
    start = models.CharField(max_length=50)
    end = models.CharField(max_length=50)
    label = models.CharField(max_length=50)
    detail = models.CharField(max_length=200)
    images = models.JSONField()
    tags = models.JSONField()
    state = models.IntegerField()
    comments = models.JSONField()

class Appointment(models.Model):
    gym = models.CharField(max_length=20)
    place = models.CharField(max_length=20)
    start = models.CharField(max_length=50)
    end = models.CharField(max_length=50)
    
class Application(models.Model):
    applyerId = models.IntegerField()
    actId = models.IntegerField()
    message = models.CharField(max_length=200)
    title = models.CharField(max_length=100)
    
class Schedule(models.Model):
    id = models.AutoField(primary_key=True) # an int automatically incremented
    userid = models.CharField(max_length=20) # the openid from wechat
    todos = models.JSONField()
    partiActs = models.JSONField()
    initiActs = models.JSONField()
    appoints = models.JSONField()
    applications = models.JSONField()