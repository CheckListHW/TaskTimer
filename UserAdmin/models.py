from django.db import models

# Create your models here.
class Project(models.Model):
    Name = models.CharField(max_length=30)