from django.db import models


class Track(models.Model):
    place = models.ForeignKey(
        "places.Place",
        on_delete=models.CASCADE,
        related_name="tracks",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=150)
    artist = models.CharField(max_length=150, blank=True)

    description = models.TextField(blank=True)
    mood = models.CharField(max_length=50, blank=True)

    tags = models.JSONField(default=list, blank=True)

    audio_url = models.CharField(max_length=500, blank=True)
    cover_image_url = models.CharField(max_length=500, blank=True)

    youtube_video_id = models.CharField(max_length=100, blank=True)
    youtube_thumbnail_url = models.CharField(max_length=500, blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.title} - {self.artist}"
