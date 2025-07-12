from django.urls import path
from .views import StationListAPIView, StudentStationAPIView, StationStatsAPIView,StationCreateAPIView,StationDeleteAPIView
urlpatterns = [
    path("stations/", StationListAPIView.as_view(), name="station-list"),
    path('student-station/', StudentStationAPIView.as_view(), name='student-station'),
    path('stations/stats/', StationStatsAPIView.as_view(), name='station-stats'),
    path('stations/create/', StationCreateAPIView.as_view(), name='station-create'),
    path('stations/<int:pk>/delete/', StationDeleteAPIView.as_view(), name='station-delete'),
]
