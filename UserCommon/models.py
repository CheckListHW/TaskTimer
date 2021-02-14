from django.db import models
from UserAdmin import models as AdminModels
from django.contrib.auth.models import User


# Create your models here.
class ProjectActive(models.Model):
    Owner = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    Project = models.ForeignKey(AdminModels.Project, on_delete=models.DO_NOTHING)
    Time = models.IntegerField(null='true')
    Note = models.CharField(max_length=200, null='true')


class ProjectHistory(models.Model):
    ProjectActive = models.ForeignKey(ProjectActive, on_delete=models.DO_NOTHING)
    Start = models.DateTimeField()
    End = models.DateTimeField()
