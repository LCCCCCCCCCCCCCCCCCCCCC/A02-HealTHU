# Generated by Django 4.2.7 on 2023-11-30 04:50

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="HealthInfo",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("userid", models.CharField(max_length=20)),
                ("updateTime", models.DateTimeField(auto_now=True)),
                ("age", models.IntegerField()),
                ("gender", models.CharField(max_length=20)),
                ("height", models.IntegerField()),
                ("weight", models.IntegerField()),
                ("bmi", models.FloatField()),
                ("grade", models.FloatField()),
                ("grade_800m", models.FloatField()),
                ("grade_1000m", models.FloatField()),
                ("grade_50m", models.FloatField()),
                ("grade_jump", models.FloatField()),
                ("grade_sar", models.FloatField()),
                ("grade_situp", models.IntegerField()),
                ("grade_pushup", models.IntegerField()),
            ],
        ),
    ]
