from django.contrib import admin

from .models import Bookmark, Place


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "district", "latitude", "longitude", "average_rating")
    search_fields = ("name", "name_en", "district", "address")
    list_filter = ("district",)


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ("id", "user_id", "place", "created_at")
    search_fields = ("user_id", "place__name")
    list_filter = ("created_at",)
