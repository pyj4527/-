from django.db import models

# Create your models here.
class Place(models.Model):

    name = models.CharField(max_length=100)

    description = models.TextField()

    latitude = models.FloatField()

    longitude = models.FloatField()

    mood = models.CharField(max_length=50)

    tags = models.JSONField(default=list)

    def __str__(self):
        return self.name

