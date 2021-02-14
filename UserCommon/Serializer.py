from rest_framework.serializers import ModelSerializer

from UserCommon.models import *


class ProjectActiveSerializer(ModelSerializer):
    class Meta:
        model = ProjectActive
        fields = '__all__'
