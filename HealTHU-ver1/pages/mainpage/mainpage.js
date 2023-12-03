// pages/mainpage/mainpage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todos:[],
    fans:[],
    attention:[],
    fannum: 0,
    attentionnum: 0,
    ddls:[//这里可以选取之后一周的所有ddl，与当日事务进行区分
      {title:"软件工程验收", date:"11/23", time:"9:50", label:"第三小节"},
      {title:"党课讲座签到", date:"11/24", time:"19:20", label:"六教C10"},
      {title:"计算机网络第三次作业", date:"11/28", time:"23:59"},
      {title:"游泳测试", date:"12/9", time:"8:00"}
    ],
    currentTab: 0,
    userInfo: {
      avatarUrl: '',
      nickName: '',
      id:"ID",
      sign:"尚未设置"
    },
  },
  handleTabChange(event){
    this.setData({ currentTab: event.detail });
  },
  
  gotoedit(){
    wx.navigateTo({
      url: '../plan/plan'
    })
  },
  changeInfo(){
    wx.navigateTo({
      url: '../changeinfo/changeinfo'
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
    var tabid = options.tabid;
    this.setData({ currentTab: tabid });
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
    var fans = wx.getStorageSync('fans');
    var attention = wx.getStorageSync('attention');
    var datas = wx.getStorageSync('todos');
    //todo:主页只展示结束时间在当前时间之后的
    var currentTime = parseInt(new Date().getHours() + "" + new Date().getMinutes())
    var filteredTasks = datas.filter(function(data) {
      var end = parseInt(data.end.replace(":", ""));
      return end > currentTime
    });
    var avatarUrl = wx.getStorageSync('avatarUrl');
    var nickName = wx.getStorageSync('nickName');
    var sign = wx.getStorageSync('sign');
    var id = wx.getStorageSync('id')
    this.setData({
      todos: filteredTasks,
      fans: fans,
      attention: attention,
      userInfo:{
        avatarUrl: avatarUrl,
        nickName: nickName,
        id:id,
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