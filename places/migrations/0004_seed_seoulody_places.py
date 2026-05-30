from decimal import Decimal

from django.db import migrations


SEOULODY_PLACES = [
    {
        "id": 1,
        "name": "경복궁",
        "name_en": "Gyeongbokgung",
        "district": "종로구",
        "description": (
            "조선 시대를 대표하는 궁궐로, 아름다운 건축과 역사를 함께 느낄 수 있는 곳이에요. "
            "경회루와 향원정은 꼭 방문해보세요."
        ),
        "image_url": "images/covers/gyeongbokgung.jpg",
        "latitude": 37.5796,
        "longitude": 126.977,
        "tags": ["역사/문화", "고궁", "전통"],
        "price": "3,000 KRW",
        "open_time": "09:00 - 18:00 (매주 화요일 휴무)",
        "address": "서울특별시 종로구 사직로 161",
        "average_rating": Decimal("4.8"),
    },
    {
        "id": 2,
        "name": "남산타워",
        "name_en": "N Seoul Tower",
        "district": "용산구",
        "description": (
            "서울의 야경을 한눈에 볼 수 있는 대표 전망 명소예요. "
            "도시의 불빛과 함께 로맨틱한 분위기를 느끼기 좋아요."
        ),
        "image_url": "images/covers/namsan.png",
        "latitude": 37.5511,
        "longitude": 126.9882,
        "tags": ["랜드마크", "야경", "전망대"],
        "price": "전망대 21,000 KRW",
        "open_time": "10:30 - 22:30",
        "address": "서울특별시 용산구 남산공원길 105",
        "average_rating": Decimal("4.7"),
    },
    {
        "id": 3,
        "name": "청계천",
        "name_en": "Cheonggyecheon Stream",
        "district": "종로구",
        "description": "도심 한가운데 흐르는 산책로로, 물소리와 도시의 리듬이 함께 어우러지는 공간이에요.",
        "image_url": "images/covers/cheonggyecheon.png",
        "latitude": 37.5691,
        "longitude": 126.9787,
        "tags": ["산책", "물길", "도심"],
        "price": "무료",
        "open_time": "상시 개방",
        "address": "서울특별시 종로구 청계천로",
        "average_rating": Decimal("4.6"),
    },
]


def seed_seoulody_places(apps, schema_editor):
    Place = apps.get_model("places", "Place")
    for place_data in SEOULODY_PLACES:
        Place.objects.update_or_create(
            id=place_data["id"],
            defaults=place_data,
        )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("places", "0003_seed_initial_places"),
    ]

    operations = [
        migrations.RunPython(seed_seoulody_places, noop_reverse),
    ]
