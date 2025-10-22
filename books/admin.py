from django.contrib import admin
from .models import Book, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "category", "price", "created_at")
    list_filter = ("category",)
    search_fields = ("title", "author")
