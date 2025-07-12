from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, UserCreateSerializer, UserDetailSerializer
from .permissions import IsOwnerOrAdmin
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer


# List all users — anyone can access
class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# List all users and create new user — anyone can access (register endpoint)
class UserListCreateAPIView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]


# Retrieve or update user details — only owner or admin can access
class UserRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [IsOwnerOrAdmin]


# Delete a user — only owner or admin can access
class UserDeleteAPIView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsOwnerOrAdmin]


# Custom JWT token obtain view using a custom serializer
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# API view to check if username is available
@api_view(['GET'])
def check_username(request):
    # Get 'username' from query params
    username = request.query_params.get('username')
    # Return error if username is not provided or empty
    if not username:
        return Response({'error': 'Username is required'}, status=400)

    # Check if a user with this username exists
    exists = User.objects.filter(username=username).exists()
    # Return availability status
    return Response({'available': not exists})


# API view to check if email is available
@api_view(['GET'])
def check_email(request):
    # Get 'email' from query params
    email = request.query_params.get('email')
    # Return error if email is not provided or empty
    if not email:
        return Response({'error': 'Email is required'}, status=400)

    # Check if a user with this email exists
    is_available = not User.objects.filter(email=email).exists()
    # Return availability status
    return Response({'available': is_available})
