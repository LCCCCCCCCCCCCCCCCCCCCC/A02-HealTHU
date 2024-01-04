from django.urls import path
from . import views

urlpatterns=[
    path('getId/', views.getId),
    path('getDetail/', views.getDetail),
    path('changeInfo/', views.changeInfo),
    path('getAttention/', views.getAttention),
    path('getFans/', views.getFans),
    path('addAttention/', views.addAttention),
    path('delAttention/', views.delAttention),
    path('postImage/', views.postImage),
    path('search/', views.search),
    path('getPersonal/', views.getPersonal),
    path('getRange/', views.getRange),
    path('changeRange/', views.changeRange),
]