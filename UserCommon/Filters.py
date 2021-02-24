from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters

from .Serializer import *


class ProjectActiveFilter(filters.FilterSet):
    Owner = filters.NumberFilter()

    class Meta:
        model = ProjectActive
        fields = ['Owner']


class ProjectActiveListView(ModelViewSet):
    serializer_class = ProjectActiveSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ProjectActiveFilter

    def get_queryset(self):
        return ProjectActive.objects.all()


class ProjectHistoryFilter(filters.FilterSet):
    Owner = filters.NumberFilter()
    Date = filters.DateFilter()

    class Meta:
        model = ProjectHistory
        fields = ['Owner', 'Date']


class ProjectHistoryListView(ModelViewSet):
    serializer_class = ProjectHistorySerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ProjectHistoryFilter

    def get_queryset(self):
        return ProjectHistory.objects.all()



