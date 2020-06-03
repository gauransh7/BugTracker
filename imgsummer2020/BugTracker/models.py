from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from taggit.managers import TaggableManager
from BugTracker.managers import CustomUserManager
from djrichtextfield.models import RichTextField
from django.utils import timezone


class User(AbstractUser):
    username = None
    last_name = None
    password = None
    enr_no = models.BigIntegerField(null=False,unique=True,blank=False)
    cur_yr = models.IntegerField(null=True)
    email = models.EmailField(_('email address'), unique=True)
    image = models.ImageField(default='default.jpg', upload_to='profile_images')
    USERNAME_FIELD = 'enr_no'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return str(self.enr_no)

class Project(models.Model):
    name = models.CharField(max_length=50)
    creator = models.ForeignKey(User, null=True ,related_name='project_creator',on_delete = models.SET_NULL)
    user = models.ManyToManyField(User,null=True)
    wiki = RichTextField()
    status = models.BooleanField(default = 1)
    created_on = models.DateTimeField(auto_now_add=True)
    launched = models.BooleanField(default=0)

    objects = models.Manager()

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return self.name

    def createdbyname(self):
        if (self.creator):
            return self.creator.first_name

    def countbugs(self):
        return len(list(self.bugs_project.all()))

    def usernames(self):
        if (self.user):
            return  list(map(lambda x: x.first_name,self.user.all()))  


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
    project = models.ForeignKey(Project,related_name='bugs_project',on_delete=models.CASCADE)
    description = RichTextField()
    tags = TaggableManager()
    assign_to = models.ForeignKey(User,null=True,blank=True,related_name='assign_to_user',on_delete=models.SET_NULL)
    assign_by = models.ForeignKey(User,null=True,blank=True,related_name='assign_by_user',on_delete=models.SET_NULL)

    objects = models.Manager()
    
    
    class Meta:
        ordering = ['-listed_on']

    def __str__(self):
        return self.heading

    def createdbyname(self):
        if (self.user):
            return self.user.first_name

    def assigntouser(self):
        if (self.user):
            return self.assign_to.first_name

    def projectname(self):
        return self.project.name

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

    def username(self):
        if (self.user):
            return self.user.first_name
