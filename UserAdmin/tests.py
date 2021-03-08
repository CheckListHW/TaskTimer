from django.test import TestCase, client

import threading


def login(index):

    c = client.Client()
    response = c.post('/', {
        'username': 'commonuser' + str(index),
        'password': '13579asd'
    })
    c.post('/project_active/add', {
        'project_id': 1,
    })
    print(response)


for i in range(1, 2):
    t = threading.Thread(target=login, args=(i,))
    t.start()

