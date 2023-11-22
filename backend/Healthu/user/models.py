from django.db import models

# Create your models here.
class User(models.Model):
    nickName = models.CharField(max_length=100)
    avatarUrl = models.CharField(max_length=200)