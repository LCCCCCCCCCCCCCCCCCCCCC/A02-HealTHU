// pages/bbs/addbbs/addbbs.js
Page({
  data: {
    fileList: [],
    time: '',
    title: '',
    content: ''
  },
  // TODO: 发送帖子对接
  addbbs() {
    wx.showToast({ title: 'TODO：后端对接', icon: 'none' });
  },
  afterRead(event) {

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

  },
  onClickLeft() {
    wx.navigateBack({delta:1});
  },
  handleNameInput(event) {
    this.setData({
      title: event.detail
    });
  },
  handleInput(event) {
    this.setData({
      content: event.detail
    });
  },
})