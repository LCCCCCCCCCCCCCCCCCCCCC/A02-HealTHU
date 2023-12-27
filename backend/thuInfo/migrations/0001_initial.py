# Generated by Django 4.2.7 on 2023-12-27 15:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ThuClass',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('schedule', models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='ThuHealthuInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('height', models.FloatField()),
                ('weight', models.FloatField()),
                ('bmi', models.FloatField()),
                ('vitalCapacity', models.IntegerField()),
                ('grade_vitalCapacity', models.IntegerField()),
                ('time_800m', models.CharField(max_length=10)),
                ('grade_800m', models.CharField(max_length=10)),
                ('time_1000m', models.CharField(max_length=10)),
                ('grade_1000m', models.CharField(max_length=10)),
                ('time_50m', models.CharField(max_length=10)),
                ('grade_50m', models.CharField(max_length=10)),
                ('longjump', models.CharField(max_length=10)),
                ('grade_longjump', models.CharField(max_length=10)),
                ('sitreach', models.CharField(max_length=10)),
                ('grade_sitreach', models.CharField(max_length=10)),
                ('situp', models.CharField(max_length=10)),
                ('grade_situp', models.CharField(max_length=10)),
                ('pullup', models.CharField(max_length=10)),
                ('grade_pullup', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Thuinfo',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('studentNum', models.CharField(max_length=20)),
                ('studentPass', models.CharField(max_length=30)),
                ('classInfo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='thuInfo.thuclass')),
                ('healthInfo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='thuInfo.thuhealthuinfo')),
            ],
        ),
    ]
