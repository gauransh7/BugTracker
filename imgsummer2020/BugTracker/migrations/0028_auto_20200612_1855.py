# Generated by Django 3.0.5 on 2020-06-12 13:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('BugTracker', '0027_bug_tag'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bug',
            name='tag',
        ),
        migrations.DeleteModel(
            name='Tag',
        ),
    ]
