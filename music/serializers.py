from rest_framework import serializers
from django.contrib.auth.models import User

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


class PlaceTrackSerializer(serializers.ModelSerializer):
    placeId = serializers.IntegerField(source="place_id", read_only=True)
    audioUrl = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    createdBy = serializers.SerializerMethodField()
    isMine = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = [
            "id",
            "placeId",
            "title",
            "audioUrl",
            "description",
            "createdAt",
            "createdBy",
            "isMine",
        ]

    def get_audioUrl(self, obj):
        request = self.context.get("request")
        url = obj.audio.url if obj.audio else obj.audio_url
        if request and url:
            return request.build_absolute_uri(url)
        return url

    def get_createdBy(self, obj):
        username = "guest"
        user = User.objects.filter(id=obj.user_id).first()
        if user:
            username = user.username

        return {
            "userId": obj.user_id,
            "nickname": username,
        }

    def get_isMine(self, obj):
        return obj.user_id == self.context.get("user_id")
