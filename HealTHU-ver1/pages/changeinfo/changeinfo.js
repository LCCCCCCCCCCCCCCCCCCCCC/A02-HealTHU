// pages/changeinfo/changeinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    id:'',
    sign:''
  },
  handleNameInput(event) {
    this.setData({
      nickName: event.detail
    });
  },
  handleSignInput(event) {
    this.setData({
      sign: event.detail
    });
  },
  onChooseAvatar(e){
    this.setData({'avatarUrl': e.detail.avatarUrl})
  },
  change(){
    wx.setStorageSync('avatarUrl', this.data.avatarUrl);
    wx.setStorageSync('nickName', this.data.nickName);
    wx.setStorageSync('sign', this.data.sign);
    wx.showToast({
      title: "修改成功",
      icon: "success"
    });
    wx.navigateTo({
      url: '../mainpage/mainpage?tabid=2'
    })
    // 后端请求，更新用户状态
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var avatarUrl = wx.getStorageSync('avatarUrl');
    var nickName = wx.getStorageSync('nickName');
    var sign = wx.getStorageSync('sign');
    this.setData({
      avatarUrl: avatarUrl,
      nickName: nickName,
      id:"ID",
      sign: sign
    });
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