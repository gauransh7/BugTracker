# Generated by Django 3.0.5 on 2020-05-20 21:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BugTracker', '0016_auto_20200521_0232'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='password',
            field=models.CharField(default='password123@', max_length=128, verbose_name='password'),
            preserve_default=False,
        ),
    ]
