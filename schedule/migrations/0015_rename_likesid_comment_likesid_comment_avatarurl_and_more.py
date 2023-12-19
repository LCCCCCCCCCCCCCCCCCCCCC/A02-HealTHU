# Generated by Django 4.2.5 on 2023-12-19 16:39

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("schedule", "0014_alter_schedule_id"),
    ]

    operations = [
        migrations.RenameField(
            model_name="comment",
            old_name="likesID",
            new_name="likesId",
        ),
        migrations.AddField(
            model_name="comment",
            name="avatarUrl",
            field=models.CharField(default=0, max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="comment",
            name="nickname",
            field=models.CharField(default=0, max_length=20),
            preserve_default=False,
        ),
    ]
