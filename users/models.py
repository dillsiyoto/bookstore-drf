from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    phone_number = models.CharField(
        max_length=20, 
        blank=True, 
        null=True, 
        verbose_name="Номер телефона"
    )
    address = models.TextField(
        blank=True, 
        null=True, 
        verbose_name="Адрес доставки"
    )

    class Meta:
        ordering = ("id",)
        verbose_name = "пользователь"
        verbose_name_plural = "пользователи"

    def __str__(self):
        return f"{self.pk} -> {self.username} -> {self.email}"
