"""
Django settings for TaskTimer project.

Generated by 'django-admin startproject' using Django 3.1.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""
import sys
from pathlib import Path
import os
from django.utils import timezone
import pytz

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = '8q_)*t*-5sntua&a-s55noaf#t2=4b=gw$rt#3h+-tmfi-61v='

DEBUG = True

ALLOWED_HOSTS = ['0.0.0.0', '127.0.0.1', 'cheklist.ru.com', 'www.cheklist.ru.com', 'testserver',
                 'www.tasktracker.hw.tpu.ru', 'tasktracker.hw.tpu.ru', '109.123.151.150', ]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'UserAdmin',
    'UserCommon',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'TaskTimer.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'frontend/templates')]
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'TaskTimer.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',        'OPTIONS': {
            'read_default_file': os.path.join(BASE_DIR, 'my.cnf'),
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Krasnoyarsk'

USE_I18N = True

USE_L10N = True

USE_TZ = True


STATIC_URL = '/TaskTimer/frontend/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "/TaskTimer/frontend/static"),
    os.path.join(BASE_DIR, "frontend/static"),
    os.path.join(BASE_DIR, "/djangoenv/lib/python3.7/site-packages/django/contrib/admin/static/"),
]

STATIC_ROOT = '/home/woxel/TaskTimer/frontend/static'

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS':
        ['django_filters.rest_framework.DjangoFilterBackend']
}

AUTH_USER_MODEL = 'UserAdmin.CustomUser'
