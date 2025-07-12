from django.db import models
from django.contrib.auth.models import User

class Station(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name

class StudentStation(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  
    station = models.ForeignKey('locations.Station', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.station.name if self.station else 'No Station'}"
