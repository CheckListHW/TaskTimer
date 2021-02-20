from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from rest_framework.utils import json
from django.utils import timezone


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


def start_project(request):
    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        project_history = ProjectHistory.objects.get(id=body.get('project_id'))
        if project_history.Start is None:
            project_history.Start = timezone.now()
            project_history.Activity = True
            project_history.save()
        return HttpResponse(True)
    except Exception:
        return HttpResponse(False)


def stop_project(request):
    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        project_history = ProjectHistory.objects.get(id=body.get('project_id'))
        if project_history.Activity:
            project_history.End = timezone.now()
            project_history.Activity = False
            project_history.save()
        return HttpResponse(True)
    except Exception:
        return HttpResponse(False)



def add_project_views(request):
#try:
    user = request.user
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    main_project = admin_models.Project.objects.get(id=body.get('project_id'))
    project_active, created = ProjectActive.objects.get_or_create(Owner=user,
                                                                  Project=main_project, Name=main_project.Name)
    if not created:
        project_active.save()
    project_history = ProjectHistory(ProjectActive=project_active,
                                     Name=main_project.Name,
                                     Play=False)
    project_history.save()
    return HttpResponse(project_history.id)
#except Exception:
    return HttpResponse(-1)
