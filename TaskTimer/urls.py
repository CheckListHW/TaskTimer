"""TaskTimer URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from rest_framework.routers import SimpleRouter

from UserAdmin import views as AdminViews
from UserCommon import views as CommonViews
from UserAdmin import Filters as AdminFilters
from UserCommon import Filters as CommonFilters

router = SimpleRouter()
router.register('api/project', AdminFilters.ProjectView, basename='ProjectList')
router.register('api/project_active', CommonFilters.ProjectActiveListView, basename='ProjectActiveListView')

urlpatterns = [
    path('', AdminViews.start),
    path('logout', AdminViews.LogoutView),
    path('project/add', AdminViews.add),
    path('project_active/add', CommonViews.add),
    path('project/edit', AdminViews.edit),
    path('project/delete', AdminViews.delete),
    path('admin/', admin.site.urls),
]

urlpatterns += router.urls
