from django.db import models
from django.contrib.auth.models import AbstractUser

# --------------------------
# 1️⃣ Custom User Model
# --------------------------
class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    # Optional profile info
    full_name = models.CharField(max_length=150, blank=True)
    
    def __str__(self):
        return self.username
    
class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    sender = models.CharField(max_length=10, choices=[('user', 'User'), ('bot', 'Bot')])
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.sender}: {self.message[:30]}"