from django.contrib.auth.decorators import user_passes_test
from rest_framework.utils import json


def group_required(*group_names):
    """Проверка на право доступа пользователю по группе"""
    def in_groups(user):
        print(user)
        if user.is_authenticated:
            if bool(user.groups.filter(name__in=group_names)):
                return True
        return False

    return user_passes_test(in_groups, login_url='/')


def parse_request(request):
    body_unicode = request.body.decode('utf-8')
    return json.loads(body_unicode)