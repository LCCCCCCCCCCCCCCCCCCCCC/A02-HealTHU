from django.db import models

# Create your models here.
class User(models.Model):
    id = models.AutoField(primary_key=True)
    userid = models.CharField(max_length=20)
    nickName = models.CharField(max_length=100)
    avatarUrl = models.CharField(max_length=200)