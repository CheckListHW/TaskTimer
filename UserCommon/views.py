from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render

from UserAdmin.TaskTimerSerivices import parse_request
from .Services import *


@login_required(login_url='/')
def project_active_view(request):
    project_active()
    timezone.timezone = 'Asia/Krasnoyarsk'
    return render(request, 'Common/ProjectActive.html')


@login_required(login_url='/')
def info_view(request):
    return render(request, 'Common/ChangePassword.html')


def change_password_view(request):
    return HttpResponse(change_password(
        request.user,
        parse_request(request).get('newPassword'),
        parse_request(request).get('repeatNewPassword')))


def change_info_view(request):
    return HttpResponse(change_info(
        request.user,
        parse_request(request).get('name'),
        parse_request(request).get('surname'),
        parse_request(request).get('patronymic'),
        parse_request(request).get('email')))


def recovery_view(request):
    return HttpResponse(recovery(parse_request(request).get('username')))


def recovery_change_view(request):
    return HttpResponse(recovery_change(parse_request(request).get('username'),
                                        parse_request(request).get('token'),
                                        parse_request(request).get('newPassword'),
                                        parse_request(request).get('repeatNewPassword')))


def start_project_active_views(request):
    return HttpResponse(start_project_active(parse_request(request).get('id')))


def stop_project_active_views(request):
    return HttpResponse(stop_project_active(parse_request(request).get('id')))


def add_project_active_views(request):
    return HttpResponse(add_project_active(parse_request(request).get('id'), request.user))


def add_date_project_active_views(request):
    return HttpResponse(
        add_date_project_active(parse_request(request).get('id'), parse_request(request).get('date'), request.user))


def edit_start_end_project_active_views(request):
    return HttpResponse(edit_start_end_project_active(parse_request(request).get('id'),
                                                      parse_request(request).get('Start'),
                                                      parse_request(request).get('End')))


def edit_note_project_active_views(request):
    return HttpResponse(edit_note_project_active(parse_request(request).get('id'),
                                                 parse_request(request).get('Note')))


def delete_project_active_views(request):
    return HttpResponse(delete_project_active(parse_request(request).get('id')))
