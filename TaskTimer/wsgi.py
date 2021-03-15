"""
WSGI config for TaskTimer project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TaskTimer.settings')

application = get_wsgi_application()

sys.stdout = open('log.txt', 'w')
sys.stderr = open('logerror.txt', 'w')