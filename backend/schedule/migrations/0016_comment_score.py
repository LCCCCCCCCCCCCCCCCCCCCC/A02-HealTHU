# Generated by Django 4.2.5 on 2023-12-20 14:46

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("schedule", "0015_rename_likesid_comment_likesid_comment_avatarurl_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="comment",
            name="score",
            field=models.IntegerField(default=5),
            preserve_default=False,
        ),
    ]
