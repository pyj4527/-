from django.contrib import admin
from django.urls import path, include, re_path

from .views import frontend

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/', include('accounts.urls')),
    path('api/', include('places.urls')),
    path("api/music/", include("music.urls")),
    path("", frontend),
    re_path(r"^(?P<path>.*)$", frontend),
]
