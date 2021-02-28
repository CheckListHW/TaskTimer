from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser

from TaskTimer import settings


class CustomUser(AbstractUser):
    patronymic = models.CharField(max_length=255, null='true', blank=True)


class Project(models.Model):
    Creator = models.ForeignKey(settings.AUTH_USER_MODEL, null='true', on_delete=models.DO_NOTHING)
    Name = models.CharField(max_length=70,  null='true', unique=True)
