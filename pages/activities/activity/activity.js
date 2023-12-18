// pages/activities/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoreValue: 4,
    activity:{
      title: "软件学院2023秋第10周集体锻炼",
      promoter:"NLno", 
      promoterId:3,
      promoterUrl:'../../images/avatar4.jpg',
      participantNum:2,
      patticipants:["teto","GUMI"],
      participantsId:[5,7],
      partNumMin:2,
      partNumMax:4,
      date:"2023/12/18",
      start:"17:00",
      end:"18:00",
      label:"打卡统计",
      detail:"可以作为阳光体育打卡的凭证",
      images:['../../images/swiper1.jpg', '../../images/swiper2.jpg', '../../images/swiper3.jpg'],
      tags:["紫荆操场","飞盘","集体锻炼"],
      state:1
    }
  },

  handleClick() {
    if(this.data.activity.state == 1){
      wx.showToast({ title: '活动已结束', icon: 'cross' });
      return;
    }
    wx.showToast({ title: '报名成功！TODO:signup', icon: 'success' });
    //和外面报名保持一致
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var actid = options.actid;
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