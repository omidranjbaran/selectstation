from rest_framework import serializers
from .models import Station, StudentStation

class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = ['id', 'name', 'latitude', 'longitude']

class StudentStationSerializer(serializers.ModelSerializer):
    station = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all())

    class Meta:
        model = StudentStation
        fields = ['station']
