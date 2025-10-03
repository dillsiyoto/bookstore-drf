import django_filters
from books.models import Book


class BookFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    category = django_filters.NumberFilter(field_name="category__id")

    class Meta:
        model = Book
        fields = ["min_price", "max_price", "category"]
