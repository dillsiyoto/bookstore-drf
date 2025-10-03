from rest_framework.routers import DefaultRouter
from .views import BookViewSet, CategoryViewSet

router = DefaultRouter()
router.register("books", BookViewSet, basename="books")
router.register("categories", CategoryViewSet, basename="categories")

urlpatterns = router.urls
