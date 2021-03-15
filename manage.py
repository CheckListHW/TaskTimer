#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys



def main():
    sys.stdout = open('log.txt', 'w')
    sys.stderr = open('logerror.txt', 'w')
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TaskTimer.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    print()
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()