from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.contrib.auth import views as auth_views

# Swagger/OpenAPI schema configuration
schema_view = get_schema_view(
   openapi.Info(
      title="My API",                  # API title
      default_version='v1',            # API version
      description="Test description",  # Optional API description
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),  # Public access to documentation
)

urlpatterns = [
    # Django admin panel
    path('admin/', admin.site.urls),

    # User app routes (e.g., registration, login, user management)
    path('api/', include('users.urls')),

    # Location app routes (e.g., stations, coordinates, etc.)
    path("api/locations/", include("locations.urls")),

    # Password reset flow using Django built-in auth views
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),  # Enter email
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),  # Email sent confirmation
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),  # Set new password
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),  # Success message

    # API Documentation routes (Swagger and Redoc)

    # Raw OpenAPI schema (JSON or YAML format)
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),

    # Swagger UI - interactive API documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),

    # Redoc UI - alternative documentation UI
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
