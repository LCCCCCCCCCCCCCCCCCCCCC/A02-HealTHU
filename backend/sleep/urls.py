from django.urls import path
from . import views

urlpatterns=[
    path('getSleep/', views.getSleep),
    path('changeSleepState/', views.changeSleepState),
    path('changeSleep/', views.changeSleep),
]