import random
import string
from datetime import datetime, timedelta
from typing import Optional, Union
from django.contrib.auth.models import User
from django.core.mail import send_mail

from UserAdmin.models import CustomUser
from .models import ProjectHistory, ProjectActive, UserTokens
from django.utils import timezone
from UserAdmin import models as admin_models
from TaskTimer import settings
from dateutil import tz

MyTimezone = tz.gettz(settings.TIME_ZONE)


def random_word(length):
    return ''.join(random.choice(string.ascii_lowercase) for i in range(length))


def recovery_change(user: str, token: str, new_password: str, repeat_new_password: str) -> Optional[Union[bool, str]]:
    tokens = UserTokens.objects.filter(username=user)
    users = CustomUser.objects.filter(username=user)
    if len(users) <= 0:
        return 'Пользователь не найден'
    if len(tokens) <= 0:
        return 'Код не найден'
    if UserTokens.objects.get(username=user).token != token:
        print(token)
        print(UserTokens.objects.get(username=user).token)
        return 'Код неправильный'
    print(new_password)
    print(repeat_new_password)
    return change_password(CustomUser.objects.get(username=user), new_password, repeat_new_password)


def recovery(username: str) -> Optional[Union[bool, str]]:
    recovery_user = CustomUser.objects.filter(username=username)
    if len(recovery_user) > 0:
        recovery_user = CustomUser.objects.get(username=username)
        UserTokens.objects.filter(username=recovery_user.username).delete()
        new_token = UserTokens(username=recovery_user.username, token=random_word(6))
        new_token.save()
        send_mail('Django mail', 'Ваш код восстановления: ' + new_token.token,
                  recovery_user.email, [recovery_user.email], fail_silently=False)
        return True
    return 'Пользователь не найден'


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


def change_password(user: User, new_password: str, repeat_new_password: str) -> Optional[Union[bool, str]]:
    if new_password == repeat_new_password:
        u = CustomUser.objects.get(username=user)
        u.set_password(new_password)
        u.save()
        return True
    return 'пароли не совпадают'


def change_info(user: User, name: str, surname: str, patronymic: str, email: str) -> Optional[Union[bool, str]]:
    u = CustomUser.objects.get(username=user)
    u.first_name = name
    u.last_name = surname
    u.patronymic = patronymic
    u.email = email
    u.save()
    return True


def stop_project_active(project_id: int) -> Optional[Union[bool, str]]:
    try:
        project_history = ProjectHistory.objects.get(id=project_id)
        if project_history.Activity:
            now_time = timezone.now()
            if now_time.timestamp() - project_history.Start.timestamp() >= 0:
                project_history.End = now_time
            else:
                project_history.End = project_history.Start
            project_history.Activity = False
            project_history.save()
            return True
    except Exception:
        return 'Проект не оставновлен! Перезагрузите страницу'


def add_project_active(project_id: int, user: User) -> Optional[Union[int, str]]:
    try:
        print(project_id)
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
    try:
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
    except Exception:
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
    try:
        for p_h in ProjectHistory.objects.filter(id=project_id):
            if p_h.Start is None or p_h.End is None:
                return 'Время можно менять только у остановленных таймеров'

            p_h.Start = p_h.Start.astimezone().replace(hour=start_time.get('hour') if start_time.get('hour')
                                                                                      is not None else p_h.Start.hour,
                                                       minute=start_time.get('minute') if start_time.get('minute')
                                                                                          is not None else p_h.Start.minute, )

            p_h.End = p_h.End.astimezone().replace(hour=end_time.get('hour') if end_time.get('hour')
                                                                                is not None else p_h.End.hour,
                                                   minute=end_time.get('minute') if end_time.get('minute')
                                                                                    is not None else p_h.End.minute, )

            if p_h.Start > p_h.End:
                return 'Не верные данные начало позже конца!'

            if p_h.Start > timezone.now() or p_h.End > timezone.now():
                return 'Нельзя записывать проекты в будущее'

            for a_p_h in ProjectHistory.objects.filter(Owner=p_h.Owner, Activity=True):
                if p_h.Start > a_p_h.Start or p_h.End > a_p_h.Start:
                    return 'Наложение времени с текущим запущенным проектом'

            project_history_date = ProjectHistory.objects.filter(Date=p_h.Date, Owner=p_h.Owner) \
                .exclude(id=project_id).exclude(Start=None).exclude(End=None)

            for p_h_d in project_history_date:

                if ((p_h_d.Start.astimezone() < p_h.Start) & (p_h.Start < p_h_d.End.astimezone())) or \
                        ((p_h_d.Start.astimezone() < p_h.End) & (p_h.End < p_h_d.End.astimezone())):
                    return 'Указанное время входит в промежуток: {}:{}-{}:{}. Проекта: {}. Измените введенное время' \
                        .format(p_h_d.Start.astimezone().hour, p_h_d.Start.astimezone().minute,
                                p_h_d.End.astimezone().hour, p_h_d.End.astimezone().minute, p_h_d.Name)

                if ((p_h.Start < p_h_d.Start.astimezone()) & (p_h_d.Start.astimezone() < p_h.End)) or \
                        ((p_h.Start < p_h_d.End.astimezone()) & (p_h_d.End.astimezone() < p_h.End)):
                    return 'В указанный промежуток входит проект: {}. Со временем:  {}:{}-{}:{}. Измените введенное время' \
                        .format(p_h_d.Name, p_h_d.Start.astimezone().hour, p_h_d.Start.astimezone().minute,
                                p_h_d.End.astimezone().hour, p_h_d.End.astimezone().minute)

            p_h.save()
            return True
    except Exception:
        return 'Проект не изменен! Произошла ошибка :('


def delete_project_active(project_id: int) -> Optional[Union[bool, str]]:
    try:
        for p_h in ProjectHistory.objects.filter(id=project_id):
            if p_h.Activity:
                return 'Перед удалением необходимо остановить таймер'
            else:
                p_a = p_h.ProjectActive
                p_h.delete()
                p_hs = ProjectHistory.objects.filter(ProjectActive=p_a)
                if len(p_hs) == 0:
                    p_hs.delete()
        return True
    except Exception:
        return 'Проект не удален! Перезагрузите страницу'


def project_active() -> None:
    for p_h in ProjectHistory.objects.filter(Activity=True):

        utc_start = p_h.Start.astimezone().date()
        if (timezone.localtime().date() - utc_start).days > 0:
            ProjectHistory.objects.filter(Start=None, End=None).delete()

            p_h.End = datetime(p_h.Start.astimezone().year, month=p_h.Start.astimezone().month,
                               day=p_h.Start.astimezone().day, hour=23, minute=59, second=59,
                               microsecond=0, tzinfo=MyTimezone)

            p_h.Activity = False
            start_plus_day = p_h.Start.astimezone().date() + timedelta(days=1)
            datetime_next_day_project = datetime(start_plus_day.year, month=start_plus_day.month,
                                                 day=start_plus_day.day, hour=0, minute=0, second=0,
                                                 microsecond=0, tzinfo=MyTimezone)

            new_p_h = ProjectHistory(Owner=p_h.Owner, ProjectActive=p_h.ProjectActive,
                                     Name=p_h.Name, Date=datetime_next_day_project.date(),
                                     Start=datetime_next_day_project,
                                     Note=p_h.Note, Activity=True)
            p_h.save()
            new_p_h.save()
            project_active()
            break
    return
