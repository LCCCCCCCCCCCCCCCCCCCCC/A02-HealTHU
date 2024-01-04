from django.db import models

# Create your models here.
class ThuHealthuInfo(models.Model):
    height = models.FloatField()
    weight = models.FloatField()
    bmi = models.FloatField()
    vitalCapacity = models.IntegerField()
    grade_vitalCapacity = models.IntegerField()
    time_800m = models.CharField(max_length=10)
    grade_800m = models.CharField(max_length=10)
    time_1000m = models.CharField(max_length=10)
    grade_1000m = models.CharField(max_length=10)
    time_50m = models.CharField(max_length=10)
    grade_50m = models.CharField(max_length=10)
    longjump = models.CharField(max_length=10)
    grade_longjump = models.CharField(max_length=10)
    sitreach = models.CharField(max_length=10)
    grade_sitreach = models.CharField(max_length=10)
    situp = models.CharField(max_length=10)
    grade_situp = models.CharField(max_length=10)
    pullup = models.CharField(max_length=10)
    grade_pullup = models.CharField(max_length=10)

class ThuClass(models.Model):
    schedule = models.JSONField()

class Thuinfo(models.Model):
    id = models.IntegerField(primary_key=True)
    studentNum = models.CharField(max_length=20)
    studentPass = models.CharField(max_length=30)
    healthInfo = models.ForeignKey(ThuHealthuInfo, on_delete=models.CASCADE)
    classInfo = models.ForeignKey(ThuClass,on_delete=models.CASCADE)