from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from books.models import Book, Category
from books.serializers import BookSerializer, CategorySerializer
from common.permissions import IsAdminOrReadOnly
from common.filters import BookFilter


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [
        DjangoFilterBackend, 
        filters.SearchFilter, 
        filters.OrderingFilter
    ]

    filterset_class = BookFilter
    search_fields = ["title", "author"]
    ordering_fields = ["price", "created_at"]
    ordering = ["created_at"]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


