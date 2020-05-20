from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from taggit.managers import TaggableManager
from BugTracker.managers import CustomUserManager
from djrichtextfield.models import RichTextField


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
    creator = models.ForeignKey(User, null=True ,related_name='project_creator',on_delete = models.SET_NULL)
    user = models.ManyToManyField(User)
    wiki = RichTextField()
    status = models.BooleanField(default = 1)
    created_on = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()

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
    readonly_fields=('heading','description','tags',)
    heading = models.CharField(max_length=500)
    user = models.ForeignKey(User, null=True ,related_name='listed_by_user',on_delete = models.SET_NULL)
    listed_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now = True)
    media = models.FileField(null=True,upload_to = 'bugs_media',blank=True)
    status = models.CharField(max_length=15,choices = STATUS_CHOICES, default = 'New')
    project = models.ForeignKey(Project,on_delete=models.CASCADE)
    description = RichTextField()
    tags = TaggableManager()
    assign_to = models.ForeignKey(User,null=True,blank=True,related_name='assign_to_user',on_delete=models.SET_NULL)
    assign_by = models.ForeignKey(User,null=True,blank=True,related_name='assign_by_user',on_delete=models.SET_NULL)

    objects = models.Manager()
    
    
    class Meta:
        ordering = ['-listed_on']

    def __str__(self):
        return self.heading

class Comment(models.Model):
    user = models.ForeignKey(User,null=True,on_delete=models.SET_NULL)
    bug = models.ForeignKey(Bug,on_delete=models.CASCADE)
    description = RichTextField()
    status = models.BooleanField(default = 1)
    listed_on  = models.DateTimeField(auto_now_add = True)

    objects = models.Manager()

    class Meta:
        ordering = ['-listed_on']

    def __str__(self):
        return self.description
