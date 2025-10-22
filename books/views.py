from rest_framework import viewsets, filters, generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from common.permissions import IsAdminOrReadOnly
from common.filters import BookFilter
from books.models import(
    Book, 
    Category,
    Favorite
)
from books.serializers import(
    BookSerializer, 
    CategorySerializer,
    FavoriteSerializer
)


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = BookFilter
    ordering_fields = ["price", "created_at"]
    ordering = ["created_at"]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(
            user=self.request.user
        ).select_related("book")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FavoriteDeleteView(generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)