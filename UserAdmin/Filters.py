from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters

from .Serializer import *


class ProjectView(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class UserView(ModelViewSet):
    queryset = CustomUser.objects.all()
    filter_backends = (DjangoFilterBackend,)
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='common').exists():
            return CustomUser.objects.filter(id=user.id)
        return CustomUser.objects.all()
