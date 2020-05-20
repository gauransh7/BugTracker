from django.shortcuts import render
import requests
import json
from django.http import HttpResponse
from rest_framework import viewsets
from BugTracker.models import User,Bug,Project,Comment
from rest_framework.response import Response
from rest_framework.views import APIView
from BugTracker.serializers import UserSerializer,ProjectSerializer,BugSerializer,CommentSerializer,AuthSerializer
from rest_framework import permissions
from BugTracker.permissions import HasProjectPermissions, HasBugPermissions, HasCommentPermissions
from rest_framework_extensions.mixins import NestedViewSetMixin

# Create your views here.
class UserViewSet(NestedViewSetMixin,viewsets.ReadOnlyModelViewSet):
    # permission_classes = [IsOwnerOrReadOnly]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProjectViewSet(NestedViewSetMixin,viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,HasProjectPermissions]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class BugViewSet(NestedViewSetMixin,viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,HasBugPermissions]
    queryset = Bug.objects.all()
    serializer_class = BugSerializer

class CommentViewSet(NestedViewSetMixin,viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,HasCommentPermissions]
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class AuthView(APIView):
    permission_classes = [permissions.AllowAny,]

    def get(self,request,format=None):
        code = request.GET.get('code', '')
        class Auth:
            def __init__(self,code):
                self.client_id = '9M2ddc3zJkHFly9xXBuYD8aQjtsNGNqxIDiSADNv'
                self.client_secret = 'LU0uRFCz8T7Yv4JF4irTcxBxaYdRamsCTl2SVbL19yxFNEtBy79bp4rtYPB3nZTo8PSHSzUpuhEvb7Ecm9bB9XLXCq11CS8jccC95WSsGwYXNUmNWrlNhhz2KAKhXekR'
                self.grant_type = 'authorization_code'
                self.code = code
                self.redirect_url =  'http://localhost:8000/BugTracker/auth'

        auth_object = Auth(code)
        serializer = AuthSerializer(auth_object)
        token_response = requests.post(url = 'https://internet.channeli.in/open_auth/token/', data=serializer.data)

        if token_response.status_code==200:
            access_token = token_response.json()['access_token']
            headers={
                'Authorization':'Bearer ' + access_token
            }
            user_data = requests.get(url='https://internet.channeli.in/open_auth/get_user_data/',headers= headers)

            return Response(user_data.json())

        return Response(token_response.json())



