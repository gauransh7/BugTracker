from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from knox import views as knox_views
from rest_framework_extensions.routers import NestedRouterMixin

# router = DefaultRouter()
# # router.register(r'users', views.UserViewSet)
# # router.register(r'Project', views.ProjectViewSet)
# router.register(r'Bug', views.BugViewSet)
# router.register(r'Comment', views.CommentViewSet)

class NestedDefaultRouter(NestedRouterMixin, DefaultRouter):
    pass

router = NestedDefaultRouter()
 
users_router = router.register('users', views.UserViewSet)
users_router.register(
    'Project', views.ProjectViewSet,
    basename='user-Projects',
    parents_query_lookups=['user'])
    
users_router.register(
    'bug_assigned', views.BugViewSet,
    basename = 'bugs-assigned',
    parents_query_lookups = ['assign_to']
)

users_router.register(
    'bugs', views.BugViewSet,
    basename = 'bugs-reported',
    parents_query_lookups = ['user']
)

project_router = router.register('projects', views.ProjectViewSet)
project_router.register(
    'bugs', views.BugViewSet,
    basename = 'project-bugs',
    parents_query_lookups = ['project']
)

bug_router = router.register('bugs', views.BugViewSet)
bug_router.register(
    'comments', views.CommentViewSet,
    basename = 'bug-comments',
    parents_query_lookups = ['bug']
)

bug_router.register(
    'tags', views.TagViewSet,
    basename = 'bug-tags',
    parents_query_lookups = ['bug']
)



comment_router = router.register('comments',views.CommentViewSet)
tag_router = router.register('tags',views.TagViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth',views.AuthView.as_view()),
    path('api-auth/login/', views.LoginView.as_view(), name='knox_login'),
    path('api-auth/logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('api-auth/logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
    path('api-auth/user/', views.UserAPI.as_view(), name='knox_user'),
    path('chat/', views.index, name='index'),
    path('chat/<str:room_name>/', views.room, name='room'),
]