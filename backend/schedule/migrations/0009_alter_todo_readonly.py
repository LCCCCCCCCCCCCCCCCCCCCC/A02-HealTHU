# Generated by Django 4.2.5 on 2023-12-15 16:26

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("schedule", "0008_todo_promoter"),
    ]

    operations = [
        migrations.AlterField(
            model_name="todo",
            name="readOnly",
            field=models.IntegerField(),
        ),
    ]
