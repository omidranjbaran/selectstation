from django.urls import path
from .views import (
    StationListAPIView,       # View to list all stations
    StudentStationAPIView,    # View for students to select their station
    StationStatsAPIView,      # View to get statistics about station selections
    StationCreateAPIView,     # View to create a new station (admin only)
    StationDeleteAPIView      # View to delete a station (admin only)
)

urlpatterns = [
    # List all stations (accessible to all users)
    path("stations/", StationListAPIView.as_view(), name="station-list"),

    # Endpoint for a student to select or get their station
    path('student-station/', StudentStationAPIView.as_view(), name='student-station'),

    # Get stats: how many students have selected each station
    path('stations/stats/', StationStatsAPIView.as_view(), name='station-stats'),

    # Create a new station (typically for admin use)
    path('stations/create/', StationCreateAPIView.as_view(), name='station-create'),

    # Delete a specific station by ID (admin only)
    path('stations/<int:pk>/delete/', StationDeleteAPIView.as_view(), name='station-delete'),
]
