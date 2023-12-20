// pages/activities/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeLabel: [0, 1], //onLoad时候也获取comment,检验一下用户id是否在likeList里,来显示点赞状态
    meanscore: 4.5,
    comment: [
        {likeNum: 1, likeList: ['9'], scoreValue: 4, name: 'teto', text: '非常好活动，即使是我也得到体育分数', time:'2023/12/18'},
        {likeNum: 2, likeList: ['3', '9'], scoreValue: 5, name: 'GUMI', text: '阳光锻炼ddl提醒小助手', time:'2023/12/18'},
      ],
    userscore: 0,
    userid:3,
    actid:3734,
    signshow: false,
    scoreshow: false,
    signtext: '',
    scoretext: '',
    activity:{
      /*
      title: "软件学院2023秋第10周集体锻炼",
      promoter:"NLno", 
      promoterId:3,
      promoterUrl:'../../images/avatar4.jpg',
      participantNum:2,
      participants:["teto","GUMI"],
      participantsId:[5,7],
      partNumMin:2,
      partNumMax:4,
      date:"2023/12/18",
      start:"17:00",
      end:"18:00",
      label:"打卡统计",
      detail:"可以作为阳光体育打卡的凭证，报名时请填写姓名、学号信息，便于助教统计",
      images:['../../images/swiper1.jpg', '../../images/swiper2.jpg', '../../images/swiper3.jpg'],
      tags:["紫荆操场","飞盘","集体锻炼"],
      state:0
      */
    },
    todos:[]
  },

  //  TODO: 点赞和取消
  likeAct(event) {
    const personindex = event.currentTarget.dataset.index;
    var like = this.data.comment;
    like[personindex].likeNum++;
    var likeLabel = this.data.likeLabel;
    likeLabel[personindex] = 1;
    this.setData({
      likeLabel: likeLabel,
      comment: like
    })
  },
  dislikeAct(event) {
    const personindex = event.currentTarget.dataset.index;
    var like = this.data.comment;
    like[personindex].likeNum--;
    var likeLabel = this.data.likeLabel;
    likeLabel[personindex] = 0;
    this.setData({
      likeLabel: likeLabel,
      comment: like
    })
  },
  // TODO：报名和评分处理
  scoreConfirm() {

  },
  signupConfirm() {
    var id = wx.getStorageSync('id')
    var that = this
    wx.request({
      url:'http://127.0.0.1:8000/schedule/partAct/',
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
      }
    })
  },
  handleSignup() {
    if(this.data.activity.state == 1){
      wx.showToast({ title: '活动已结束', icon: 'cross' });
    }
    else{
      let that = this
      let id = wx.getStorageSync('id')
      wx.request({
        url:'http://127.0.0.1:8000/schedule/todos/',
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
    this.setData({ scoreshow : true });     
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
    var actid = options.actid;
    var that = this
    wx.request({
      url:'http://127.0.0.1:8000/schedule/getActDetail/',
      data:{
        'actId': actid
      },
      method:'GET',
      success:function(res){
        let activity = res.data
        activity.promoterId = activity.promoter
        activity.participantNum = activity.participants.length
        activity.participantsId = activity.participants
        wx.request({
          url:'http://127.0.0.1:8000/user/getDetail/',
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
            that.setData({
              activity:activity
            })
          }
        })      
        for(let i = 0;i<activity.participantNum;i++){
          let j = 0
          wx.request({
            url:'http://127.0.0.1:8000/user/getDetail/',
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