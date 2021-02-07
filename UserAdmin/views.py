from django.shortcuts import render, HttpResponse
from rest_framework.utils import json
from .models import *


def main(request):
    return render(request, 'Admin/Main.html')


def add(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    if type(body.get('Name')) == str:
        new_project = Project(Name=body.get('Name'))
        new_project.save()
    else:
        return HttpResponse(-1)
    return HttpResponse(new_project.id)


def edit(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    print(body)
    if type(body.get('Name')) == str and body.get('id') > 0:
        edit_project = Project.objects.get(id=body.get('id'))
        edit_project.Name = body.get('Name')
        edit_project.save()
        return HttpResponse(edit_project.id)
    return HttpResponse(-1)


def delete(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    print(body)
    if body.get('id') > 0:
        delete_project = Project.objects.get(id=body.get('id'))
        delete_project.delete()
    return HttpResponse(0)
