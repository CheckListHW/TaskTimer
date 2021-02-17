from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from rest_framework.utils import json

from .models import *
from UserAdmin import models as admin_models
from UserAdmin import views as admin_views


def checkauth(request, url, data=None):
    if request.user.is_authenticated:
        if request.user.groups.get().name == 'common':
            return render(request, url, context=data)
        else:
            return render(request, 'Errors/ErrCommon.html')
    return redirect(admin_views.start)


def LogoutView(request):
    logout(request)
    return redirect(admin_views.start)


def main(request):
    return render(request, 'Common/Main.html')


def add(request):
    try:
        user = request.user
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        old_project_active = ProjectActive.objects.get(Owner=user, Project_id=body.get('project_id'))
        if len(old_project_active) < 1:
            main_project = admin_models.Project.objects.get(id=body.get('project_id'))
            new_project_active = ProjectActive(Owner=user, Project=main_project, Time=1, Name=main_project.Name)
            new_project_active.save()
        return HttpResponse(new_project_active.id)
    except Exception:
        return HttpResponse(-1)
