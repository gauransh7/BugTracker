# Generated by Django 3.0.5 on 2020-05-22 10:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BugTracker', '0019_auto_20200522_1605'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='enr_no',
            field=models.BigIntegerField(unique=True),
        ),
    ]
