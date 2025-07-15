from django.urls import path
from .views import UserListCreateAPIView
from .views import UserRetrieveUpdateAPIView
from .views import UserDeleteAPIView
from .views import CurrentUserView
from .views import UserListAPIView
from .views import UserListCreateAPIView
from .views import MyTokenObtainPairView, check_username,check_email
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('users/', UserListAPIView.as_view(), name='user-list'),
    path('users/create/', UserListCreateAPIView.as_view(), name='user-create'),
    path('users/<int:pk>/', UserRetrieveUpdateAPIView.as_view(), name='user-detail'),
    path('users/<int:pk>/delete/', UserDeleteAPIView.as_view(), name='user-delete'),  
    path("users/me/", CurrentUserView.as_view(), name="current-user"),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  
    path('users/check-username/', check_username),
    path('users/check-email/', check_email),
]
