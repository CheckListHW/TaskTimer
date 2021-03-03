from typing import Optional
from django.contrib.auth.models import User
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
            print(project_history)
        return True
    except Exception:
        return 'Проект не начат! Перезагрузите страницу'


def stop_project_active(project_id: int) -> Optional[bool]:
    try:
        project_history = ProjectHistory.objects.get(id=project_id)
        if project_history.Activity:
            now_time = timezone.now()
            # if now_time.hour > 21 or project_history.Start.day != now_time.day:
            #   now_time = datetime(project_history.Start.year, month=project_history.Start.month,
            #                    day=project_history.Start.day, hour=23, minute=55)
            if now_time.timestamp() - project_history.Start.timestamp() >= 0:
                project_history.End = now_time
            else:
                project_history.End = project_history.Start
            project_history.Activity = False
            project_history.save()
            return True
    except Exception:
        return 'Проект не оставновлен! Перезагрузите страницу'


def add_project_active(project_id: int, user: User) -> Optional[int]:
    try:
        main_project = admin_models.Project.objects.get(id=project_id)
        project_active, created = ProjectActive.objects.get_or_create(Owner=user, Project=main_project,
                                                                      Name=main_project.Name)
        if not created:
            project_active.save()
        project_history = ProjectHistory(Owner=user, ProjectActive=project_active,
                                         Name=main_project.Name, Activity=False)
        project_history.save()
        return project_history.id
    except Exception:
        return 'Проект не добавлен! Произошла ошибка :('


def delete_project_active(project_id: int) -> Optional[bool]:
    try:
        project_active = ProjectHistory.objects.filter(id=project_id)
        for p_a in project_active:
            if p_a.Activity:
                return 'Перед удалением необходимо остановить таймер'
            else:
                project_active.delete()
        return True
    except Exception:
        return 'Проект не удален! Перезагрузите страницу'
