# common/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    Любой может просматривать данные (GET, HEAD, OPTIONS),
    только админ (is_staff=True) может создавать, редактировать, удалять.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS: 
            return True
        return bool(request.user and request.user.is_staff)
