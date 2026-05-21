from django.contrib import admin
from django.urls import path, include

# from music.views import RecommendationByPlaceAPIView


urlpatterns = [
    path("admin/", admin.site.urls),

    # path(
    #     "api/places/<int:place_id>/recommendation/",
    #     RecommendationByPlaceAPIView.as_view(),
    #     name="place-music-recommendation",
    # ),

    # path("api/places/", include("places.urls")),
    path("api/music/", include("music.urls")),
]