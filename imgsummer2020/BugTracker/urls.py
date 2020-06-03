from django.urls import path, include
from rest_framework.routers import DefaultRouter
from BugTracker import views
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

comment_router = router.register('comments',views.CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth',views.AuthView.as_view()),
    path('api-auth/login/', views.LoginView.as_view(), name='knox_login'),
    path('api-auth/logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('api-auth/logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
    path('api-auth/user/', views.UserAPI.as_view(), name='knox_logoutall'),
]