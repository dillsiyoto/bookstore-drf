from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "password",
            "phone_number",
            "address"
        )

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            email=validated_data.get("email"),
            phone_number=validated_data.get("phone_number"),
            address=validated_data.get("address"),
            is_active=True 
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "is_staff", "is_superuser"]
        read_only_fields = ["is_staff", "is_superuser"]