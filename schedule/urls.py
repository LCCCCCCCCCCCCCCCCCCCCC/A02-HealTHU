from django.urls import path
from . import views

urlpatterns=[
    path('todos/',views.todos),
    path('addTodo/',views.changeTodo),
    path('deleteTodo/',views.changeTodo),
    path('changeTodo/',views.changeTodo),
    path('addAct/',views.addAct),
    path('deleteAct/',views.addAct),
    path('changeAct/',views.addAct),
    path('findAct/',views.findAct),
    path('partAct/',views.partAct),
]