# Generated by Django 4.2.5 on 2023-12-18 10:00

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("schedule", "0011_application_rename_activityid_comment_actid_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="todo",
            name="jodId",
            field=models.CharField(default=0, max_length=100),
            preserve_default=False,
        ),
    ]
