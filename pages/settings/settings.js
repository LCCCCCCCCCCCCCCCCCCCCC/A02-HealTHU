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
  },
  //活动可见
  onTypeConfirm2({ detail }) {
    this.setData({ optionvalue2: detail });
  },
  //帖子可见
  onTypeConfirm3({ detail }) {
    this.setData({ optionvalue3: detail });
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