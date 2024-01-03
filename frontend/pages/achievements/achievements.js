// pages/achievements/achievements.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    achNow: {
      img: "../images/ach12last.png", text: "月度纪念2022", time: "2022/12", state: 100
    },
    //月度纪念就这个月用过月末领，百日和一年按注册算
    achList: [
      {img: "../images/ach1.png",text: "月度纪念2023", time: "2023/1", detail:"当月打卡日期超过10天", state: 100},
    ],
    show: false,
    achshow: false,
    radio: '1',
  },
  privacyChange() {
// TODO：成就可见范围修改对接

  },
  onClickRight() {
    this.setData({ show: true });
  },
  onTypeChange(event) {
    this.setData({  radio: event.detail });
  },
  onClose() {
    this.setData({ show: false });
  },
  onachClose() {
    this.setData({ achshow: false });
  },
  achShow(event) {
    const achindex = event.currentTarget.dataset.index;
    var tempItem = this.data.achList[achindex];
    this.setData({ 
      achNow: tempItem,
      achshow: true 
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      // TODO：获取options.id对应的用户成就信息&权限信息

    } 
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