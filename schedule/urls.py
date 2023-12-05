from django.urls import path
from . import views

urlpatterns=[
    path('todos/',views.todos),
    path('changeTodo/',views.changeTodo),
    path('addAct/',views.addAct),
    path('findAct/',views.findAct),
    path('partAct/',views.partAct),
]