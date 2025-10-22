from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/users/", include("users.urls")),
    path("api/", include("books.urls")),

    path("", TemplateView.as_view(template_name="catalog.html"), name="catalog"),
    path("book/<int:book_id>/", TemplateView.as_view(template_name="book_detail.html"), name="book-detail"),
    path("login/", TemplateView.as_view(template_name="login.html"), name="login-page"),
    path("register/", TemplateView.as_view(template_name="register.html"), name="register-page"),
    path("profile/", TemplateView.as_view(template_name="profile.html"), name="profile"),
    path("favorites/", TemplateView.as_view(template_name="favorites.html"), name="favorites"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
