from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from rest_framework.utils import json

from .Services import *


@login_required(login_url='/')
def report_view(request):

    return render(request, 'Admin/ReportsList.html')


@login_required(login_url='/')
def project_active_view(request):
    timezone.timezone = 'Asia/Krasnoyarsk'
    print(timezone.now())
    print('timezone.now()')
    return render(request, 'Common/ProjectActive.html')


def start_project_active_views(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return HttpResponse(start_project_active(body.get('project_id')))


def stop_project_active_views(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return HttpResponse(stop_project_active(body.get('project_id')))


def add_project_active_views(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return HttpResponse(add_project_active(body.get('project_id'), request.user))


def delete_project_active_views(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return HttpResponse(delete_project_active(body.get('project_id')))

