from django.urls import path
from . import views

urlpatterns=[
    path('getMessages/',views.getMessages),
    path('read/',views.read),
    path('sendMessage/', views.sendMessage),
    path('deleteMessage/', views.deleteMessage),
]