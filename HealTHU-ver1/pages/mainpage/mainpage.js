// pages/mainpage/mainpage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todos:[
      { title: "任务1", type:"课程", color:"#BBBB00", start:"7:00", end:"7:30"},
      { title: "任务2", type:"运动", color:"#00BB00", start:"8:00", end:"8:30"},
      { title: "任务3", type:"活动", color:"#0000FF", start:"9:00", end:"9:30"},
      { title: "任务4", type:"ddl", color:"#009999", start:"10:00", end:"10:30"},
      { title: "任务5", type:"饮食", color:"#BB00BB", start:"11:00", end:"11:30"}
    ],
    currentTab: 0,
    userInfo: {
      avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
      nickName: '微信昵称',
      id:"ID",
      sign:"尚未设置"
    }
  },
  handleTabChange(event){
    const tab = event.currentTarget.dataset.tab
    console.log(tab)
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
  getColorByType(type){
    console.log(111);
    switch (type) {
      case "课程":
        return "#FFFF00";
      case "运动":
        return "#00FF00";
      case "活动":
        return "#0000FF";
      case "ddl":
        return "#00FFFF";
      case "饮食":
        return "#FF00FF";
      default:
        return "#000000"; // 默认颜色
    }
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