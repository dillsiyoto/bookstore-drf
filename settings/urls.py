from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),  # всё что касается users
    # фронт (шаблоны)
    path("", TemplateView.as_view(template_name="catalog.html"), name="catalog"),
    path("login/", TemplateView.as_view(template_name="login.html"), name="login-page"),
    path("register/", TemplateView.as_view(template_name="register.html"), name="register-page"),
]
