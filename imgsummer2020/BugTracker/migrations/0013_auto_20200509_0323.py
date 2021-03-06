# Generated by Django 3.0.5 on 2020-05-08 21:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import djrichtextfield.models


class Migration(migrations.Migration):

    dependencies = [
        ('BugTracker', '0012_auto_20200507_0323'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='creator',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='project_creator', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='bug',
            name='description',
            field=djrichtextfield.models.RichTextField(editable=False),
        ),
        migrations.AlterField(
            model_name='bug',
            name='heading',
            field=models.CharField(editable=False, max_length=500),
        ),
    ]
