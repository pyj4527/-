from rest_framework import serializers
from .models import Track


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = [
            "id",
            "title",
            "artist",
            "description",
            "mood",
            "tags",
            "audio_url",
            "cover_image_url",
            "youtube_video_id",
            "youtube_thumbnail_url",
            "is_active",
            "created_at",
            "updated_at",
        ]

    def validate_tags(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("tags는 배열 형태여야 합니다.")
        return value