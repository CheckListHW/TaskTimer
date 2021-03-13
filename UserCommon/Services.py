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


def add_date_project_active(project_id: int, date, user: User) -> Optional[Union[int, str]]:
    #try:
        main_project = admin_models.Project.objects.get(id=project_id)
        project_active, created = ProjectActive.objects.get_or_create(Owner=user, Project=main_project,
                                                                      Name=main_project.Name)
        if not created:
            project_active.save()
        date_p_h = timezone.localtime().replace(year=date.get('year'), month=date.get('month'), day=date.get('day'),
                                                hour=0, minute=0, second=0, microsecond=0)
        project_history = ProjectHistory(Owner=user, ProjectActive=project_active, Date=date_p_h.date(),
                                         Start=date_p_h, End=date_p_h,
                                         Name=main_project.Name, Activity=False)
        project_history.save()
        return project_history.id
    #except Exception:
        return 'Проект не добавлен! Произошла ошибка :('


def edit_note_project_active(project_id: int, Note) -> Optional[Union[int, str]]:
    try:
        project_history = ProjectHistory.objects.filter(id=project_id)
        for p_h in project_history:
            p_h.Note = Note if Note is not None else p_h.Note
            p_h.save()
        return True
    except Exception:
        return 'Проект не изменен! Произошла ошибка :('


def edit_start_end_project_active(project_id: int, start_time, end_time) -> Optional[Union[int, str]]:
    # try:
    for p_h in ProjectHistory.objects.filter(id=project_id):
        print(p_h)
        if p_h.Start is None or p_h.End is None:
            return 'Время можно менять только у остановленных таймеров'

        p_h.Start = p_h.Start.replace(tzinfo=MyTimezone, hour=start_time.get('hour') if start_time.get('hour')
                                                                                        is not None else p_h.Start.hour,
                                      minute=start_time.get('minute') if start_time.get('minute')
                                                                         is not None else p_h.Start.minute, )

        p_h.End = p_h.End.replace(tzinfo=MyTimezone, hour=end_time.get('hour') if end_time.get('hour')
                                                                                  is not None else p_h.End.hour,
                                  minute=end_time.get('minute') if end_time.get('minute')
                                                                   is not None else p_h.End.minute, )
        if p_h.Start > p_h.End:
            return 'Не верные данные начало позже конца!'

        print(start_time)
        print(end_time)
        print(p_h.Start)
        print(p_h.End)
        print(timezone.now())
        if p_h.Start > timezone.now() or p_h.End > timezone.now():
            return 'Нельзя записывать проекты в будущее'

        for a_p_h in ProjectHistory.objects.filter(Owner=p_h.Owner, Activity=True):
            if p_h.Start > a_p_h.Start or p_h.End > a_p_h.Start:
                return 'Наложение времени с текущим запущенным проектом'

        project_history_date = ProjectHistory.objects.filter(Date=p_h.Date, Owner=p_h.Owner) \
            .exclude(id=project_id).exclude(Start=None).exclude(End=None)

        for p_h_d in project_history_date:
            
            if ((p_h_d.Start < p_h.Start) & (p_h.Start < p_h_d.End)) or \
                    ((p_h_d.Start < p_h.End) & (p_h.End < p_h_d.End)):
                return 'Указанное время входит в промежуток: {}:{}-{}:{}. Проекта: {}. Измените введенное время' \
                    .format(p_h_d.Start.astimezone().hour, p_h_d.Start.astimezone().minute,
                            p_h_d.End.astimezone().hour, p_h_d.End.astimezone().minute, p_h_d.Name)

            if ((p_h.Start < p_h_d.Start) & (p_h_d.Start < p_h.End)) or \
                    ((p_h.Start < p_h_d.End) & (p_h_d.End < p_h.End)):
                return 'В указанный промежуток входит проект: {}. Со временем:  {}:{}-{}:{}. Измените введенное время' \
                    .format(p_h_d.Name, p_h_d.Start.astimezone().hour, p_h_d.Start.astimezone().minute,
                            p_h_d.End.astimezone().hour, p_h_d.End.astimezone().minute)

        p_h.save()
    return True
    # except Exception:
    return 'Проект не изменен! Произошла ошибка :('


def delete_project_active(project_id: int) -> Optional[Union[bool, str]]:
    try:
        project_active = ProjectHistory.objects.filter(id=project_id)
        for p_h in project_active:
            if p_h.Activity:
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
            ProjectHistory.objects.filter(Start=None, End=None).delete()
            p_h.End = p_h.Start.replace(hour=23, minute=59, second=59, tzinfo=MyTimezone)
            p_h.Activity = False
            p_h.save()
            new_p_h = ProjectHistory(Owner=p_h.Owner, ProjectActive=p_h.ProjectActive,
                                     Name=p_h.Name, Date=timezone.localtime().date(),
                                     Start=timezone.localtime().replace(hour=0, minute=0, second=0, tzinfo=MyTimezone),
                                     Note=p_h.Note, Activity=True)
            new_p_h.save()
    return
