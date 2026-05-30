from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient

from music.models import Track
from .models import Bookmark, Place


class PlaceApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="placeuser",
            email="place@example.com",
            password="password123",
        )
        self.place = Place.objects.create(
            name="테스트 장소",
            name_en="Test Place",
            district="종로구",
            description="테스트 설명",
            image_url="https://cdn.example.com/places/test.jpg",
            latitude=37.1,
            longitude=127.1,
            tags=["테스트"],
            price="무료",
            open_time="상시 개방",
            address="서울특별시 종로구",
            average_rating=4.5,
        )
        self.track = Track.objects.create(
            place=self.place,
            title="Test Track",
            artist="Test Artist",
            description="Test track description",
            mood="calm",
            tags=["test"],
            audio_url="audio/test.mp3",
            cover_image_url="images/covers/test.png",
        )

    def test_map_places_requires_user_id_header(self):
        response = self.client.get("/api/map/places")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["error"]["code"], "UNAUTHORIZED")

    def test_map_places_returns_place_summary(self):
        response = self.client.get(
            "/api/map/places",
            HTTP_X_USER_ID=str(self.user.id),
        )
        place_data = next(item for item in response.data if item["id"] == self.place.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(place_data["name"], "테스트 장소")
        self.assertEqual(place_data["nameEn"], "Test Place")
        self.assertEqual(place_data["district"], "종로구")
        self.assertEqual(place_data["trackCount"], 1)
        self.assertFalse(place_data["isBookmarked"])
        self.assertEqual(place_data["recommendedTrack"]["title"], "Test Track")
        self.assertEqual(place_data["recommendedTrack"]["audioUrl"], "audio/test.mp3")

    def test_place_detail_returns_detail_fields(self):
        response = self.client.get(
            f"/api/places/{self.place.id}",
            HTTP_X_USER_ID=str(self.user.id),
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["description"], "테스트 설명")
        self.assertEqual(response.data["openTime"], "상시 개방")
        self.assertEqual(response.data["address"], "서울특별시 종로구")
        self.assertEqual(response.data["recommendedTrack"]["artist"], "Test Artist")

    def test_place_detail_returns_not_found(self):
        response = self.client.get(
            "/api/places/999",
            HTTP_X_USER_ID=str(self.user.id),
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["error"]["code"], "PLACE_NOT_FOUND")

    def test_bookmark_place_and_prevent_duplicate(self):
        first_response = self.client.post(
            f"/api/places/{self.place.id}/bookmarks",
            HTTP_X_USER_ID=str(self.user.id),
        )
        duplicate_response = self.client.post(
            f"/api/places/{self.place.id}/bookmarks",
            HTTP_X_USER_ID=str(self.user.id),
        )

        self.assertEqual(first_response.status_code, status.HTTP_200_OK)
        self.assertTrue(first_response.data["isBookmarked"])
        self.assertEqual(duplicate_response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(duplicate_response.data["error"]["code"], "DUPLICATE_BOOKMARK")

    def test_bookmark_list_can_filter_by_district(self):
        other_place = Place.objects.create(
            name="다른 장소",
            district="용산구",
            description="다른 설명",
            latitude=37.2,
            longitude=127.2,
        )
        Bookmark.objects.create(user_id=self.user.id, place=self.place)
        Bookmark.objects.create(user_id=self.user.id, place=other_place)

        response = self.client.get(
            "/api/bookmarks?district=종로구",
            HTTP_X_USER_ID=str(self.user.id),
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["place"]["district"], "종로구")

    def test_delete_bookmark_returns_unbookmarked(self):
        Bookmark.objects.create(user_id=self.user.id, place=self.place)

        response = self.client.delete(
            f"/api/places/{self.place.id}/bookmarks",
            HTTP_X_USER_ID=str(self.user.id),
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["isBookmarked"])
        self.assertFalse(
            Bookmark.objects.filter(user_id=self.user.id, place=self.place).exists()
        )
