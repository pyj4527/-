from django.db import models


class Place(models.Model):
    name = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=50, blank=True)
    description = models.TextField()
    image_url = models.URLField(blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    tags = models.JSONField(default=list)
    price = models.CharField(max_length=100, blank=True)
    open_time = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=255, blank=True)
    average_rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)

    class Meta:
        ordering = ["id"]

    @property
    def track_count(self):
        return self.tracks.filter(is_active=True).count()

    def __str__(self):
        return self.name


class Bookmark(models.Model):
    user_id = models.PositiveIntegerField()
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name="bookmarks")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user_id", "place"],
                name="unique_bookmark_per_user_place",
            )
        ]

    def __str__(self):
        return f"{self.user_id} - {self.place.name}"

