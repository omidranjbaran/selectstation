from rest_framework import serializers
from .models import Station, StudentStation

# Serializer for Station model - used to serialize/deserialize station data
class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = ['id', 'name', 'latitude', 'longitude']  # Fields to include in API responses


# Serializer for StudentStation model - used when a student selects a station
class StudentStationSerializer(serializers.ModelSerializer):
    # This field allows selecting a station by its primary key (ID)
    station = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all())

    class Meta:
        model = StudentStation
        fields = ['station']  # We only expose the station field for update/create
