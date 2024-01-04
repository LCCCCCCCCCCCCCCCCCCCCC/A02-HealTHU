from django.db import models

# Create your models here.
class SleepInfo(models.Model):
    userId = models.IntegerField(primary_key=True)
    sleepingInfo = models.JSONField()