// pages/fans/fans.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userList: []
  },
  onClickRight() {

    wx.request({
      url:'http://127.0.0.1:8000/user/addAttention/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        hostId: 2,
        customerId: 1
      },
      method:'POST',
      success:function(res){
      }
    })
    wx.showToast({ title: 'TODO:sousuo', icon: 'none' });
  },
  followUser(event) {
    const userId = event.currentTarget.dataset.id
    var id = wx.getStorageSync('id')
    var ids = wx.getStorageSync('attentionId');
    var that = this
    wx.request({
      url:'http://127.0.0.1:8000/user/addAttention/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        hostId: id,
        customerId: userId
      },
      method:'POST',
      success:function(res){
        var newList = that.data.userList
        newList = newList.map(function(u) {
          if (u.id === userId) {
            u.followed = true;
          }
          return u;
        });
        that.setData({
          userList:newList
        })
        ids.push(userId)
        wx.setStorageSync('attentionId', ids)
      }
    })
  },

  unfollowUser(event) {
    const userId = event.currentTarget.dataset.id
    var id = wx.getStorageSync('id')
    var ids = wx.getStorageSync('attentionId');
    var that = this
    wx.request({
      url:'http://127.0.0.1:8000/user/delAttention/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        hostId: id,
        customerId: userId
      },
      method:'POST',
      success:function(res){
        var newList = that.data.userList
        newList = newList.map(function(u) {
          if (u.id === userId) {
            u.followed = false;
          }
          return u;
        });
        that.setData({
          userList:newList
        })
        ids = ids.filter(function(value) {
          return value != userId;
        })
        wx.setStorageSync('attentionId', ids)
      }
    })
    
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
    var ids = wx.getStorageSync('fansId');
    var id = wx.getStorageSync('id')
    //console.log(ids.length)
    var that = this
    for(let i = 0; i < ids.length; i++){
      var j = 0
      wx.request({
        url:'http://127.0.0.1:8000/user/getDetail/',
        data:{
          'hostId': id,
          'customerId':ids[i]
        },
        method:'GET',
        success:function(res){
          var data = JSON.parse(res.data)
          var followed = true;
          if(data.following_state == "true"){
            followed = true
          }
          if(data.following_state == "false"){
            followed = false
          }
          var user = {
            id: ids[i],
            nickName: data.nickName,
            avatar: data.avatarUrl,
            followed: followed,
            signature: data.signature
          }
          that.data.userList.push(user)
          if(j == ids.length - 1){
            that.setData({
              userList: that.data.userList
            })
          }
          j++
        }
      })
    }
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