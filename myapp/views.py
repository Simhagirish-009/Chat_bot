from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from .models import ChatMessage
from .serializers import *
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

import openai
from django.conf import settings

from openai import OpenAI

client = OpenAI(api_key=settings.OPENAI_API_KEY)

# --------------------------
# 1️⃣ Registration
# --------------------------
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]


# --------------------------
# 2️⃣ Login
# --------------------------
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username
        })

from openai import OpenAI
client = OpenAI(api_key=settings.OPENAI_API_KEY)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_with_ai(request):
    user = request.user
    user_message = request.data.get("message")

    # Save user message
    ChatMessage.objects.create(user=user, sender='user', message=user_message)

    # Get last 5 messages for context
    past_messages = ChatMessage.objects.filter(user=user).order_by('-timestamp')[:5]
    past_messages = reversed(past_messages)

    conversation = ""
    for msg in past_messages:
        role = "User" if msg.sender == 'user' else "Bot"
        conversation += f"{role}: {msg.message}\n"

    prompt = f"{conversation}\nBot:"

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful chatbot that remembers context."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=150,
            temperature=0.7,
        )

        bot_reply = response.choices[0].message.content.strip()
        # bot_reply = f"You said: {user_message}"


        # Save bot reply
        ChatMessage.objects.create(user=user, sender='bot', message=bot_reply)

        return Response({"reply": bot_reply})

    except Exception as e:
        return Response({"error": str(e)}, status=500)
