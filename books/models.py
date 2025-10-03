from django.db import models

class Category(models.Model):
    name = models.CharField(
        max_length=100, 
        unique=True
    )

    class Meta:
        ordering = ("name",)
        verbose_name = "категория"
        verbose_name_plural = "категории"

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(
        max_length=200,
        verbose_name="название"
    )
    author = models.CharField(
        max_length=100,
        verbose_name="автор"
    )
    description = models.TextField(
        verbose_name="описание"
    )
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=0,
        verbose_name="цена"
    )
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name="books",
        verbose_name="категория книги"
    )
    cover_image = models.ImageField(
        upload_to="books/covers/", 
        null=True, 
        blank=True,
        verbose_name="обложка"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ("category",)
        verbose_name = "книга"
        verbose_name_plural = "книги"

    def __str__(self):
        return f"{self.title} by {self.author}"
