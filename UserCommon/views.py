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


def start_project_active_views(request):
    return HttpResponse(start_project_active(parse_request(request).get('id')))


def stop_project_active_views(request):
    return HttpResponse(stop_project_active(parse_request(request).get('id')))


def add_project_active_views(request):
    return HttpResponse(add_project_active(parse_request(request).get('id'), request.user))


def edit_start_end_project_active_views(request):
    return HttpResponse(edit_start_end_project_active(parse_request(request).get('id'),
                                                 parse_request(request).get('Start'),
                                                 parse_request(request).get('End')))

def edit_note_project_active_views(request):
    return HttpResponse(edit_note_project_active(parse_request(request).get('id'),
                                                 parse_request(request).get('Note')))


def delete_project_active_views(request):
    return HttpResponse(delete_project_active(parse_request(request).get('id')))

