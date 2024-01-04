from django.urls import path
from . import views

urlpatterns=[
    path('bindThu/', views.bindThu),
    path('getHealthInfo/', views.getHealthInfo),
    path('bindState/', views.bindState),
]