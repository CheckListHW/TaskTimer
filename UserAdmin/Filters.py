from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from itertools import groupby

from UserCommon.models import ProjectHistory
from .Serializer import *


class ProjectView(ModelViewSet):
    queryset = Project.objects.all()
    filter_backends = (DjangoFilterBackend,)
    serializer_class = ProjectSerializer


    def get_queryset(self):
        request_get = self.request.GET
        user = self.request.user

        if request_get.get('last') is not None:
            last = ProjectHistory.objects.filter(Owner=user).order_by('-Start')
            last_p_h_names = last.values_list('Name', flat=True)
            p_h = []

            for last_p_h_name in [el for el, _ in groupby(last_p_h_names)][:int(request_get.get('last'))]:
                print(last_p_h_name)
                x = Project.objects.filter(Name=str(last_p_h_name))
                p_h.append(x[0])
            return p_h

        return Project.objects.all()


class UserView(ModelViewSet):
    queryset = CustomUser.objects.all()
    filter_backends = (DjangoFilterBackend,)
    serializer_class = UserSerializer


    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='admin').exists():
            return CustomUser.objects.all()
        return CustomUser.objects.filter(id=user.id)
