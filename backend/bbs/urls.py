from django.urls import path
from . import views

urlpatterns=[
    path('addPost/', views.addPost),
    path('deletePost/', views.deletePost),
    path('likePost/', views.likePost),
    path('dislikePost/', views.dislikePost),
    path('addReply/', views.addReply),
    path('deleteReply/', views.deleteReply),
    path('likeReply/', views.likeReply),
    path('dislikeReply/', views.dislikeReply),
    path('getPost/', views.getPost),
    path('getPostById/', views.getPostById),
    path('searchPost/', views.searchPost),
    path('getPostDetail/', views.getPostDetail),
]