from rest_framework import serializers

from .models import Bookmark, Place


class PlaceListSerializer(serializers.ModelSerializer):
    nameEn = serializers.CharField(source="name_en")
    imageUrl = serializers.URLField(source="image_url")
    averageRating = serializers.DecimalField(
        source="average_rating",
        max_digits=3,
        decimal_places=1,
        coerce_to_string=False,
    )
    trackCount = serializers.IntegerField(source="track_count")
    isBookmarked = serializers.SerializerMethodField()

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
        ]

    def get_isBookmarked(self, obj):
        user_id = self.context.get("user_id")
        if user_id is None:
            return False
        return obj.bookmarks.filter(user_id=user_id).exists()


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

