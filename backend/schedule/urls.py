from django.urls import path
from . import views

urlpatterns=[
    path('todos/',views.todos),
    path('addTodo/',views.addTodo),
    path('deleteTodo/',views.deleteTodo),
    path('changeTodo/',views.changeTodo),
    path('addAct/',views.addAct),
    path('deleteAct/',views.deleteAct),
    path('changeAct/',views.changeAct),
    path('findAct/',views.findAct),
    path('partAct/',views.partAct),
    path('getddl/',views.getddl),
    path('doTodo/',views.doTodo),
    path('getActDetail/',views.getActDetail),
    path('getApplication/',views.getApplication),
    path('appReply/',views.appReply),
    path('exitAct/',views.exitAct),
    path('commentAct/',views.commentAct),
    path('likeComment/',views.likeComment),
    path('dislikeComment/',views.dislikeComment),
    path('deleteComment/',views.deleteComment),
]