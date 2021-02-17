#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import logging
import os
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent

def main():
    print(BASE_DIR)
    print(os.path.join(BASE_DIR, "TaskTimer\my.cnf"))
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