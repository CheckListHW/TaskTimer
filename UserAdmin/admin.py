from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser

newFieldsets = UserAdmin.fieldsets
newFieldsets[1][1]['fields'] = ('first_name', 'last_name', 'patronymic', 'email')

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = newFieldsets

admin.site.register(CustomUser, CustomUserAdmin)
