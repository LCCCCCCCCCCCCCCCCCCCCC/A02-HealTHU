// pages/personal/personal.js
Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '微信用户',
      id:"3",
      sign:"这个人很懒，即使这样也没有留下签名"
    },
    id:'3', // 用于确定是否为自己主页
    // 展示最近获得的6个成就好了
    achList: [
      {img: "../images/ach7.png",text: "月度纪念2023", time: "2023/7", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach8.png",text: "月度纪念2023", time: "2023/8", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach9.png",text: "月度纪念2023", time: "2023/9", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach10.png", text: "月度纪念2023", time: "2023/10", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach11.png", text: "月度纪念2023", time: "2023/11", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/oneyear.png",text: "一年的坚持与守望", time: "2023/11", detail:"注册满一年", state: 100},
    ],
    bbsList: [
      {title:"今天真冷啊..", time:"2023-12-18 13:56", url: '../bbs/bbs?bbsid=103'},
      {title:"[活动报名] 2023秋软件学院集体锻炼", time:"2023-12-18 9:20", url: '../activities/activity/activity?actid=1'},
      {title:"[提问氵]西操体育馆几点开放啊", time:"2023-12-17 18:56", url: '../bbs/bbs?bbsid=102'},
      {title:"[失物招领]在紫操西北角捡到一串钥匙，已经交到紫荆一楼了", time:"2023-12-17 17:30", url: '../bbs/bbs?bbsid=101'},
      // {title:"[新成就] “一年的坚持与守望”", time:"2023-11-31 10:02", url: '../bbs/bbs?bbsid=100'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      // 获取options.id对应的用户信息

      var userInfo = this.data.userInfo;
      userInfo.id = options.id;
      this.setData({ userInfo: userInfo });
    } 

    wx.getStorage({
      key: 'id',
      success: function(res) {
        this.setData({'id': res.data});
      }
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