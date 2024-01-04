from django.db import models


# Create your models here.

class Message(models.Model):
    id = models.AutoField(primary_key=True)
    destUserId = models.IntegerField()
    time = models.CharField(max_length=20)
    state = models.IntegerField()
    content = models.CharField(max_length=100)
    url = models.CharField(max_length=100)


class MessageBox(models.Model):
    id = models.AutoField(primary_key=True)
    userId = models.IntegerField()
    messages = models.JSONField()
