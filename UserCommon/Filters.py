from django.db.models import Q
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from functools import reduce
from django.utils import timezone


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
        request_get = self.request.GET
        start_date = request_get.get('StartDate') if request_get.get('StartDate') is not None else "2010-01-01"
        end_date = request_get.get('EndDate') if request_get.get('EndDate') is not None else timezone.now().today()
        user = self.request.user
        if user.groups.filter(name='admin').exists():
            return ProjectHistory.objects.filter(Date__range=[start_date, end_date]).exclude(End=None)
        return ProjectHistory.objects.filter(Owner=user, Date__range=[start_date, end_date]).\
                order_by("-Activity", "Start")




