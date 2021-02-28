from rest_framework.serializers import ModelSerializer, CharField, IntegerField

from UserCommon.models import *


class ProjectActiveSerializer(ModelSerializer):
    class Meta:
        model = ProjectActive
        fields = '__all__'


class ProjectHistorySerializer(ModelSerializer):
    class Meta:
        model = ProjectHistory
        fields = '__all__'



