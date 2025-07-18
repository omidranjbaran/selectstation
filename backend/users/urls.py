from django.urls import path
from .views import (
    UserListAPIView,
    UserListCreateAPIView,
    UserRetrieveUpdateAPIView,
    UserDeleteAPIView,
    CurrentUserView,
    MyTokenObtainPairView,
    check_username,
    check_email,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # List all users (for public or admin usage)
    path('users/', UserListAPIView.as_view(), name='user-list'),

    # Register a new user (public)
    path('users/create/', UserListCreateAPIView.as_view(), name='user-create'),

    # Retrieve or update user details (only owner or admin)
    path('users/<int:pk>/', UserRetrieveUpdateAPIView.as_view(), name='user-detail'),

    # Delete a user (only owner or admin)
    path('users/<int:pk>/delete/', UserDeleteAPIView.as_view(), name='user-delete'),

    # Get or update currently authenticated user (via token)
    path("users/me/", CurrentUserView.as_view(), name="current-user"),

    # Obtain JWT access and refresh tokens (login endpoint)
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Refresh access token using a valid refresh token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Check if a username is available (for registration)
    path('users/check-username/', check_username),

    # Check if an email is available (for registration)
    path('users/check-email/', check_email),
]
