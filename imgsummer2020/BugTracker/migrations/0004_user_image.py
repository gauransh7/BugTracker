# Generated by Django 3.0.5 on 2020-05-02 18:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BugTracker', '0003_auto_20200502_2220'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='image',
            field=models.ImageField(default='default.jpg', upload_to='profile_images'),
        ),
    ]
