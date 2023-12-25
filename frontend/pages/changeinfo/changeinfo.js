// pages/changeinfo/changeinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    sign:'',
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
    var that = this
    var id = wx.getStorageSync('id')
    console.log(that.data)
    wx.request({
      url:'http://127.0.0.1:8000/user/changeInfo/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id: id,
        nickName:that.data.nickName,
        avatarUrl:that.data.avatarUrl,
        signature:that.data.sign
      },
      method:'POST',
      success:function(res){
        wx.showToast({
          title: "修改成功",
          icon: "success"
        });
        //wx.navigateTo({
          //url: '../mainpage/mainpage?tabid=2'
        //})
      }
    })
    // 后端请求，更新用户状态
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    var id = wx.getStorageSync('id')
    wx.request({
      url:'http://127.0.0.1:8000/user/getDetail/',
      data:{
        'hostId': id,
        'customerId':id
      },
      method:'GET',
      success:function(res){
        var data = JSON.parse(res.data)
        that.setData({
          avatarUrl: data.avatarUrl,
          nickName: data.nickName,
          id:id,
          sign: data.signature
        })
      }
    })
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