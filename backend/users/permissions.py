from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow:
    - Only authenticated users can access.
    - Staff and superusers can view the full user list.
    - Users can view and update their own profile.
    - Only superusers can delete users.
    """

    def has_permission(self, request, view):
        # Allow access only to authenticated users
        if not request.user or not request.user.is_authenticated:
            return False

        # Allow staff and superusers to GET the full user list (no 'pk' in URL)
        if request.method == 'GET' and not view.kwargs.get('pk'):
            return request.user.is_staff or request.user.is_superuser

        # Allow other requests (e.g., POST for create) for authenticated users
        return True

    def has_object_permission(self, request, view, obj):
        # Superusers have full access
        if request.user.is_superuser:
            return True

        # Allow owners and staff to GET, PUT, PATCH their own profile
        if request.method in ['GET', 'PUT', 'PATCH']:
            return obj == request.user or request.user.is_staff

        # Only superusers can DELETE users (others denied)
        if request.method == 'DELETE':
            return False

        # Deny all other cases
        return False
