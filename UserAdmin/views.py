from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, permission_required

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from rest_framework.utils import json

from .Services import add_project, delete_project, edit_project


def checkauth(request, url, data=None):
    if request.user.is_authenticated:
        if request.user.groups.get().name == 'admin':
            return render(request, url, context=data)
        else:
            return render(request, 'Errors/ErrAdmin.html')
    return redirect(start)


@permission_required('UserCommon.can_add', login_url='asd/')
def startss(request):
    return render(request, 'Common/Main.html')


def start(request):
    user = request.user
    if request.method == 'POST' and user.is_authenticated == False:
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = authenticate(username=username.lower(), password=password)
        if user is not None:
            login(request, user)
        else:
            data = {'message': 'Такого пользователя не существует'}
            return render(request, 'Welcome/StartPage.html', data)
    if user.is_authenticated == True:
        print(user.groups)
        if user.groups.get().name == 'admin':
            return checkauth(request, 'Admin/Main.html')
        if user.groups.get().name == 'common':
            return render(request, 'Common/Main.html')
    return render(request, 'Welcome/StartPage.html')


def LogoutView(request):
    logout(request)
    return redirect(start)


def main(request):
    return render(request, 'Admin/Main.html')


def add_project_views(request):
    user = request.user
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return HttpResponse(add_project(body.get('Name'), user))


def edit_project_views(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return HttpResponse(edit_project(body.get('Name'), body.get('id')))


def delete_project_views(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return HttpResponse(delete_project(body.get('id')))



