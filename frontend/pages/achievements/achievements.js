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
      {img: "../images/ach12last.png", text: "月度纪念2022", time: "2022/12", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach1.png",text: "月度纪念2023", time: "2023/1", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach2.png",text: "月度纪念2023", time: "2023/2", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach3.png",text: "月度纪念2023", time: "2023/3", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/hundred.png",text: "百日的思索与规划", time: "2023/3", detail:"注册满100天", state: 100},
      {img: "../images/ach4.png",text: "月度纪念2023", time: "2023/4", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach5.png",text: "月度纪念2023", time: "2023/5", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach6.png",text: "月度纪念2023", time: "2023/6", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach7.png",text: "月度纪念2023", time: "2023/7", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach8.png",text: "月度纪念2023", time: "2023/8", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach9.png",text: "月度纪念2023", time: "2023/9", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach10.png", text: "月度纪念2023", time: "2023/10", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach11.png", text: "月度纪念2023", time: "2023/11", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/oneyear.png",text: "一年的坚持与守望", time: "2023/11", detail:"注册满一年", state: 100},
      {img: "../images/ach12.png",text: "月度纪念2023", time: "", detail:"当月打卡日期超过10天", state: 80},
      {img: "../images/twoyear.png",text: "两年的回顾与探索", time: "", detail:"注册满两年", state: 50},
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