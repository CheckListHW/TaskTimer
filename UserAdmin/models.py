from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Project(models.Model):
    Creator = models.ForeignKey(User, null='true', on_delete=models.DO_NOTHING)
    Name = models.CharField(max_length=70,  null='true', unique=True)

