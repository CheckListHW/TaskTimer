from django.contrib.auth.decorators import user_passes_test


def group_required(*group_names):
    """Проверка на право доступа пользователю по группе"""
    def in_groups(user):
        print(user)
        if user.is_authenticated:
            if bool(user.groups.filter(name__in=group_names)):
                return True
        return False

    return user_passes_test(in_groups, login_url='/')
