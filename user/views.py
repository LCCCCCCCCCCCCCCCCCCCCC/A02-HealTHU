from django.shortcuts import render
from django.http import HttpResponse
from .models import User
import requests
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

def getOpenid(request):
    if request.method == 'GET':
        code = request.GET.get("code")
        url = "https://api.weixin.qq.com/sns/jscode2session"
        url += "?appid=wx0ed6410d0f2b476f"
        url += "&secret=737153f44349fdde120da7fedce92666"
        url += "&js_code=" + code
        url += "&grant_type=authorization_code"
        r = requests.get(url)
        openid = r.json().get('openid', '')
        return HttpResponse(openid)