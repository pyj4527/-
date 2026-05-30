from django.db import IntegrityError
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Bookmark, Place
from .serializers import BookmarkSerializer, PlaceDetailSerializer, PlaceListSerializer


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

    if user_id <= 0:
        return None

    if not User.objects.filter(id=user_id).exists():
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


class MapPlaceListView(APIView):
    def get(self, request):
        user_id, error = require_user_id(request)
        if error:
            return error

        places = Place.objects.prefetch_related("bookmarks").all()
        serializer = PlaceListSerializer(
            places,
            many=True,
            context={"user_id": user_id},
        )
        return Response(serializer.data)


class PlaceDetailView(APIView):
    def get(self, request, place_id):
        user_id, error = require_user_id(request)
        if error:
            return error

        place, error = get_place_or_error(place_id)
        if error:
            return error

        serializer = PlaceDetailSerializer(place, context={"user_id": user_id})
        return Response(serializer.data)


class PlaceBookmarkView(APIView):
    def post(self, request, place_id):
        user_id, error = require_user_id(request)
        if error:
            return error

        place, error = get_place_or_error(place_id)
        if error:
            return error

        try:
            Bookmark.objects.create(user_id=user_id, place=place)
        except IntegrityError:
            return error_response(
                "DUPLICATE_BOOKMARK",
                "이미 저장된 관광지입니다.",
                status.HTTP_409_CONFLICT,
            )

        return Response({"placeId": place.id, "isBookmarked": True})

    def delete(self, request, place_id):
        user_id, error = require_user_id(request)
        if error:
            return error

        place, error = get_place_or_error(place_id)
        if error:
            return error

        Bookmark.objects.filter(user_id=user_id, place=place).delete()
        return Response({"placeId": place.id, "isBookmarked": False})


class BookmarkListView(APIView):
    def get(self, request):
        user_id, error = require_user_id(request)
        if error:
            return error

        bookmarks = Bookmark.objects.select_related("place").filter(user_id=user_id)
        district = request.query_params.get("district")
        if district:
            bookmarks = bookmarks.filter(place__district=district)

        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)
