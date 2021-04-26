from datetime import datetime, timedelta

from django.db import models

from TaskTimer import settings
from UserAdmin import models as AdminModels
from django.contrib.auth.models import User
from django.utils import timezone
from dateutil import tz

MyTimezone = tz.gettz(settings.TIME_ZONE)


class ProjectActive(models.Model):
    """ Активные проекты пользователя """

    class Meta:
        unique_together = (('Owner', 'Project'),)

    Name = models.CharField(max_length=50, null='true')
    Owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    Project = models.ForeignKey(AdminModels.Project, on_delete=models.DO_NOTHING)


class ProjectHistory(models.Model):
    """ История активности проекта у конкретного пользователя """
    Owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    ProjectActive = models.ForeignKey(ProjectActive, on_delete=models.DO_NOTHING)
    Name = models.CharField(max_length=50, null='true')
    Date = models.DateField(null='true', default=timezone.now)
    Start = models.DateTimeField(null='true')
    End = models.DateTimeField(null='true')
    Note = models.CharField(max_length=200, null='true')
    Activity = models.BooleanField()

    """У Пользователя одновременно может быть актиным только один проект(Activity - активность).
        Перед созранением активного проекта останавливает остальные"""

    def save(self, *args, **kwargs):
        if self.End is not None:
            if self.End.astimezone().date() != self.Start.astimezone().date():
                end_time = self.Start.astimezone().date()
                self.End = datetime(end_time.year, month=end_time.month, day=end_time.day,
                                    hour=23, minute=59, second=59, microsecond=1, tzinfo=MyTimezone)
        if self.Activity is True:
            ProjectHistory.objects.filter(Owner=self.ProjectActive.Owner,
                                          Activity=True).update(Activity=False, End=timezone.now())
        super(ProjectHistory, self).save(*args, **kwargs)


class UserTokens(models.Model):
    username = models.CharField(max_length=50)
    token = models.CharField(max_length=50)
