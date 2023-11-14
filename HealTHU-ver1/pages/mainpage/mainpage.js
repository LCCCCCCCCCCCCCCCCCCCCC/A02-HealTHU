// pages/mainpage/mainpage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todos:[
    ],
    currentTab: 0,
    userInfo: {
      avatarUrl: '',
      nickName: '',
      id:"ID",
      sign:"尚未设置"
    }
  },
  handleTabChange(event){
    const tab = event.currentTarget.dataset.tab
    this.setData({
      currentTab: tab
    });
  },
  gotoedit(){
    wx.navigateTo({
      url: '../plan/plan'
    })
  },
  activity(){
    wx.navigateTo({
      url: '../activities/activities'
    })
  },
  sports(){
    wx.navigateTo({
      url: '../sports/sports'
    })
  },
  dailyhealth(){
    wx.navigateTo({
      url: '../dailyhealth/dailyhealth'
    })
  },
  achievements(){
    wx.navigateTo({
      url: '../achievements/achievements'
    })
  },
  dongtai(){
    wx.navigateTo({
      url: '../personal/personal'
    })
  },
  guanzhu(){
    wx.navigateTo({
      url: '../attention/attention'
    })
  },
  fensi(){
    wx.navigateTo({
      url: '../fans/fans'
    })
  },
  changeInfo(){
    wx.navigateTo({
      url: '../changeinfo/changeinfo'
    })
  },
  health(){
    wx.navigateTo({
      url: '../changehealth/changehealth'
    })
  },
  tsinghua(){
    wx.navigateTo({
      url: '../bindthu/bindthu'
    })
  },
  set(){
    wx.navigateTo({
      url: '../settings/settings'
    })
  },
  messages(){
    wx.navigateTo({
      url: '../messages/messages'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
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
    var data = wx.getStorageSync('todos');
    //todo:主页只展示结束时间在当前时间之后的
    var avatarUrl = wx.getStorageSync('avatarUrl');
    var nickName = wx.getStorageSync('nickName');
    var sign = wx.getStorageSync('sign');
    this.setData({
      todos: data,
      userInfo:{
        avatarUrl: avatarUrl,
        nickName: nickName,
        id:"ID",
        sign: sign
      }
    });
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