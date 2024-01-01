// pages/activities/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeLabel: [0, 1], //onLoad时候也获取comment,检验一下用户id是否在likeList里,来显示点赞状态
    meanscore: 4.5,
    comment: [
        {likes: 1, likeId: ['9'], score: 4, nickname: 'teto', comment: '非常好活动，即使是我也得到体育分数', pubTime:'2023/12/18'},
        {likes: 2, likeId: ['3', '9'], score: 5, nickname: 'GUMI', comment: '阳光锻炼ddl提醒小助手', pubTime:'2023/12/18'},
      ],
    userscore: 0,
    userid:3,
    actId:3734,
    signshow: false,
    scoreshow: false,
    signtext: '',
    scoretext: '',
    activity:{},
    todos:[],
    debugact: {
      title: "软件学院2023秋第10周集体锻炼",
      promoter:"NLno", 
      promoterId:3,
      promoterUrl:'../../images/avatar4.jpg',
      participantNum:2,
      participants:["teto","GUMI"],
      participantsId:[4,5],
      partNumMin:2,
      partNumMax:4,
      date:"2023/12/18",
      start:"17:00",
      end:"18:00",
      label:"打卡统计",
      detail:"可以作为阳光体育打卡的凭证，报名时请填写姓名、学号信息，便于助教统计",
      images:['../../images/swiper1.jpg', '../../images/swiper2.jpg', '../../images/swiper3.jpg'],
      tags:["紫荆操场","飞盘","集体锻炼"],
      state:2
    }
  },

  //  TODO: 点赞和取消
  likeAct(event) {
    const personindex = event.currentTarget.dataset.index;
    var like = this.data.comment;
    like[personindex].likes++;
    var likeLabel = this.data.likeLabel;
    likeLabel[personindex] = 1;
    var that = this
    wx.request({
      url:'http://43.138.52.97:8001/schedule/likeComment/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:that.data.comment[personindex].id,
        actId: that.data.actId,
        likerId: that.data.userid
      },
      method:'POST',
      success:function(res){
        that.setData({
          likeLabel: likeLabel,
          comment: like
        })
        that.onLoad()
      }
    })
  },
  dislikeAct(event) {
    const personindex = event.currentTarget.dataset.index;
    var like = this.data.comment;
    like[personindex].likes--;
    var likeLabel = this.data.likeLabel;
    likeLabel[personindex] = 0;
    var that = this
    wx.request({
      url:'http://43.138.52.97:8001/schedule/dislikeComment/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:that.data.comment[personindex].id,
        actId: that.data.actId,
        dislikerId: that.data.userid
      },
      method:'POST',
      success:function(res){
        that.setData({
          likeLabel: likeLabel,
          comment: like
        })
        that.onLoad()
      }
    })
  },
  deleteComment(event){
    const personindex = event.currentTarget.dataset.index;
    var like = this.data.comment;
    var that = this
    wx.request({
      url:'http://43.138.52.97:8001/schedule/deleteComment/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:that.data.comment[personindex].id,
        actId: that.data.actId,
      },
      method:'POST',
      success:function(res){
        wx.showToast({ title: '删除成功', icon: 'success' });
        that.onLoad()
      }
    })
  },
  // TODO：报名和评分处理
  scoreConfirm() {
    var id = wx.getStorageSync('id')
    let that = this
    var date = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0')
    wx.request({
      url:'http://43.138.52.97:8001/schedule/commentAct/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        commenterId: id,
        actId: that.data.actId,
        comment: that.data.scoretext,
        score: that.data.userscore,
        pubTime: date
      },
      method:'POST',
      success:function(res){
        wx.showToast({ title: '评价成功', icon: 'success' });
        that.onLoad()
      }
    })
  },
  signupConfirm() {
    var id = wx.getStorageSync('id')
    var that = this
    wx.request({
      url:'http://43.138.52.97:8001/schedule/partAct/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id: id,
        otherId: that.data.activity.promoterId,
        actId: that.data.activity.id,
        message: that.data.signtext
      },
      method:'POST',
      success:function(res){
        wx.showToast({ title: '报名成功', icon: 'success' });
        wx.request({
          url:'http://43.138.52.97:8001/user/getDetail/',
          data:{
            'hostId': id,
            'customerId':id
          },
          method:'GET',
          success:function(res){
            var data = JSON.parse(res.data)
            var nickName = data.nickName
            var messageContent = nickName + "报名了你的活动"
            var nowTime = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0') + " " + parseInt(new Date().getHours()).toString().padStart(2, '0') + ":" + parseInt(new Date().getMinutes()).toString().padStart(2, '0')
            var recieverId = that.data.activity.promoterId
            var toUrl = '../activities/actreview/actreview?actid=' + that.data.activity.id
            wx.request({
              url:'http://43.138.52.97:8001/message/sendMessage/',
              header:{ 'content-type': 'application/x-www-form-urlencoded'},
              data:{
                receiverId: recieverId,
                time: nowTime,
                content: messageContent,
                toUrl: toUrl
              },
              method:'POST',
              success:function(res){
                that.onLoad()
              }
            })
          }
        })
      }
    })
  },
  handleSignup() {
    if(this.data.activity.state == 2){
      wx.showToast({ title: '活动已结束', icon: 'cross' });
    }
    else if(this.data.activity.state == 1){
      wx.showToast({ title: '活动进行中', icon: 'cross' });
    }
    else{
      let that = this
      let id = wx.getStorageSync('id')
      wx.request({
        url:'http://43.138.52.97:8001/schedule/todos/',
        data:{
          'id': id,
          'date': that.data.activity.date
        },
        method:'GET',
        success:function(res){
          var data = res.data
          that.setData({
            todos: data
          });
          if(that.isValid(that.data.activity.start,that.data.activity.end,that.data.todos,"活动")){
            that.setData({ signshow : true }); 
          }
          else{
            wx.showToast({ title: '时间冲突'})
          }
        }
      })
    }
  },
  handleScore() {
    this.setData({ 
      scoreshow : true,
      signtext:""
    });     
  },
  onscoreClose() {
    this.setData({ scoreshow : false });     
  },
  onsignClose() {
    this.setData({ signshow : false });     
  },
  handleScoreGiven(event) {
    this.setData({ userscore : event.detail });
  },
  handleScoreInput(event) {
    this.setData({
      scoretext: event.detail.value
    });
  },
  handleSignInput(event) {
    this.setData({
      signtext: event.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    var id = wx.getStorageSync('id')
    this.setData({
      actId: options.actid,
      userid:id
    })
    wx.request({
      url:'http://43.138.52.97:8001/schedule/getActDetail/',
      data:{
        'actId': that.data.actId
      },
      method:'GET',
      success:function(res){
        let activity = res.data
        that.setData({
          comment:res.data.comments
        })
        var meanscore = 0
        var likeLabel = []
        for(var k = 0;k < that.data.comment.length;k++){
          meanscore += Number(that.data.comment[k].score)
          if(that.data.comment[k].likesId.includes(id)){
            likeLabel[k] = 1
          }
          else{
            likeLabel[k] = 0
          }
        }
        meanscore = (meanscore/ that.data.comment.length).toFixed(1)
        if(isNaN(meanscore)){meanscore = 0}
        that.setData({
          meanscore:meanscore,
          likeLabel:likeLabel
        })
        activity.promoterId = activity.promoter
        activity.participantNum = activity.participants.length
        activity.participantsId = activity.participants
        wx.request({
          url:'http://43.138.52.97:8001/user/getDetail/',
          data:{
            'hostId': activity.promoter,
            'customerId':activity.promoter
          },
          method:'GET',
          success:function(res){
            var dataa = JSON.parse(res.data)
            activity.promoter = dataa.nickName
            activity.promoterUrl = dataa.avatarUrl
            activity.state = that.getState(activity.date,activity.start,activity.end)
            console.log(activity)
            that.setData({
              activity:activity
            })
          }
        })      
        for(let i = 0;i<activity.participantNum;i++){
          let j = 0
          wx.request({
            url:'http://43.138.52.97:8001/user/getDetail/',
            data:{
              'hostId': activity.promoter,
              'customerId':activity.participantsId[i]
            },
            method:'GET',
            success:function(res){
              var dataa = JSON.parse(res.data)
              activity.participants[i] = dataa.nickName
              if(j == activity.participantNum - 1){
                that.setData({
                  activity:activity
                })
              }
            }
          })
        }
      }
    })
    // debug: only shown use
    if(options.actid == 10001) {
      this.setData({
        activity: this.data.debugact
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  isValid(start,end,todos,type){
    var nowTime = new Date().getHours() + ":" + (new Date().getMinutes()).toString().padStart(2, '0')
    nowTime = parseInt(nowTime.replace(":",""))
    var date = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0'),
    start = parseInt(start.replace(":", ""))
    end = parseInt(end.replace(":", ""))
    if(start>end){
      return false;
    }
    if((date == this.data.date)&&((start<=nowTime)||(end<=nowTime))){
      return false;
    }
    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i];
      let thestart = parseInt(todo.start.replace(":", ""))
      let theend = parseInt(todo.end.replace(":", ""))
      if (!((start <= thestart && end <= thestart) || (end >= theend && start >= theend))) {
        return false; // 与某一项有重叠，不合法
      }
    }
    return true; // 没有重叠，合法
  },
  getState(date,start,end){
    var nowTime = parseInt(new Date().getHours() + (new Date().getMinutes()).toString().padStart(2, '0'))
    var nowDate = parseInt(new Date().getFullYear() + (new Date().getMonth() + 1).toString().padStart(2, '0') + new Date().getDate().toString().padStart(2, '0')),
    start = parseInt(start.replace(":", ""))
    end = parseInt(end.replace(":", ""))
    date = parseInt(date.replace(/\//g, ""));
    if((date>nowDate)||((date == nowDate)&&(start>nowTime))){
      return 0
    }
    else if((date<nowDate)||((date == nowDate)&&(end<nowTime))){
      return 2
    }
    else{
      return 1
    }
  }
})