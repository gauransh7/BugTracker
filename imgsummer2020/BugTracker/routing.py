# chat/routing.py
from django.urls import path
from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    path('ws/chat/<int:BugID>/<str:token>', consumers.ChatConsumer),
]