from django.urls import path

from .views import BookmarkListView, MapPlaceListView, PlaceBookmarkView, PlaceDetailView
from music.views import PlaceTrackDetailView, PlaceTrackListCreateView


urlpatterns = [
    path("map/places", MapPlaceListView.as_view(), name="map-place-list"),
    path("places/<int:place_id>", PlaceDetailView.as_view(), name="place-detail"),
    path(
        "places/<int:place_id>/tracks",
        PlaceTrackListCreateView.as_view(),
        name="place-track-list-create",
    ),
    path(
        "places/<int:place_id>/tracks/<int:track_id>",
        PlaceTrackDetailView.as_view(),
        name="place-track-detail",
    ),
    path(
        "places/<int:place_id>/bookmarks",
        PlaceBookmarkView.as_view(),
        name="place-bookmark",
    ),
    path("bookmarks", BookmarkListView.as_view(), name="bookmark-list"),
]
