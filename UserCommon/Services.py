from typing import Optional
from django.contrib.auth.models import User
from UserAdmin.models import models
from .models import ProjectHistory, ProjectActive
from django.utils import timezone
from UserAdmin import models as admin_models


def start_project_active(project_id: int) -> Optional[bool]:
    try:
        project_history = ProjectHistory.objects.get(id=project_id)
        if project_history.Start is None:
            project_history.Start = timezone.now()
            project_history.Activity = True
            project_history.save()
        return True
    except Exception:
        return False


def stop_project_active(project_id: int) -> Optional[bool]:
    try:
        project_history = ProjectHistory.objects.get(id=project_id)
        if project_history.Activity:
            project_history.End = timezone.now()
            project_history.Activity = False
            project_history.save()
        return True
    except Exception:
        return False


def add_project_active(project_id: int, user: User) -> Optional[int]:
    try:
        main_project = admin_models.Project.objects.get(id=project_id)
        project_active, created = ProjectActive.objects.get_or_create(Owner=user,
                                                                      Project=main_project, Name=main_project.Name)
        if not created:
            project_active.save()
        project_history = ProjectHistory(ProjectActive=project_active,
                                         Name=main_project.Name,
                                         Activity=False)
        project_history.save()
        return project_history.id
    except Exception:
        return -1


def delete_project_active(project_id: int) -> Optional[bool]:
    try:
        project_active = ProjectHistory.objects.filter(id=project_id)
        print(project_active)
        if len(project_active) > 0:
            project_active.delete()
        print(0)
        return 0
    except Exception:
        print(-1)
        return -1