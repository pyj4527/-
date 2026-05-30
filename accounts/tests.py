from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase


class AuthApiTests(APITestCase):
    def test_signup_creates_user_and_returns_place_api_header(self):
        response = self.client.post(
            "/api/auth/signup",
            {
                "username": "newuser",
                "email": "new@example.com",
                "password": "password123",
                "password_confirm": "password123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["user"]["username"], "newuser")
        self.assertEqual(response.data["placeApiHeader"]["X-User-Id"], "1")
        self.assertTrue(Token.objects.filter(user__username="newuser").exists())

    def test_signup_rejects_password_mismatch(self):
        response = self.client.post(
            "/api/auth/signup",
            {
                "username": "newuser",
                "email": "new@example.com",
                "password": "password123",
                "password_confirm": "different123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"]["code"], "VALIDATION_ERROR")

    def test_login_returns_user_id_for_place_api(self):
        User.objects.create_user(
            username="loginuser",
            email="login@example.com",
            password="password123",
        )

        response = self.client.post(
            "/api/auth/login",
            {
                "username": "loginuser",
                "password": "password123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["user"]["username"], "loginuser")
        self.assertEqual(response.data["placeApiHeader"]["X-User-Id"], "1")
        self.assertIn("token", response.data)

    def test_login_rejects_invalid_credentials(self):
        User.objects.create_user(
            username="loginuser",
            email="login@example.com",
            password="password123",
        )

        response = self.client.post(
            "/api/auth/login",
            {
                "username": "loginuser",
                "password": "wrongpassword",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["error"]["code"], "INVALID_CREDENTIALS")

    def test_me_returns_logged_in_user_with_token(self):
        user = User.objects.create_user(
            username="meuser",
            email="me@example.com",
            password="password123",
        )
        token = Token.objects.create(user=user)

        response = self.client.get(
            "/api/auth/me",
            HTTP_AUTHORIZATION=f"Token {token.key}",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["username"], "meuser")

    def test_check_username_returns_availability(self):
        User.objects.create_user(username="taken", password="password123")

        response = self.client.get("/api/auth/check-username?username=taken")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["isAvailable"])
