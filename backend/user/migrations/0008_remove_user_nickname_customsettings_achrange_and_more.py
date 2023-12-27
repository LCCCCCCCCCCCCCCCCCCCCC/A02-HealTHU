# Generated by Django 4.2.5 on 2023-12-27 21:26

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0007_user_nickname"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="nickName",
        ),
        migrations.AddField(
            model_name="customsettings",
            name="achRange",
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="customsettings",
            name="actRange",
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="customsettings",
            name="postRange",
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="userinfo",
            name="achievements",
            field=models.JSONField(default=0),
            preserve_default=False,
        ),
    ]
