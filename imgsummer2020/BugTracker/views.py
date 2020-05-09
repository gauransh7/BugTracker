from django.shortcuts import render
from rest_framework import viewsets
from BugTracker.models import User,Bug,Project,Comment
from BugTracker.serializers import UserSerializer, BugSerializer, ProjectSerializer, CommentSerializer
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


