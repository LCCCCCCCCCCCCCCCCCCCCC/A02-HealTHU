// pages/addactivity/addactivity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  addAct(){
    var id = wx.getStorageSync('id')
    wx.request({
      url:'http://127.0.0.1:8000/schedule/addAct/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id: id,
        pubTime: "2023/12/19 13:00",
        title: "原神",
        promoter: id,
        participants: [],
        partNumMin: 2,
        partNumMax: 4,
        date: "2023/12/20",
        start: "14:00",
        end: "15:00",
        label: "我要玩原神！",
        detail: "",
        images: [],
        tags: '["原神","op","玩原神玩的"]',
        state: 0,
        comments:[]
      },
      method:'POST',
      success:function(res){
        console.log(res)
        wx.showToast({ title: '添加成功', icon: 'success' });

      }
    })
  },
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