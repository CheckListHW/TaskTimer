from rest_framework.serializers import ModelSerializer

from UserAdmin.models import *


class ProjectSerializer(ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'