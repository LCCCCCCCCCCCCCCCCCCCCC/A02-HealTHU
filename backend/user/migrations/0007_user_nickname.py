# Generated by Django 4.2.5 on 2023-12-20 06:52

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0006_remove_user_nickname"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="nickName",
            field=models.CharField(default=0, max_length=20),
            preserve_default=False,
        ),
    ]