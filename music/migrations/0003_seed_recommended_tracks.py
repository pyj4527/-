from django.db import migrations


RECOMMENDED_TRACKS = [
    {
        "id": 1,
        "place_id": 1,
        "title": "연모지정",
        "artist": "Tido Kang",
        "description": "경복궁의 고즈넉하고 아련한 분위기에 어울리는 동양풍 피아노 선율입니다.",
        "mood": "calm",
        "tags": ["역사/문화", "고궁", "전통"],
        "audio_url": "audio/gyeongbokgung.mp3",
        "cover_image_url": "images/covers/gyeongbokgung.jpg",
        "is_active": True,
    },
    {
        "id": 2,
        "place_id": 2,
        "title": "이런느낌",
        "artist": "남산타워 Lyrics Ver",
        "description": "남산타워의 설레는 나들이 분위기와 서울 야경에 어울리는 곡입니다.",
        "mood": "romantic",
        "tags": ["랜드마크", "야경", "전망대"],
        "audio_url": "audio/namsan.mp3",
        "cover_image_url": "images/covers/namsan.png",
        "is_active": True,
    },
    {
        "id": 3,
        "place_id": 3,
        "title": "영원히 너와 (Forever With You)",
        "artist": "잔잔",
        "description": "청계천을 천천히 걷는 순간에 어울리는 잔잔한 분위기의 곡입니다.",
        "mood": "fresh",
        "tags": ["산책", "물길", "도심"],
        "audio_url": "audio/cheonggyecheon.mp3",
        "cover_image_url": "images/covers/cheonggyecheon.png",
        "is_active": True,
    },
]


def seed_recommended_tracks(apps, schema_editor):
    Track = apps.get_model("music", "Track")
    for track_data in RECOMMENDED_TRACKS:
        Track.objects.update_or_create(
            id=track_data["id"],
            defaults=track_data,
        )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("music", "0002_track_place"),
    ]

    operations = [
        migrations.RunPython(seed_recommended_tracks, noop_reverse),
    ]
