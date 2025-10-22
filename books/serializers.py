from rest_framework import serializers
from books.models import Book, Category, Favorite


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True) 
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "author",
            "description",
            "price",
            "category",
            "category_id",
            "cover_image",
            "created_at",
        ]

class FavoriteSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(), 
        source="book", 
        write_only=True
    )

    class Meta:
        model = Favorite
        fields = ["id", "book", "book_id", "created_at"]