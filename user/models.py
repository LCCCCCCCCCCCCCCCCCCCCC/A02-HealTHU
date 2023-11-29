from django.db import models

# Create your models here.
class UserInfo(models.Model):
    avatarUrl = models.CharField(max_length=200)
    nickName = models.CharField(max_length=20)
    signature = models.CharField(max_length=100)
    
    

class User(models.Model):
    id = models.AutoField(primary_key=True) # an int automatically incremented
    userid = models.CharField(max_length=20) # the openid from wechat
    nickName = models.CharField(max_length=100)
    userInfo = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    