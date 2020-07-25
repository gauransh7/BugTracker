import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from knox.auth import TokenAuthentication
from rest_framework import exceptions, HTTP_HEADER_ENCODING

from BugTracker.models import Bug, Comment
from BugTracker.serializers import CommentSerializer

class ChatConsumer(WebsocketConsumer):
    def connect(self):

        self.token = self.scope['url_route']['kwargs']['token']
        self.BugID = self.scope['url_route']['kwargs']['BugID']
        self.room_group_name = 'issue_'+str(self.BugID)

        knoxAuth = TokenAuthentication()
        user, auth_token = knoxAuth.authenticate_credentials(self.token.encode(HTTP_HEADER_ENCODING))

        if user:

            try:
                self.bug = Bug.objects.get(id = self.BugID)
                self.user = user
                async_to_sync(self.channel_layer.group_add)(
                    self.room_group_name,
                    self.channel_name
                )       
                self.accept()

            except Bug.DoesNotExist:
                pass

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )   

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        parentid = text_data_json['parent']
        if(parentid != 0):
            comment = self.bug.bugcomments.create(user = self.user, description = message,parent = Comment.objects.get(id =parentid))
        else:
            comment = self.bug.bugcomments.create(user = self.user, description = message)
        serializer = CommentSerializer(comment)

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': json.dumps(serializer.data)
            }
        )

    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=message)