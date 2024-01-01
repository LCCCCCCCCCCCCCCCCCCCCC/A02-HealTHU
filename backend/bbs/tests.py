from django.test import TestCase, Client
from user.models import User, UserInfo, CustomSettings
from bbs.models import Floor, Topic
import json

# Create your tests here.
class AddAndDeletePostTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(userid='123456789',
                                        userInfo= UserInfo.objects.create(avatarUrl='https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKicw6iax6kibh4ibic3oicib7XibEwJ3lJ4ib1VZ3cibcic2ZU9pYiaY3icYVib4ZoWuYzJQF1qf6ibw1ibg6j5icicw/132',
                                                                          nickName='test',
                                                                          signature='test',
                                                                          followings=json.dumps([]),
                                                                          followingNum=0,
                                                                          followers=json.dumps([]),
                                                                          followerNum=0,
                                                                          achievements=json.dumps([])),
                                        customSettings=CustomSettings.objects.create(displayMode=0,
                                                                                     ddlRange='2023-12-31',
                                                                                     storageRange='2024-12-31',
                                                                                     achRange=0,
                                                                                     actRange=0,
                                                                                     postRange=0,
                                                                                     blackList=json.dumps([])))


    def test_add_post(self):
        response = self.client.post('/bbs/addPost/', {'id': self.user.id, 'title': 'test', 'content': 'test', 'time': '2020-12-12 12:12:12'})
        # check the response
        self.assertEqual(response.content.decode(), 'Post added')
        # find if exists
        targetTopic = Topic.objects.get(title='test')
        # check its params
        self.assertEqual(targetTopic.userId, self.user.id)
        self.assertEqual(targetTopic.name, self.user.userInfo.nickName)
        self.assertEqual(targetTopic.avatar, self.user.userInfo.avatarUrl)
        self.assertEqual(targetTopic.title, 'test')
        self.assertEqual(targetTopic.time, '2020-12-12 12:12:12')
        self.assertEqual(targetTopic.likes, 0)
        self.assertEqual(targetTopic.likeList, [])
        self.assertEqual(targetTopic.images, [])
        self.assertEqual(targetTopic.floorCnt, 1)
        self.assertEqual(targetTopic.floors, {'1':1})
        # find if exists
        targetFloor = Floor.objects.get(id=1)
        # check its params
        self.assertEqual(targetFloor.floorNum, 1)
        self.assertEqual(targetFloor.userId, self.user.id)
        self.assertEqual(targetFloor.name, self.user.userInfo.nickName)
        self.assertEqual(targetFloor.avatar, self.user.userInfo.avatarUrl)
        self.assertEqual(targetFloor.time, '2020-12-12 12:12:12')
        self.assertEqual(targetFloor.content, 'test')
        self.assertEqual(targetFloor.likes, 0)
        
    def test_delete_post(self):
        response = self.client.post('/bbs/addPost/', {'id': self.user.id, 'title': 'test', 'content': 'test', 'time': '2020-12-12 12:12:12'})
        # check the response
        self.assertEqual(response.content.decode(), 'Post added')
        # find if exists
        targetTopic = Topic.objects.get(title='test')
        # check its params
        self.assertEqual(targetTopic.userId, self.user.id)
        self.assertEqual(targetTopic.name, self.user.userInfo.nickName)
        self.assertEqual(targetTopic.avatar, self.user.userInfo.avatarUrl)
        self.assertEqual(targetTopic.title, 'test')
        self.assertEqual(targetTopic.time, '2020-12-12 12:12:12')
        self.assertEqual(targetTopic.likes, 0)
        self.assertEqual(targetTopic.likeList, [])
        self.assertEqual(targetTopic.images, [])
        self.assertEqual(targetTopic.floorCnt, 1)
        self.assertEqual(targetTopic.floors, {'1':1})
        # find if exists
        targetFloor = Floor.objects.get(id=1)
        # check its params
        self.assertEqual(targetFloor.floorNum, 1)
        self.assertEqual(targetFloor.userId, self.user.id)
        self.assertEqual(targetFloor.name, self.user.userInfo.nickName)
        self.assertEqual(targetFloor.avatar, self.user.userInfo.avatarUrl)
        self.assertEqual(targetFloor.time, '2020-12-12 12:12:12')
        self.assertEqual(targetFloor.content, 'test')
        self.assertEqual(targetFloor.likes, 0)
        # delete the post
        response = self.client.post('/bbs/deletePost/', {'id': self.user.id, 'postId': 1, 'title': 'test', 'content': 'test', 'time': '2020-12-12 12:12:12'})
        # check the response
        self.assertEqual(response.content.decode(), 'Post deleted')
        # find if exists
        targetTopic = Topic.objects.filter(title='test')
        # check its params
        self.assertEqual(len(targetTopic), 0)
        # find if exists
        targetFloor = Floor.objects.filter(id=1)
        # check its params
        self.assertEqual(len(targetFloor), 0)
        
class likeAndDislikePostTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(userid='123456789',
                                        userInfo= UserInfo.objects.create(avatarUrl='https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKicw6iax6kibh4ibic3oicib7XibEwJ3lJ4ib1VZ3cibcic2ZU9pYiaY3icYVib4ZoWuYzJQF1qf6ibw1ibg6j5icicw/132',
                                                                          nickName='test',
                                                                          signature='test',
                                                                          followings=json.dumps([]),
                                                                          followingNum=0,
                                                                          followers=json.dumps([]),
                                                                          followerNum=0,
                                                                          achievements=json.dumps([])),
                                        customSettings=CustomSettings.objects.create(displayMode=0,
                                                                                     ddlRange='2023-12-31',
                                                                                     storageRange='2024-12-31',
                                                                                     achRange=0,
                                                                                     actRange=0,
                                                                                     postRange=0,
                                                                                     blackList=json.dumps([])))
        self.user2 = User.objects.create(userid='1234567890',
                                        userInfo= UserInfo.objects.create(avatarUrl='https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKicw6iax6kibh4ibic3oicib7XibEwJ3lJ4ib1VZ3cibcic2ZU9pYiaY3icYVib4ZoWuYzJQF1qf6ibw1ibg6j5icicw/132',
                                                                          nickName='test2',
                                                                          signature='test2',
                                                                          followings=json.dumps([]),
                                                                          followingNum=0,
                                                                          followers=json.dumps([]),
                                                                          followerNum=0,
                                                                          achievements=json.dumps([])),
                                        customSettings=CustomSettings.objects.create(displayMode=0,
                                                                                     ddlRange='2023-12-31',
                                                                                     storageRange='2024-12-31',
                                                                                     achRange=0,
                                                                                     actRange=0,
                                                                                     postRange=0,
                                                                                     blackList=json.dumps([])))
        
    def test_like_and_dislike_post(self):
        response = self.client.post('/bbs/addPost/', {'id': self.user.id, 'title': 'test', 'content': 'test', 'time': '2020-12-12 12:12:12'})
        # check the response
        self.assertEqual(response.content.decode(), 'Post added')
        # find if exists
        targetTopic = Topic.objects.get(title='test')
        # check its params
        self.assertEqual(targetTopic.userId, self.user.id)
        self.assertEqual(targetTopic.name, self.user.userInfo.nickName)
        self.assertEqual(targetTopic.avatar, self.user.userInfo.avatarUrl)
        # then try:
        # user like the post, while user2 dislike the post
        # user like the post, while user2 like the post
        # user dislike the post, while user2 dislike the post
        # user dislike the post, while user2 like the post
        response = self.client.post('/bbs/likePost/', {'id': self.user.id, 'postId': 1})
        # check the response
        self.assertEqual(response.content.decode(), 'Post liked')
        response2 = self.client.post('/bbs/dislikePost/', {'id': self.user2.id, 'postId': 1})
        # check the response
        self.assertEqual(response2.content.decode(), 'You have not liked this post')
        # check the post
        self.assertEqual(Topic.objects.get(title='test').likes, 1)
        self.assertEqual(Topic.objects.get(title='test').likeList, [self.user.id])
        
        
        