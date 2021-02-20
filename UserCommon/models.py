from django.db import models
from UserAdmin import models as AdminModels
from django.contrib.auth.models import User
from django.utils import timezone


class ProjectActive(models.Model):
    """ Активные проекты пользователя """
    class Meta:
        unique_together = (('Owner', 'Project'),)

    Name = models.CharField(max_length=50, null='true')
    Owner = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    Project = models.ForeignKey(AdminModels.Project, on_delete=models.DO_NOTHING)
    Time = models.IntegerField(null='true', default=0)    # Time - minute


class ProjectHistory(models.Model):
    """ История активности проекта у конкретного пользователя """
    ProjectActive = models.ForeignKey(ProjectActive, on_delete=models.DO_NOTHING)
    Name = models.CharField(max_length=50, null='true')
    Date = models.DateField(null='true', default=timezone.now().today())
    Start = models.DateTimeField(null='true')
    End = models.DateTimeField(null='true')
    Note = models.CharField(max_length=200, null='true')
    Activity = models.BooleanField(default=False)

    """У Пользователя одновременно может быть актиным только один проект(Activity - активность).
        Перед созранением активного проекта останавливает остальные"""
    def save(self, *args, **kwargs):
        if self.Activity is True:
            for project_active in ProjectActive.objects.filter(Owner=self.ProjectActive.Owner):
                ProjectHistory.objects.filter(Play=True, ProjectActive=project_active)\
                    .update(Play=False, End=timezone.now())
        super(ProjectHistory, self).save(*args, **kwargs)

