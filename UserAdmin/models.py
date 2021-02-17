from django.db import models


# Create your models here.
class Project(models.Model):
    Creator = models.IntegerField(null='true')
    Name = models.CharField(max_length=30,  null='true', default='')

