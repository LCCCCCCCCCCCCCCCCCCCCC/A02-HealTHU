from django.db import models


# Create your models here.
class Floor(models.Model):
    id = models.AutoField(primary_key=True)
    floorNum = models.IntegerField()  # the floor number, floor number starts from 1, and floorNum == 1 <---> thid the original post
    userId = models.IntegerField()  # the id of the user who posted this floor
    name = models.CharField(max_length=20)  # the nickname of the user who posted this floor
    avatar = models.CharField(max_length=200)  # the url of the avatar of the user who posted this floor
    time = models.CharField(max_length=50)  # the time the floor was created
    content = models.CharField(max_length=200)  # the content of the floor
    likes = models.IntegerField()  # the number of likes of the floor
    likeList = models.JSONField()  # the list of user ids who liked the floor
    aboveId = models.IntegerField()  # (if not the original post) the id of the floor that this post is replying to
    # IMPORTANT: the aboveId is 1 if this floor is replying to the original post
    # while -1 if this floor is replying to a floor that does not exist
    # while 0 means that this floor is the original post itself
    aboveName = models.CharField(
        max_length=20)  # (if not the original post) the nickname of the user who posted the floor that this post is replying to
    aboveContent = models.CharField(
        max_length=200)  # (if not the original post) the content of the floor that this post is replying to
    belowIds = models.JSONField()  # the list of ids of the floors that are replying to this floor
    commentNum = models.IntegerField()  # the number of comments in this floor


class Topic(models.Model):
    id = models.AutoField(primary_key=True)
    userId = models.IntegerField()  # the id of the op
    name = models.CharField(max_length=20)  # the nickname of the op
    avatar = models.CharField(max_length=200)  # the url of the avatar of the op
    title = models.CharField(max_length=50)
    time = models.CharField(max_length=50)  # the time the post was created
    likes = models.IntegerField()  # the number of likes of the post
    likeList = models.JSONField()  # the list of user ids who liked the post
    images = models.JSONField()  # the list of urls of the images
    floorCnt = models.IntegerField()  # the number of floors in this topic
    floors = models.JSONField()  # the list of floor ids
    # IMPORTANT: the floor is a dict in the form of
    # {
    #     1 : (the id of this floor), ---> -1 means a floor that is deleted
    #     2 : (the id of this floor),
    #     ...