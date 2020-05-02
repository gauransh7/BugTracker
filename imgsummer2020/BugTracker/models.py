from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _

from .managers import CustomUserManager


class User(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    image = models.ImageField(default='default.jpg', upload_to='profile_images')
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class Project(models.Model):
    name = models.CharField(max_length=50)
    user = models.ManyToManyField(User)
    wiki = models.TextField()
    status = models.BooleanField(default = 1)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return self.name


STATUS_CHOICES = (
    ('new','New'),
    ('assigned','Assigned'),
    ('duplicate','Duplicate'),
    ('not a bug','Not a Bug'),
    ('open','Open'),
    ('fixed','Fixed'),
    ('retesting','Re-testing'),
    ('verified','Verified'),
    ('closed','Closed'),
)

class Bug(models.Model):
    heading = models.CharField(max_length=500)
    user = models.ForeignKey(User, null=True ,on_delete = models.SET_NULL)
    listed_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now = True)
    status = models.CharField(max_length=15,choices = STATUS_CHOICES, default = 'New')
    project = models.ForeignKey(Project,on_delete=models.CASCADE)
    description = models.CharField(max_length = 10000)
    
    class Meta:
        ordering = ['-listed_on']

    def __str__(self):
        return self.heading
