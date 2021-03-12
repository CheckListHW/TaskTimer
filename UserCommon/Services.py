from typing import Optional, Union
from django.contrib.auth.models import User
from .models import ProjectHistory, ProjectActive
from django.utils import timezone
from UserAdmin import models as admin_models
from TaskTimer import settings
from dateutil import tz

MyTimezone = tz.gettz(settings.TIME_ZONE)


def start_project_active(project_id: int) -> Optional[Union[bool, str]]:
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


def stop_project_active(project_id: int) -> Optional[Union[bool, str]]:
    # try:
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
    # except Exception:
    return 'Проект не оставновлен! Перезагрузите страницу'


def add_project_active(project_id: int, user: User) -> Optional[Union[int, str]]:
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


def edit_note_project_active(project_id: int, Note) -> Optional[Union[int, str]]:
    try:
        project_active = ProjectHistory.objects.filter(id=project_id)
        for p_a in project_active:
            p_a.Note = Note if Note is not None else p_a.Note
            p_a.save()
        return True
    except Exception:
        return 'Проект не изменен! Произошла ошибка :('


def edit_start_end_project_active(project_id: int, start_time, end_time) -> Optional[Union[int, str]]:
    #try:
        project_active = ProjectHistory.objects.filter(id=project_id)
        print(project_active)
        for p_a in project_active:
            project_active_date = ProjectHistory.objects.filter(Date=p_a.Date).exclude(id=project_id)
            p_a.Start = p_a.Start.replace(tzinfo=MyTimezone, hour=start_time.get('hour') if start_time.get('hour')
                                                                         is not None else p_a.Start.hour,
                                          minute=start_time.get('minute') if start_time.get('hour')
                                                                             is not None else p_a.Start.minute,)
            p_a.End = p_a.End.replace(tzinfo=MyTimezone, hour=end_time.get('hour') if end_time.get('hour')
                                                                         is not None else p_a.End.hour,
                                          minute=end_time.get('minute') if end_time.get('hour')
                                                                             is not None else p_a.End.minute,)
            if p_a.Start > p_a.End:
                return 'Не верные данные начало позже конца!'
            for p_a_d in project_active_date:
                print(p_a.Name)
                print(p_a.Start)
                print(p_a.End)
                print(p_a_d.Name)
                print(p_a_d.Start)
                print(p_a_d.End)
                if ((p_a_d.Start < p_a.Start) & (p_a.Start < p_a_d.End)) or ((p_a_d.Start < p_a.End) & (p_a.End < p_a_d.End)):
                    return 'Указанное время входит в промежуток: '+\
                           str(p_a_d.Start.astimezone().hour)+':'+str(p_a_d.Start.astimezone().minute)+\
                           '-'+str(p_a_d.End.astimezone().hour)+':'+str(p_a_d.End.astimezone().minute)+\
                           '. Проекта: '+p_a_d.Name+'. Измените введенное время'
                if ((p_a.Start < p_a_d.Start) & (p_a_d.Start < p_a.End)) or ((p_a.Start < p_a_d.End) & (p_a_d.End < p_a.End)):
                    return 'В указанный промежуток входит проект: '+p_a_d.Name+'. Со временем'+\
                           str(p_a_d.Start.astimezone().hour)+':'+str(p_a_d.Start.astimezone().minute)+\
                           '-'+str(p_a_d.End.astimezone().hour)+':'+str(p_a_d.End.astimezone().minute)+\
                           '. Измените введенное время'
            p_a.Start.replace(tzinfo=None)
            p_a.End.replace(tzinfo=None)
            p_a.save()


        return True
    #except Exception:
        return 'Проект не изменен! Произошла ошибка :('


def delete_project_active(project_id: int) -> Optional[Union[bool, str]]:
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


def project_active() -> None:
    for p_h in ProjectHistory.objects.filter(Activity=True):
        utc_start = p_h.Start.astimezone().date()
        if (timezone.localtime().date() - utc_start).days > 0:
            p_h.End = p_h.Start.replace(hour=23, minute=59, second=59, tzinfo=MyTimezone)
            p_h.Activity = False
            p_h.save()
            new_p_h = ProjectHistory(Owner=p_h.Owner, ProjectActive=p_h.ProjectActive,
                                     Name=p_h.Name, Date=timezone.localtime().date(),
                                     Start=timezone.localtime().replace(hour=0, minute=0, second=0, tzinfo=MyTimezone),
                                     Note=p_h.Note, Activity=True)
            new_p_h.save()
    return
