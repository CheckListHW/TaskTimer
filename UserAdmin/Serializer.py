from rest_framework.serializers import ModelSerializer, CharField

from UserAdmin.models import *


class ProjectSerializer(ModelSerializer):
    #CreatorPatronymic = CharField(source='Creator.patronymic', read_only=True)

    class Meta:
        model = Project
        fields = '__all__'


class UserSerializer(ModelSerializer):

    class Meta:
        model = CustomUser
        depth = 1
        fields = ['first_name', 'last_name', 'patronymic', 'username', 'id', 'groups', ]