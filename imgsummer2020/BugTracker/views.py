import requests
import json
from django.shortcuts import render
from django.urls import reverse
from django.http import HttpResponse
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import login
from rest_framework import generics,viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import serializers
from rest_framework_extensions.mixins import NestedViewSetMixin
from decouple import config
from knox.views import LoginView as KnoxLoginView

from BugTracker.models import User,Bug,Project,Comment,Tag
from BugTracker.serializers import UserSerializer,ProjectSerializer,BugSerializer,CommentSerializer,AuthSerializer,AuthTokenSerializer,TagSerializer
from BugTracker.permissions import HasProjectPermissions, HasBugPermissions, HasCommentPermissions


# Create your views here.
def index(request):
    return render(request, 'BugTracker/index.html',{})

def room(request, room_name):
    return render(request, 'BugTracker/room.html', {
        'room_name': room_name
    })


class UserViewSet(NestedViewSetMixin,viewsets.ModelViewSet):
    # permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class TagViewSet(NestedViewSetMixin,viewsets.ModelViewSet):
    # permission_classes = [permissions.IsAuthenticated]
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class ProjectViewSet(NestedViewSetMixin,viewsets.ModelViewSet):
    # permission_classes = [permissions.IsAuthenticated,HasProjectPermissions]
    # permission_classes = [permissions.AllowAny]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def create(self,request):
        send_mail(
            'New Project for testing',
            request.data['name'] + ' is up for testing. \nContact the maintainers for any doubt. \n' + User.objects.get(pk=request.data['creator']).first_name,
            settings.EMAIL_HOST_USER,
            list(map(lambda x: x.email,User.objects.all())),
            fail_silently=False
        )
        return super().create(request)


class BugViewSet(NestedViewSetMixin,viewsets.ModelViewSet):
    # permission_classes = [permissions.IsAuthenticated,HasBugPermissions]
    # permission_classes = [permissions.AllowAny]
    queryset = Bug.objects.all()
    serializer_class = BugSerializer
    def create(self,request):
        listuser = list(map(lambda x:x.id,Project.objects.get(pk=request.data['project']).user.all()))
        listuser.append(Project.objects.get(pk=request.data['project']).creator.id)
        send_mail(
            'New bug reported',
            User.objects.get(pk=request.data['user']).first_name + ' added a New bug to ' + Project.objects.get(pk=request.data['project']).name,
            settings.EMAIL_HOST_USER,
            list(map(lambda x: x.email,User.objects.filter(pk__in = listuser))),
            fail_silently=False
        )
        return super().create(request)


class CommentViewSet(NestedViewSetMixin,viewsets.ModelViewSet):
    # permission_classes = [permissions.IsAuthenticated,HasCommentPermissions]
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class AuthView(APIView):
    permission_classes = [permissions.AllowAny,]

    def get(self,request,format=None):
        code = request.GET.get('code', '')
        class Auth:
            def __init__(self,code):
                self.client_id = config('CLIENT_ID')
                self.client_secret = config('CLIENT_SECRET')
                self.grant_type = 'authorization_code'
                self.code = code
                self.redirect_url =  'http://localhost:3000/#/getauth/'

        auth_object = Auth(code)
        serializer = AuthSerializer(auth_object)
        token_response = requests.post(url = 'https://internet.channeli.in/open_auth/token/', data=serializer.data)


        if token_response.status_code==200:
            try:
                login_response = requests.post('http://localhost:8000'+reverse('knox_login'), data=token_response.json())
            except:
                return HttpResponse("error at login response")
            if login_response.status_code==200:
                return Response(login_response.json())


        return Response(token_response.json())



class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        try:
            AUTH_TOKEN = 'Bearer '+request.data['access_token']
            headers = {'Authorization': AUTH_TOKEN}
            user_data = requests.get(url='https://internet.channeli.in/open_auth/get_user_data/', headers=headers).json()

            try:
                user = User.objects.get(enr_no=user_data['student']['enrolmentNumber'])
                try:
                    serializer = AuthTokenSerializer(data={'enr_no': user.enr_no})
                except:
                    return HttpResponse("serializer error")
                serializer.is_valid(raise_exception=True)
                user = serializer.validated_data['user']
                login(request, user)
                return super(LoginView, self).post(request, format=None)
            except User.DoesNotExist:
                #create a user
                #check img member
                img_member = False
                for roles in user_data["person"]["roles"]:
                    if roles['role'] == 'Maintainer' and roles['activeStatus'] == 'ActiveStatus.WILL_BE_ACTIVE':
                        img_member = True
                        break
                if img_member:
                    first_name = user_data['person']['fullName']
                    enr_no = user_data['student']['enrolmentNumber']
                    cur_yr = user_data['student']['currentYear']
                    email = user_data['contactInformation']['instituteWebmailAddress']
                    image = user_data['person']['displayPicture']
                    new_user = User(first_name=first_name, enr_no=enr_no,
                                    cur_yr=cur_yr, email=email, image=image)
                    if user_data['student']['currentYear'] >= 3:
                        new_user.is_staff = True
                    else:
                        new_user.is_staff = False

                    new_user.is_active = True
                    new_user.is_superuser = False
                    new_user.save()
                    serializer = AuthTokenSerializer(data={'enr_no':user_data['student']['enrolmentNumber']})
                    serializer.is_valid(raise_exception=True)
                    user = serializer.validated_data['user']
                    login(request, user)
                    return super(LoginView, self).post(request, format=None)
                else:
                    return HttpResponse("This app is exclusively for IMG Maintainers")
        except:
            return HttpResponse("no access token received")


class UserAPI(generics.RetrieveAPIView):
  permission_classes = [
    permissions.IsAuthenticated,
  ]
  serializer_class = UserSerializer

  def get_object(self):
    return self.request.user





