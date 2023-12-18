// pages/activities/activities.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    value: '',
    activities:[
      {title: "软件学院2023秋第10周集体锻炼", promoter:"NLno", participantNum:2,partNumMin:2,partNumMax:4,date:"2023/12/18",start:"17:00",end:"18:00",label:"打卡统计",tags:["紫荆操场","飞盘","集体锻炼"],state:0,id:3734},
      {title: "寻找网球等球类搭子", promoter:"NLno", participantNum:0,partNumMin:1,partNumMax:2,date:"2023/12/19",start:"15:00",end:"18:00",label:"初学者，水平一般，周末都有空，希望不嫌我菜",tags:["紫荆网球场","网球","羽毛球","交友"],state:1,id:6852},
    ]
  },
  onClickRight() {
    wx.navigateTo({
      url: '../addactivity/addactivity',
    })
  },
  showdetail(event) {
    const id = event.currentTarget.dataset.id;
    wx.redirectTo({
      url: './activity/activity?actid=' + id
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