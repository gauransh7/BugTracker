from django.contrib.auth.backends import BaseBackend
from django.conf import settings
from BugTracker.models import User


class AuthenticationBackend(BaseBackend):
    """Log in to Django without providing a password.

    """
    def authenticate(self,request, enr_no=None,password=None):
        try:
            return User.objects.get(enr_no=enr_no)
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None