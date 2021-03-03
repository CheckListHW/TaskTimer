from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from rest_framework.utils import json

from .Services import add_project, delete_project, edit_project
from .TaskTimerSerivices import group_required


@login_required(login_url='/')
def report_view(request):
    return render(request, 'Admin/ReportsList.html')


def start(request):
    user = request.user
    if request.method == 'POST' and user.is_authenticated is False:
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = authenticate(username=username.lower(), password=password)
        if user is not None:
            login(request, user)
        else:
            data = {'message': 'Такого пользователя не существует'}
            return render(request, 'Welcome/StartPage.html', data)
    if user.is_authenticated:
        return HttpResponseRedirect('/project/active')
    return render(request, 'Welcome/StartPage.html')


@login_required(login_url='/')
def LogoutView(request):
    logout(request)
    return redirect(start)


@group_required('admin')
def project_view(request):
    return render(request, 'Admin/Project.html')


@login_required(login_url='/')
def add_project_views(request):
    user = request.user
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return HttpResponse(add_project(body.get('Name'), user))


@login_required(login_url='/')
def edit_project_views(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return HttpResponse(edit_project(body.get('Name'), body.get('id')))


@login_required(login_url='/')
def delete_project_views(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return HttpResponse(delete_project(body.get('id')))



