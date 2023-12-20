// pages/activities/actreview/actreview.js
Page({
  data: {
    activity: {
      title: "软件学院2023秋第10周集体锻炼",
      participantNum:2,
      partNumMin:2,
      partNumMax:4,
      date:"2023/12/18",
      start:"17:00",
      end:"18:00",
    },
    reviewList: [
      {id: 1, nickname:"GUMI", text:"软院 2022012222 张三", state:1},
      {id: 2, nickname:"teto",  text:"软件学院 2021011111 李四，请让我参加活动，我什么都会做的！", state: 0},
      {id: 404, nickname:"anonymous",  text:"让我看看", state: 2}
    ],
    // 0未处理，1接受，2拒绝
    tempItem: {id: 1, nickname:"GUMI", text:"软院 2022012222 张三", state:1},
    reviewshow: false,
    radio: "1"
  },

  reviewHandle() {
    if(this.data.radio === "1") {
      // 同意请求,操作对象为tempItem,更新reviewList状态

      wx.showToast({ title: '已同意', icon: 'success' });
    }
    else if(this.data.radio === "2"){
      //拒绝请求

      wx.showToast({ title: '已拒绝', icon: 'success' });
    }
  },
  reviewShow(event) {
    const personindex = event.currentTarget.dataset.index;
    const tempList = this.data.reviewList;
    const tempItem = tempList[personindex];
    this.setData({
      reviewshow: true,
      tempItem: tempItem
    });
  },
  onChange(event) {
    this.setData({ radio: event.detail });
  },
  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({ radio: name });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var actid = options.actid;
    // TODO：请求获取申请信息（需要对重复提交的进行筛选吗？），获取活动人数限制相关信息到activity
    // 但不知道是否要保留已经处理过的请求
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