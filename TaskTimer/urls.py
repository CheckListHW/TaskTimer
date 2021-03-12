from django.contrib import admin
from django.urls import path
from rest_framework.routers import SimpleRouter

from UserAdmin import views as AdminViews
from UserCommon import views as CommonViews
from UserAdmin import Filters as AdminFilters
from UserCommon import Filters as CommonFilters

router = SimpleRouter()
router.register('api/user', AdminFilters.UserView, basename='UserList')
router.register('api/project', AdminFilters.ProjectView, basename='ProjectList')
router.register('api/project_active', CommonFilters.ProjectActiveListView, basename='ProjectActiveListView')
router.register('api/project_history', CommonFilters.ProjectHistoryListView, basename='ProjectHistoryListView')

urlpatterns = [
    path('', AdminViews.start),
    path('logout', AdminViews.LogoutView),
    path('project', AdminViews.project_view),
    path('report', AdminViews.report_view),
    path('project/add', AdminViews.add_project_views),
    path('project/active', CommonViews.project_active_view),
    path('project_active/add', CommonViews.add_project_active_views),
    path('project_active/add/date', CommonViews.add_date_project_active_views),
    path('project_active/edit/note', CommonViews.edit_note_project_active_views),
    path('project_active/edit/time', CommonViews.edit_start_end_project_active_views),
    path('project_active/start', CommonViews.start_project_active_views),
    path('project_active/stop', CommonViews.stop_project_active_views),
    path('project_active/delete', CommonViews.delete_project_active_views),
    path('project/edit', AdminViews.edit_project_views),
    path('project/delete', AdminViews.delete_project_views),
    path('admin/', admin.site.urls),
]

urlpatterns += router.urls
