# Generated by Django 4.2.5 on 2023-12-15 15:50

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("schedule", "0007_activity_place"),
    ]

    operations = [
        migrations.AddField(
            model_name="todo",
            name="promoter",
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
