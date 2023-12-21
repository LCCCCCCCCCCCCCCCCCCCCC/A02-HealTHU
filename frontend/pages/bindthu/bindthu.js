// pages/bindthu/bindthu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbind:false,
    showbind:false,
    ID:"暂未绑定",
    studentID:"",
    password:""
  },
  bindthu(){
    this.setData({showbind:true})
  },
  unbindthu(){
    this.setData({
      ID:"暂未绑定",
      isbind:false,
      studentID:"",
      password:""
    })
  },
  handleIDInput(event){
    this.setData({
      studentID: event.detail.value
    });
  },
  handlePasswordInput(event){
    this.setData({
      password: event.detail.value
    });
  },
  change(){
    this.setData({
      ID: this.data.studentID,
      showbind:false,
      isbind:true
    });
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