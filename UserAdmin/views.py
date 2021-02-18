from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.db import IntegrityError
from rest_framework.utils import json

from .models import *


def checkauth(request, url, data=None):
    if request.user.is_authenticated:
        if request.user.groups.get().name == 'admin':
            return render(request, url, context=data)
        else:
            return render(request, 'Errors/ErrAdmin.html')
    return redirect(start)


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


def add(request):
    try:
        user = request.user
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        new_project = Project(Name=body.get('Name'), Creator=user)
        new_project.save()
        return HttpResponse(new_project.id)
    except IntegrityError:
        return HttpResponse('Имя уже существует!')
    except Exception:
        return HttpResponse('Произошла непредвиденная ошибка!')


def edit(request):
    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        print(body)
        if type(body.get('Name')) == str and body.get('id') > 0:
            edit_project = Project.objects.get(id=body.get('id'))
            edit_project.Name = body.get('Name')
            edit_project.save()
            return HttpResponse(edit_project.id)
    except IntegrityError:
        return HttpResponse('Имя уже существует!')
    except Exception:
        return HttpResponse('Произошла непредвиденная ошибка!')


def delete(request):
    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        delete_project = Project.objects.get(id=body.get('id'))
        delete_project.delete()
        return HttpResponse(0)
    except Exception:
        return HttpResponse(-1)

