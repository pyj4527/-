from decimal import Decimal

from django.db import migrations


INITIAL_PLACES = [
    {
        "id": 1,
        "name": "경복궁",
        "name_en": "Gyeongbokgung",
        "district": "종로구",
        "description": "조선 시대를 대표하는 궁궐",
        "image_url": "https://cdn.example.com/places/gyeongbokgung.jpg",
        "latitude": 37.5796,
        "longitude": 126.9770,
        "tags": ["역사/문화", "조선시대"],
        "price": "3000 KRW",
        "open_time": "09:00 ~ 18:00",
        "address": "서울특별시 종로구 사직로 161",
        "average_rating": Decimal("4.6"),
    },
    {
        "id": 2,
        "name": "남산타워",
        "name_en": "N Seoul Tower",
        "district": "용산구",
        "description": "서울 도심을 한눈에 볼 수 있는 대표 전망 명소",
        "image_url": "https://cdn.example.com/places/namsan-tower.jpg",
        "latitude": 37.5512,
        "longitude": 126.9882,
        "tags": ["전망", "야경"],
        "price": "입장 구역별 상이",
        "open_time": "10:00 ~ 23:00",
        "address": "서울특별시 용산구 남산공원길 105",
        "average_rating": Decimal("4.5"),
    },
    {
        "id": 3,
        "name": "청계천",
        "name_en": "Cheonggyecheon",
        "district": "종로구",
        "description": "서울 도심 속에서 산책을 즐길 수 있는 하천",
        "image_url": "https://cdn.example.com/places/cheonggyecheon.jpg",
        "latitude": 37.5690,
        "longitude": 126.9784,
        "tags": ["산책", "도심"],
        "price": "무료",
        "open_time": "상시 개방",
        "address": "서울특별시 종로구 청계천로 일대",
        "average_rating": Decimal("4.4"),
    },
]


def seed_initial_places(apps, schema_editor):
    Place = apps.get_model("places", "Place")
    for place_data in INITIAL_PLACES:
        Place.objects.update_or_create(
            id=place_data["id"],
            defaults=place_data,
        )


def remove_initial_places(apps, schema_editor):
    Place = apps.get_model("places", "Place")
    Place.objects.filter(id__in=[place["id"] for place in INITIAL_PLACES]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("places", "0002_alter_place_options_remove_place_mood_place_address_and_more"),
    ]

    operations = [
        migrations.RunPython(seed_initial_places, remove_initial_places),
    ]
