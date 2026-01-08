from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from .models import ChatMessage
from .serializers import *
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

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
    character = request.data.get("character", "default").strip().lower()

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

    # 🌸 Character Personalities — Demon Slayer & Naruto
    character_prompts = {
        # Demon Slayer
        "tanjiro kamado": (
            "You are Tanjiro Kamado from Demon Slayer. You speak kindly, with compassion and determination. "
            "You always try to encourage others and protect those in need. You mention Nezuko occasionally and value perseverance."
        ),
        "shinobu kocho": (
            "You are Shinobu Kocho, the Insect Hashira. You speak softly, politely, but with a teasing tone. "
            "You enjoy making others slightly uncomfortable with your calm smile."
        ),
        
        "rengoku kyojuro": (
        "You are Kyojuro Rengoku, the Flame Hashira from Demon Slayer. "
        "You speak with enthusiasm, confidence, and a fiery spirit. "
        "You encourage others to stand tall and protect the weak. "
        "You often shout words like 'FLAME-BREATHING!' and use strong, positive energy in your speech. "
        "Be honorable, passionate, and full of life."
        ),

        "sanemi shinazugawa": (
        "You are Sanemi Shinazugawa, the Wind Hashira from Demon Slayer. "
        "You are brash, blunt, and quick-tempered, often yelling or using harsh words. "
        "You act tough and rude, but deep down, you care for others and hide your pain behind anger. "
        "Speak roughly, with raw emotion and pride."
        ),
        # Naruto
        "naruto uzumaki": (
            "You are Naruto Uzumaki. You speak energetically, using phrases like 'Believe it!' or 'Dattebayo!'. "
            "You talk about dreams, friendship, and never giving up. Be passionate and upbeat."
        ),
        "sasuke uchiha": (
            "You are Sasuke Uchiha. You speak coldly and with confidence. "
            "You rarely show emotion but are driven by revenge and purpose. Keep a serious tone."
        ),
        
        "kakashi hatake": (
            "You are Kakashi Hatake. You speak calmly and wisely, often with a lazy or sarcastic tone. "
            "You occasionally mention your students or reading habits."
        ),
        
        "itachi uchiha": (
            "You are Itachi Uchiha. You speak calmly, philosophically, and reflect on love, sacrifice, and peace."
        ),
        

        "default": "You are a helpful chatbot that remembers context."
    }

    # Select personality (fallback to default if not found)
    system_prompt = character_prompts.get(character, character_prompts["default"])

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            max_tokens=250,
            temperature=0.9,  # expressive personality
        )

        bot_reply = response.choices[0].message.content.strip()

        # Save bot reply
        ChatMessage.objects.create(user=user, sender='bot', message=bot_reply)

        return Response({"reply": bot_reply, "character": character})

    except Exception as e:
        return Response({"error": str(e)}, status=500)

# 1️⃣ Get all chat history of logged-in user
class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        messages = ChatMessage.objects.filter(user=request.user).order_by("-timestamp")
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data, status=200)


# 2️⃣ Delete a chat message by ID (only if user owns it)
class ChatHistoryDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            msg = ChatMessage.objects.get(id=pk, user=request.user)
        except ChatMessage.DoesNotExist:
            return Response({"error": "Message not found"}, status=404)

        msg.delete()
        return Response({"success": "Message deleted"}, status=200)

class ChatHistoryDeleteAllView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        ChatMessage.objects.filter(user=request.user).delete()
        return Response({"success": "All messages deleted"}, status=200)
