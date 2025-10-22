import django_filters
from django.db.models import Q
from books.models import Book


class BookFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    category = django_filters.NumberFilter(field_name="category__id")
    search = django_filters.CharFilter(method="filter_search")

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        value = value.strip()
        return queryset.filter(
            Q(title__icontains=value) |
            Q(author__icontains=value)
        )

    class Meta:
        model = Book
        fields = ["min_price", "max_price", "category", "search"]
