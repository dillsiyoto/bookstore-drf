from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import(
    RegistrationViewSet, 
    CombinedLogoutView, 
    CustomTokenObtainPairView,
    ProfileView
)

router = DefaultRouter()
router.register("register", RegistrationViewSet, basename="register")

urlpatterns = [
    path("", include(router.urls)),
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", CombinedLogoutView.as_view(), name="logout"),
    path("profile/", ProfileView.as_view(), name="profile"),
]
