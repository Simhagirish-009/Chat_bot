from django.urls import path
from .views import *

urlpatterns = [
    # 🔐 Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('chat/', chat_with_ai,name='chatai'),
    path('history/', ChatHistoryView.as_view(), name='chat-history'),
    path('history/<int:pk>/', ChatHistoryDeleteView.as_view(), name='chat-history-delete'),
    path("history/delete_all/", ChatHistoryDeleteAllView.as_view(), name="chat-history-delete-all"),

]
