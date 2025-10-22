from django.urls import path, include
from rest_framework.routers import DefaultRouter
from books.views import(
    BookViewSet, 
    CategoryViewSet, 
    FavoriteListCreateView, 
    FavoriteDeleteView
)

router = DefaultRouter()
router.register("books", BookViewSet, basename="books")
router.register("categories", CategoryViewSet, basename="categories")

urlpatterns = [
    path("", include(router.urls)),

    path("favorites/", FavoriteListCreateView.as_view(), name="favorites-list"),
    path("favorites/<int:pk>/", FavoriteDeleteView.as_view(), name="favorites-delete"),
]