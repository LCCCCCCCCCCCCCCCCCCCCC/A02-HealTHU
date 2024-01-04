from django.db import models

# Create your models here.
class UserInfo(models.Model):
    avatarUrl = models.CharField(max_length=200)
    nickName = models.CharField(max_length=20)
    signature = models.CharField(max_length=100)
    followings = models.JSONField()
    followingNum = models.IntegerField()
    followers = models.JSONField()
    followerNum = models.IntegerField()
    achievements = models.JSONField()
    
class CustomSettings(models.Model):
    displayMode = models.IntegerField()
    ddlRange = models.CharField(max_length=50)
    storageRange = models.CharField(max_length=50)
    achRange = models.IntegerField()
    actRange = models.IntegerField()
    postRange = models.IntegerField()
    blackList = models.JSONField()
    

class User(models.Model):
    id = models.AutoField(primary_key=True) # an int automatically incremented
    userid = models.CharField(max_length=20) # the openid from wechat
    userInfo = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    customSettings = models.ForeignKey(CustomSettings, on_delete=models.CASCADE)
    