from django.urls import path
from . import views

urlpatterns=[
    path('index/',views.user_index)
]