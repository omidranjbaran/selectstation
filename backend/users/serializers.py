from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying basic user information.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new users.
    Password field is write-only (not returned in responses).
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        """
        Create a new user using Django's create_user method,
        which handles password hashing properly.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for retrieving and updating user details.
    Certain fields are read-only (cannot be changed).
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id', 'username']  # Prevent username and id from being changed


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer to add user role and username in token response.
    """
    def validate(self, attrs):
        data = super().validate(attrs)  # Call the default validate method to get token data
        user = self.user

        # Add user role based on user's permissions
        if user.is_superuser:
            data['role'] = 'superuser'
        elif user.is_staff:
            data['role'] = 'staff'
        else:
            data['role'] = 'student'

        data['username'] = user.username  # Optionally add username to response
        return data
