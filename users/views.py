from rest_framework import mixins, viewsets, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import (
    get_user_model, 
    logout as django_logout
)

from users.serializers import(
    RegistrationSerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer
)


User = get_user_model()

class RegistrationViewSet(
    mixins.CreateModelMixin, 
    viewsets.GenericViewSet
):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer

class CombinedLogoutView(APIView):
    def post(self, request):
        django_logout(request)
        refresh_token = request.data.get("refresh")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass 

        return Response({"success": True}, status=status.HTTP_200_OK)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user