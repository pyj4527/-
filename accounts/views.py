from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    CheckUsernameSerializer,
    LoginSerializer,
    SignupSerializer,
    UserSerializer,
)


def error_response(code, message, status_code, details=None):
    error = {
        "code": code,
        "message": message,
    }
    if details is not None:
        error["details"] = details

    return Response(
        {
            "success": False,
            "error": error,
        },
        status=status_code,
    )


def auth_success_response(user, token, status_code=status.HTTP_200_OK):
    return Response(
        {
            "success": True,
            "user": UserSerializer(user).data,
            "token": token.key,
            "userId": user.id,
            "authHeader": f"Token {token.key}",
            "placeApiHeader": {
                "X-User-Id": str(user.id),
            },
        },
        status=status_code,
    )


class SignupView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                "VALIDATION_ERROR",
                "회원가입 요청 값이 올바르지 않습니다.",
                status.HTTP_400_BAD_REQUEST,
                serializer.errors,
            )

        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return auth_success_response(user, token, status.HTTP_201_CREATED)


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                "INVALID_CREDENTIALS",
                "아이디 또는 비밀번호가 올바르지 않습니다.",
                status.HTTP_401_UNAUTHORIZED,
                serializer.errors,
            )

        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        return auth_success_response(user, token)


class LogoutView(APIView):
    def post(self, request):
        if request.auth:
            request.auth.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    def get(self, request):
        user = request.user
        if not user or not user.is_authenticated:
            return error_response(
                "UNAUTHORIZED",
                "로그인이 필요합니다.",
                status.HTTP_401_UNAUTHORIZED,
            )
        return Response({"success": True, "user": UserSerializer(user).data})


class CheckUsernameView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        serializer = CheckUsernameSerializer(data=request.query_params)
        if not serializer.is_valid():
            return error_response(
                "VALIDATION_ERROR",
                "아이디를 입력해주세요.",
                status.HTTP_400_BAD_REQUEST,
                serializer.errors,
            )

        username = serializer.validated_data["username"]
        return Response(
            {
                "success": True,
                "username": username,
                "isAvailable": not User.objects.filter(username=username).exists(),
            }
        )


class SendEmailCodeView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        return error_response(
            "NOT_IMPLEMENTED",
            "이메일 인증은 MVP에서 아직 구현되지 않았습니다.",
            status.HTTP_501_NOT_IMPLEMENTED,
        )


class VerifyEmailCodeView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        return error_response(
            "NOT_IMPLEMENTED",
            "이메일 인증은 MVP에서 아직 구현되지 않았습니다.",
            status.HTTP_501_NOT_IMPLEMENTED,
        )
