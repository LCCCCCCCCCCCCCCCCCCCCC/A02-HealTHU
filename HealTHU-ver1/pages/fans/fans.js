// pages/fans/fans.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userList: [
      {
        id: '1',
        nickname: 'user1',
        avatar: '../images/avatar1.png',
        signature: '签名1',
        followed: true
      },
      {
        id: 'user2',
        nickname: 'user2',
        avatar: '../images/avatar2.png',
        signature: '签名2',
        followed: true
      },
      {
        id: 'user3',
        nickname: 'user3',
        avatar: '../images/avatar3.png',
        signature: '签名3',
        followed: false
      },
    ]
  },
  onClickRight() {
    wx.showToast({ title: 'TODO:sousuo', icon: 'none' });
  },
  followUser(event) {
    const userId = event.currentTarget.dataset.id;
    // 调用后端接口发送关注请求,并更新对应用户项的状态
    console.log('关注用户', userId);
    wx.showToast({ title: '关注用户', icon: 'none' });
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