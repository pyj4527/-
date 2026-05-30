import os

from django.contrib.auth.models import User

from rest_framework import viewsets, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.views import APIView
from rest_framework.response import Response

from places.models import Place
from .models import Track
from .serializers import PlaceTrackSerializer, TrackSerializer
from .services import calculate_match_score, build_recommendation_reason


class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer


def error_response(code, message, status_code):
    return Response(
        {
            "success": False,
            "error": {
                "code": code,
                "message": message,
            },
        },
        status=status_code,
    )


def get_user_id(request):
    raw_user_id = request.headers.get("X-User-Id")
    if raw_user_id is None:
        return None

    try:
        user_id = int(raw_user_id)
    except ValueError:
        return None

    if user_id <= 0 or not User.objects.filter(id=user_id).exists():
        return None

    return user_id


def require_user_id(request):
    user_id = get_user_id(request)
    if user_id is None:
        return None, error_response(
            "UNAUTHORIZED",
            "X-User-Id 헤더가 필요합니다.",
            status.HTTP_401_UNAUTHORIZED,
        )
    return user_id, None


def get_place_or_error(place_id):
    try:
        return Place.objects.get(id=place_id), None
    except Place.DoesNotExist:
        return None, error_response(
            "PLACE_NOT_FOUND",
            "존재하지 않는 관광지입니다.",
            status.HTTP_404_NOT_FOUND,
        )


def get_track_or_error(place_id, track_id):
    try:
        return Track.objects.get(id=track_id, place_id=place_id), None
    except Track.DoesNotExist:
        return None, error_response(
            "TRACK_NOT_FOUND",
            "존재하지 않는 음악입니다.",
            status.HTTP_404_NOT_FOUND,
        )


def validate_audio_file(audio):
    if not audio:
        return "음악 파일을 업로드해주세요."

    max_size = 20 * 1024 * 1024
    if audio.size > max_size:
        return "음악 파일은 최대 20MB까지 업로드할 수 있습니다."

    extension = os.path.splitext(audio.name)[1].lower().lstrip(".")
    if extension not in {"mp3", "wav", "m4a"}:
        return "mp3, wav, m4a 파일만 업로드할 수 있습니다."

    return None


class PlaceTrackListCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, place_id):
        user_id, error = require_user_id(request)
        if error:
            return error

        _, error = get_place_or_error(place_id)
        if error:
            return error

        tracks = Track.objects.filter(place_id=place_id, is_active=True).order_by("-created_at")
        serializer = PlaceTrackSerializer(
            tracks,
            many=True,
            context={"request": request, "user_id": user_id},
        )
        return Response(serializer.data)

    def post(self, request, place_id):
        user_id, error = require_user_id(request)
        if error:
            return error

        place, error = get_place_or_error(place_id)
        if error:
            return error

        audio = request.FILES.get("audio")
        audio_error = validate_audio_file(audio)
        if audio_error:
            return error_response(
                "INVALID_AUDIO_FILE",
                audio_error,
                status.HTTP_400_BAD_REQUEST,
            )

        title = request.data.get("title", "").strip()
        if not title:
            return error_response(
                "VALIDATION_ERROR",
                "음악 제목을 입력해주세요.",
                status.HTTP_400_BAD_REQUEST,
            )

        track = Track.objects.create(
            place=place,
            user_id=user_id,
            title=title,
            description=request.data.get("description", "").strip(),
            audio=audio,
        )
        serializer = PlaceTrackSerializer(
            track,
            context={"request": request, "user_id": user_id},
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PlaceTrackDetailView(APIView):
    def put(self, request, place_id, track_id):
        user_id, error = require_user_id(request)
        if error:
            return error

        _, error = get_place_or_error(place_id)
        if error:
            return error

        track, error = get_track_or_error(place_id, track_id)
        if error:
            return error

        if track.user_id != user_id:
            return error_response(
                "FORBIDDEN",
                "업로드한 사용자만 수정할 수 있습니다.",
                status.HTTP_403_FORBIDDEN,
            )

        title = request.data.get("title")
        description = request.data.get("description")
        if title is not None:
            track.title = title.strip()
        if description is not None:
            track.description = description.strip()
        track.save(update_fields=["title", "description", "updated_at"])

        serializer = PlaceTrackSerializer(
            track,
            context={"request": request, "user_id": user_id},
        )
        return Response(serializer.data)

    def delete(self, request, place_id, track_id):
        user_id, error = require_user_id(request)
        if error:
            return error

        _, error = get_place_or_error(place_id)
        if error:
            return error

        track, error = get_track_or_error(place_id, track_id)
        if error:
            return error

        if track.user_id != user_id:
            return error_response(
                "FORBIDDEN",
                "업로드한 사용자만 삭제할 수 있습니다.",
                status.HTTP_403_FORBIDDEN,
            )

        track.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# class RecommendationByPlaceAPIView(APIView):
#     def get(self, request, place_id):
#         place = get_object_or_404(Place, id=place_id)
#
#         tracks = Track.objects.filter(is_active=True)
#
#         if not tracks.exists():
#             return Response(
#                 {
#                     "detail": "추천할 수 있는 음악이 없습니다."
#                 },
#                 status=status.HTTP_404_NOT_FOUND,
#             )
#
#         best_track = None
#         best_score = -1
#         best_matched_tags = []
#
#         for track in tracks:
#             score, matched_tags = calculate_match_score(place, track)
#
#             if score > best_score:
#                 best_score = score
#                 best_track = track
#                 best_matched_tags = matched_tags
#
#         reason = build_recommendation_reason(
#             place=place,
#             track=best_track,
#             matched_tags=best_matched_tags,
#         )
#
#         data = {
#             "place": {
#                 "id": place.id,
#                 "name": place.name,
#                 "theme": place.theme,
#                 "mood": place.mood,
#                 "description": place.description,
#                 "imageUrl": place.image_url,
#                 "tags": place.tags,
#             },
#             "music": {
#                 "id": best_track.id,
#                 "title": best_track.title,
#                 "artist": best_track.artist,
#                 "description": best_track.description,
#                 "mood": best_track.mood,
#                 "tags": best_track.tags,
#                 "audioUrl": best_track.audio_url,
#                 "coverImageUrl": best_track.cover_image_url,
#                 "youtubeVideoId": best_track.youtube_video_id,
#                 "youtubeThumbnailUrl": best_track.youtube_thumbnail_url,
#             },
#             "reason": reason,
#             "matchedTags": best_matched_tags,
#             "score": best_score,
#         }

        # return Response(data, status=status.HTTP_200_OK)
