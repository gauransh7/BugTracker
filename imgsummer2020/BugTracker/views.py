from django.shortcuts import render
from rest_framework import viewsets
from BugTracker.models import User,Bug,Project,Comment
from BugTracker.serializers import UserSerializer, BugSerializer, ProjectSerializer, CommentSerializer
from rest_framework import permissions
from BugTracker.permissions import IsOwnerOrReadOnly

# Create your views here.
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class BugViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly]
    queryset = Bug.objects.all()
    serializer_class = BugSerializer

class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly]
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


