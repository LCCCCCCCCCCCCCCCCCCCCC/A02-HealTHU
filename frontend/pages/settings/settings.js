// pages/settings/settings.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    optionvalue1: 0,
    optionvalue2: 0,
    optionvalue3: 0,
    option1: [
      { text: '全部可见', value: 0 },
      { text: '仅粉丝可见', value: 1 },
      { text: '仅自己可见', value: 2 },
    ],
  },
  //成就可见
  onTypeConfirm1({ detail }) {
    this.setData({ optionvalue1: detail });
    var id = wx.getStorageSync('id')
    var that = this
    wx.request({
      url:'http://127.0.0.1:8000/user/changeRange/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:id,
        achRange: that.data.optionvalue1,
        actRange: that.data.optionvalue2,
        postRange: that.data.optionvalue3
      },
      method:'POST',
      success:function(res){
        that.onLoad()
      }
    })
  },
  //活动可见
  onTypeConfirm2({ detail }) {
    this.setData({ optionvalue2: detail });
    var id = wx.getStorageSync('id')
    var that = this
    wx.request({
      url:'http://127.0.0.1:8000/user/changeRange/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:id,
        achRange: that.data.optionvalue1,
        actRange: that.data.optionvalue2,
        postRange: that.data.optionvalue3
      },
      method:'POST',
      success:function(res){
        that.onLoad()
      }
    })
  },
  //帖子可见
  onTypeConfirm3({ detail }) {
    this.setData({ optionvalue3: detail });
    var id = wx.getStorageSync('id')
    var that = this
    wx.request({
      url:'http://127.0.0.1:8000/user/changeRange/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:id,
        achRange: that.data.optionvalue1,
        actRange: that.data.optionvalue2,
        postRange: that.data.optionvalue3
      },
      method:'POST',
      success:function(res){
        that.onLoad()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var id = wx.getStorageSync('id')
    var that = this
    wx.request({
      url:'http://127.0.0.1:8000/user/getRange/',
      data:{
        id:id,
      },
      method:'GET',
      success:function(res){
        var data = res.data
        that.setData({
          optionvalue1: data.achRange,
          optionvalue2: data.actRange,
          optionvalue3: data.postRange
        });
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

  }
})