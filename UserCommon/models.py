from django.db import models
from UserAdmin import models as AdminModels
from django.contrib.auth.models import User


# Create your models here.
class ProjectActive(models.Model):
    Name = models.CharField(max_length=50, null='true')
    Owner = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    Project = models.ForeignKey(AdminModels.Project, on_delete=models.DO_NOTHING)


class ProjectHistory(models.Model):
    Name = models.CharField(max_length=50, null='true')
    ProjectActive = models.ForeignKey(ProjectActive, on_delete=models.DO_NOTHING)
    Date = models.DateField(null='true')
    Start = models.DateTimeField(null='true')
    End = models.DateTimeField(null='true')
    Time = models.IntegerField(null='true')
    Note = models.CharField(max_length=200, null='true')
