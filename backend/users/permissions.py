from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to manage user access:
    - Only authenticated users are allowed.
    - Regular users can access/update their own data.
    - Admins can view/update regular users (but NOT other admins or superusers).
    - Only superusers can delete users.
    """

    def has_permission(self, request, view):
        user = request.user

        # Deny access if the user is not authenticated
        if not user or not user.is_authenticated:
            return False

        # Allow staff/superuser to list all users (GET without pk)
        if request.method == 'GET' and not view.kwargs.get('pk'):
            return user.is_staff or user.is_superuser

        # Allow anyone to POST (used for registration)
        if request.method == 'POST':
            return True

        # Allow permission check to continue at object level
        return True

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Superusers can do anything
        if user.is_superuser:
            return True

        # Only superusers can delete users
        if request.method == 'DELETE':
            return False

        # Regular users can only view/edit their own account
        if not user.is_staff:
            return obj == user  # Can only access themselves

        # If the user is a staff (admin but not superuser):
        if user.is_staff:
            # Cannot access themselves
            if obj == user:
                return False

            # Cannot access superusers
            if obj.is_superuser:
                return False

            # Cannot access other admins
            if obj.is_staff:
                return False

        # Otherwise deny
        return False
