// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '',
      id:"",
      sign:""
    },
    id:''
    // id为用户自身id，打开主页时传递一个参数userInfo.id并请求后端获取对应信息
    // 用于确定是否为自己主页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    wx.getStorage({
      key: 'id',
      success: function(res) {
        console.log(res.data);
        that.setData({
          'userInfo.id': res.data
        });
      }
    });
    wx.getStorage({
      key: 'nickName',
      success: function(res) {
        console.log(res.data);
        that.setData({
          'userInfo.nickName': res.data
        });
      }
    });
    wx.getStorage({
      key: 'sign',
      success: function(res) {
        console.log(res.data);
        that.setData({
          'userInfo.sign': res.data
        });
      }
    });
    wx.getStorage({
      key: 'avatarUrl',
      success: function(res) {
        console.log(res.data);
        that.setData({
          'userInfo.avatarUrl': res.data
        });
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