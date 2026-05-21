from django.shortcuts import get_object_or_404

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

# from places.models import Place
from .models import Track
from .serializers import TrackSerializer
from .services import calculate_match_score, build_recommendation_reason


class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer


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