from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render

from UserAdmin.TaskTimerSerivices import parse_request
from .Services import *


@login_required(login_url='/')
def project_active_view(request):
    timezone.timezone = 'Asia/Krasnoyarsk'
    return render(request, 'Common/ProjectActive.html')


def start_project_active_views(request):
    return HttpResponse(start_project_active(parse_request(request).get('project_id')))


def stop_project_active_views(request):
    return HttpResponse(stop_project_active(parse_request(request).get('project_id')))


def add_project_active_views(request):
    return HttpResponse(add_project_active(parse_request(request).get('project_id'), request.user))


def edit_project_active_views(request):
    return HttpResponse(edit_project_active(parse_request(request).get('project_id'), parse_request(request), request.user))


def delete_project_active_views(request):
    return HttpResponse(delete_project_active(parse_request(request).get('project_id')))

