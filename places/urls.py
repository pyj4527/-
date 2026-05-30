from django.urls import path

from .views import BookmarkListView, MapPlaceListView, PlaceBookmarkView, PlaceDetailView


urlpatterns = [
    path("map/places", MapPlaceListView.as_view(), name="map-place-list"),
    path("places/<int:place_id>", PlaceDetailView.as_view(), name="place-detail"),
    path(
        "places/<int:place_id>/bookmarks",
        PlaceBookmarkView.as_view(),
        name="place-bookmark",
    ),
    path("bookmarks", BookmarkListView.as_view(), name="bookmark-list"),
]
