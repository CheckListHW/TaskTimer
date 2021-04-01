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
            number_of_last = int(request_get.get('last'))
            last = ProjectHistory.objects.filter(Owner=user).order_by('-Start')
            last_p_h_names = last.values_list('Name', flat=True)

            unique_names = []
            return_unique_names = []

            for p_h_name in last_p_h_names:
                add_name = p_h_name

                for unique_name in unique_names:
                    if p_h_name == unique_name:
                        add_name = None
                        break

                if add_name is not None:
                    unique_names.append(add_name)
                    return_unique_names.append(Project.objects.filter(Name=add_name)[0])

                if len(unique_names) >= number_of_last:
                    break

            return return_unique_names

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
