// pages/activities/activities.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    value: '',
  },
  onClickRight() {
    wx.showToast({ title: 'TODO:new_activity', icon: 'none' });
  },
  showdetail() {
    wx.navigateTo({
      url: './activity/activity'
    })
  },
  signup(){
    wx.showToast({ title: '报名成功！TODO:signup', icon: 'success' });
  },
  // onChange(e) {
  //   this.setData({
  //     value: e.detail,
  //   });
  // },
  // onSearch() {
  //   Toast('搜索' + this.data.value);
  // },
  // onClick() {
  //   Toast('搜索' + this.data.value);
  // },
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