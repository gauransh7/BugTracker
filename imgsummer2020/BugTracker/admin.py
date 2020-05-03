from django.contrib import admin
from .models import User,Project,Bug,Comment

# Register your models here.
admin.site.register(User)
admin.site.register(Project)
admin.site.register(Bug)
admin.site.register(Comment)

