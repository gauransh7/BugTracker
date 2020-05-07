from django.urls import path, include
from rest_framework.routers import DefaultRouter
from BugTracker import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'Project', views.ProjectViewSet)
router.register(r'Bug', views.BugViewSet)
router.register(r'Comment', views.CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]