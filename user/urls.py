from django.urls import path
from . import views

urlpatterns=[
    path('getId/',views.getId),
    path('getDetail/',views.getDetail),
    path('changeInfo/', views.changeInfo),
    path('getAttention/', views.getAttention)
]