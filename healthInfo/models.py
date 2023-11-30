from django.db import models

# Create your models here.
class HealthInfo(models.Model):
    id = models.AutoField(primary_key=True) # an int automatically incremented
    userid = models.CharField(max_length=20) # the openid from wechat
    updateTime = models.DateTimeField(auto_now=True)
    age = models.IntegerField()
    gender = models.CharField(max_length=20)
    height = models.IntegerField()
    weight = models.IntegerField()
    bmi = models.FloatField()
    grade = models.FloatField()
    grade_800m = models.FloatField()
    grade_1000m = models.FloatField()
    grade_50m = models.FloatField()
    grade_jump = models.FloatField()
    grade_sar = models.FloatField()
    grade_situp = models.IntegerField()
    grade_pushup = models.IntegerField()