from django.shortcuts import render
from django.http import HttpResponse
from .models import User
# Create your views here.

def user_index(request):
    if request.method == 'GET':
        nickName = request.GET.get('nickName')
        avatarUrl = request.GET.get('avatarUrl')
        user = User(nickName=nickName, avatarUrl=avatarUrl)
        user.save()
        return HttpResponse(f"nickName: {nickName}, avatarUrl: {avatarUrl},显示成功")
    else:
        return HttpResponse('添加失败')
