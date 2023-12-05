// pages/fans/fans.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userList: []
  },
  onClickRight() {
    wx.showToast({ title: 'TODO:sousuo', icon: 'none' });
  },
  followUser(event) {
    // 本地存储fans更新，界面userList更新
    var fans = wx.getStorageSync('fans');
    const userId = event.currentTarget.dataset.id;
    var user = fans.find(function(u) {
      return u.id === userId;
    });
    console.log(user);
    if (user) {
      user.followed = true;
      wx.setStorage({
        key: 'fans',
        data: fans,
        success: function(res) {
        }
      });
      this.setData({
        userList: fans
      });
      // 本地attention更新
      var attention = wx.getStorageSync('attention');
      attention.push(user);
      wx.setStorage({
        key: 'attention',
        data: attention,
        success: function(res) {
        // TODO:调用后端接口发送关注请求,并更新对应用户项的状态
        }
      });
    } 
    console.log('关注用户', userId);
    wx.showToast({ title: '关注成功', icon: 'success' });
  },

  unfollowUser(event) {
    // 本地fans更新，界面userList更新
    var fans = wx.getStorageSync('fans');
    const userId = event.currentTarget.dataset.id;
    var user = fans.find(function(u) {
      return u.id === userId;
    });
    console.log(user)
    if (user) {
      user.followed = false;
      wx.setStorage({
        key: 'fans',
        data: fans,
        success: function(res) {
        }
      });
      this.setData({
        userList: fans
      });
    } 

    // 本地attention删人
    var attention = wx.getStorageSync('attention');
    var updatedAttention = attention.filter(function(u) {
      return u.id !== userId;
    });
    wx.setStorage({
      key: 'attention',
      data: updatedAttention,
      success: function(res) {
      // TODO:调用后端接口发送取消关注请求,并更新对应用户项的状态
      }
    });

    console.log('取消关注', userId);
    wx.showToast({ title: '已取消关注', icon: 'success' });
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
    var fans = wx.getStorageSync('fans');
    this.setData({
      userList: fans
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