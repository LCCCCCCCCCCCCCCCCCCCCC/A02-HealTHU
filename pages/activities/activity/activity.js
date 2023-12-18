// pages/activities/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoreValue: 4.2,
    userscore: 0,
    userid:3,
    actid:3734,
    signshow: false,
    scoreshow: false,
    signtext: '',
    scoretext: '',
    activity:{
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
    }
  },

  // TODO：报名和评分处理
  scoreConfirm() {

  },
  signupConfirm() {

  },
  handleSignup() {
    if(this.data.activity.state == 1){
      wx.showToast({ title: '活动已结束', icon: 'cross' });
    }
    else{
      this.setData({ signshow : true }); 
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
        var activity = res.data
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
          }
        })
        for(let i = 0;i<activity.participantNum;i++){
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
              if(i == activity.participantNum - 1){
                that.setData({
                  activity:activity
                })
              }
            }
          })
        }
      }
    })
    // actid请求和data设置
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

  }
})