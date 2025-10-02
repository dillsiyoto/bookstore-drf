from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

from users.serializers import(
    RegistrationSerializer
)


User = get_user_model()

class RegistrationViewSet(
    mixins.CreateModelMixin, 
    viewsets.GenericViewSet
):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer

