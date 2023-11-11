// pages/personalCenter/personalcenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    //初始为默认值
    userInfo: {
      avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
      nickName: '微信昵称'
    },
  },

  /**
   * 点击登录函数
   */
  sign(){
    this.setData({ show: true });
    wx.getUserProfile({
      desc: 'desc',
      success:(res)=>{
        console.log(res.userInfo);
      }
    })
  },
  /**
   * 登录弹窗设置
   */
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  onChooseAvatar(e){
    console.log(e.detail.avatarUrl);
    this.setData({'userInfo.avatarUrl': e.detail.avatarUrl})
  },
  onChooseNickname(e){
    console.log(e);
    this.setData({'userInfo.nickName': e.detail.value})
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