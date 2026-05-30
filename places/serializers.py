from rest_framework import serializers

from music.models import Track
from .models import Bookmark, Place


class RecommendedTrackSerializer(serializers.ModelSerializer):
    audioUrl = serializers.CharField(source="audio_url")
    coverImageUrl = serializers.CharField(source="cover_image_url")
    youtubeVideoId = serializers.CharField(source="youtube_video_id")
    youtubeThumbnailUrl = serializers.CharField(source="youtube_thumbnail_url")

    class Meta:
        model = Track
        fields = [
            "id",
            "title",
            "artist",
            "description",
            "mood",
            "tags",
            "audioUrl",
            "coverImageUrl",
            "youtubeVideoId",
            "youtubeThumbnailUrl",
        ]


class PlaceListSerializer(serializers.ModelSerializer):
    nameEn = serializers.CharField(source="name_en")
    imageUrl = serializers.CharField(source="image_url")
    averageRating = serializers.DecimalField(
        source="average_rating",
        max_digits=3,
        decimal_places=1,
        coerce_to_string=False,
    )
    trackCount = serializers.IntegerField(source="track_count")
    isBookmarked = serializers.SerializerMethodField()
    recommendedTrack = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = [
            "id",
            "name",
            "nameEn",
            "district",
            "imageUrl",
            "latitude",
            "longitude",
            "tags",
            "averageRating",
            "trackCount",
            "isBookmarked",
            "recommendedTrack",
        ]

    def get_isBookmarked(self, obj):
        user_id = self.context.get("user_id")
        if user_id is None:
            return False
        return obj.bookmarks.filter(user_id=user_id).exists()

    def get_recommendedTrack(self, obj):
        track = obj.tracks.filter(is_active=True).order_by("id").first()
        if track is None:
            return None
        return RecommendedTrackSerializer(track).data


class PlaceDetailSerializer(PlaceListSerializer):
    openTime = serializers.CharField(source="open_time")

    class Meta(PlaceListSerializer.Meta):
        fields = [
            "id",
            "name",
            "nameEn",
            "district",
            "description",
            "imageUrl",
            "latitude",
            "longitude",
            "tags",
            "price",
            "openTime",
            "address",
            "averageRating",
            "trackCount",
            "isBookmarked",
            "recommendedTrack",
        ]


class BookmarkedPlaceSerializer(serializers.ModelSerializer):
    nameEn = serializers.CharField(source="name_en")
    imageUrl = serializers.URLField(source="image_url")

    class Meta:
        model = Place
        fields = [
            "id",
            "name",
            "nameEn",
            "district",
            "imageUrl",
            "tags",
        ]


class BookmarkSerializer(serializers.ModelSerializer):
    place = BookmarkedPlaceSerializer()
    createdAt = serializers.DateTimeField(source="created_at")

    class Meta:
        model = Bookmark
        fields = ["place", "createdAt"]

