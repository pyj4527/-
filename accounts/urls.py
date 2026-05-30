from django.urls import path

from . import views


urlpatterns = [
    path("signup", views.SignupView.as_view(), name="signup"),
    path("login", views.LoginView.as_view(), name="login"),
    path("logout", views.LogoutView.as_view(), name="logout"),
    path("me", views.MeView.as_view(), name="me"),
    path("check-username", views.CheckUsernameView.as_view(), name="check-username"),
    path("send-email-code", views.SendEmailCodeView.as_view(), name="send-email-code"),
    path("verify-email-code", views.VerifyEmailCodeView.as_view(), name="verify-email-code"),
]
