# Generated by Django 3.0.5 on 2020-05-01 20:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('BugTracker', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='CustomUser',
            new_name='User',
        ),
    ]
