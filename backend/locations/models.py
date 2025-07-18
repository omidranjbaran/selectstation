from django.db import models
from django.contrib.auth.models import User

class Station(models.Model):
    # Name of the station (e.g., "Station A")
    name = models.CharField(max_length=100)

    # Latitude coordinate of the station
    latitude = models.FloatField()

    # Longitude coordinate of the station
    longitude = models.FloatField()

    def __str__(self):
        # Display the name when this object is printed or shown in admin
        return self.name


class StudentStation(models.Model):
    # Each student (User) can be linked to only one station
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # The selected station by the student (can be null if not selected yet)
    station = models.ForeignKey('locations.Station', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        # Example output: "john_doe - Station A" or "john_doe - No Station"
        return f"{self.user.username} - {self.station.name if self.station else 'No Station'}"
