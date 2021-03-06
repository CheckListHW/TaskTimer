from django.contrib.auth.models import User
from typing import Optional, Union
from django.db import IntegrityError, Error

from .models import Project


def add_project(name: str, user: User) -> Optional[Union[str, int]]:
    try:
        new_project = Project(Name=name, Creator=user)
        new_project.save()
        return new_project.id
    except IntegrityError:
        return 'Имя уже существует!'
    except Error:
        return 'Произошла непредвиденная ошибка!'


def delete_project(project_id: int) -> Optional[int]:
    try:
        Project.objects.get(id=project_id).delete()
        return True
    except Error:
        return False


def edit_project(name: str, project_id: int) -> Optional[Union[str, int]]:
    try:
        Project.objects.filter(id=project_id).update(Name=name)
        return 0
    except IntegrityError:
        return 'Имя уже существует!'
    except Error:
        return 'Произошла непредвиденная ошибка!'
