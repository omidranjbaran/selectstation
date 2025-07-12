from rest_framework import generics, permissions
from .models import Station, StudentStation
from .serializers import StationSerializer, StudentStationSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status
from rest_framework.generics import DestroyAPIView

# API view to list all stations
# Only authenticated users can access this endpoint
class StationListAPIView(generics.ListAPIView):
    queryset = Station.objects.all()                  # Get all Station objects from database
    serializer_class = StationSerializer              # Use StationSerializer to convert model data to JSON
    permission_classes = [permissions.IsAuthenticated]  # Require user to be authenticated

# API view to retrieve or update a student's selected station
# Only authenticated users can access
class StudentStationAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = StudentStationSerializer       # Serializer for StudentStation model
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Return StudentStation object related to current user,
        # or create one if it does not exist
        return StudentStation.objects.get_or_create(user=self.request.user)[0]

# API view for admin users to create new stations
class StationCreateAPIView(generics.CreateAPIView):
    queryset = Station.objects.all()                  # Base queryset is all stations
    serializer_class = StationSerializer
    permission_classes = [IsAdminUser]                 # Only admins allowed

# API view to delete a station by its primary key (id)
# User must be authenticated
class StationDeleteAPIView(DestroyAPIView):
    queryset = Station.objects.all()                   # Stations queryset
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'                                # Use primary key to identify station to delete

# Custom API view to get statistics about stations
# Only admin users can access this endpoint
class StationStatsAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = []
        # Loop through all stations and count how many students have selected each one
        for station in Station.objects.all():
            count = StudentStation.objects.filter(station=station).count()
            data.append({
                'id': station.id,
                'name': station.name,
                'count': count,  # Number of students assigned to this station
            })
        # Return the list of stations with their student counts as JSON response
        return Response(data)
