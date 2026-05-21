from django.contrib import admin
from .models import Track


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "artist", "mood", "is_active")
    search_fields = ("title", "artist", "mood")
    list_filter = ("mood", "is_active")
