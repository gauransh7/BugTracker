from django.shortcuts import render
import requests
import json
from django.urls import reverse
from django.http import HttpResponse
from rest_framework import viewsets
from BugTracker.models import User,Bug,Project,Comment
from rest_framework.response import Response
from rest_framework.views import APIView
from BugTracker.serializers import UserSerializer,ProjectSerializer,BugSerializer,CommentSerializer,AuthSerializer,AuthTokenSerializer
from rest_framework import permissions
from BugTracker.permissions import HasProjectPermissions, HasBugPermissions, HasCommentPermissions
from rest_framework_extensions.mixins import NestedViewSetMixin
from django.contrib.auth import login
from knox.views import LoginView as KnoxLoginView

# Create your views here.
class UserViewSet(NestedViewSetMixin,viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProjectViewSet(NestedViewSetMixin,viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated,HasProjectPermissions]
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
            try:
                login_response = requests.post('http://localhost:8000'+reverse('knox_login'), data=token_response.json())
            except:
                return HttpResponse("error at login response")
            if login_response.status_code==200:
                return Response(login_response.text)


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








