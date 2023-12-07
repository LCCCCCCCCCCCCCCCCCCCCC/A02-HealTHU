// pages/attention/attention.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: []
  },

  onClickRight() {
    console.log(this.data.userList)
    wx.showToast({ title: 'TODO:sousuo', icon: 'none' });
  },
// 粉丝界面处理程序，取消关注+回关操作实现需修改一下
  // followUser(event) {
  //   var fans = wx.getStorageSync('fans');
  //   const userId = event.currentTarget.dataset.id;
  //   var user = fans.find(function(u) {
  //     return u.id === userId;
  //   });
  //   console.log(user);
  //   if (user) {
  //     user.followed = true;
  //     wx.setStorage({
  //       key: 'fans',
  //       data: fans,
  //       success: function(res) {
  //       }
  //     });
  //     var attention = wx.getStorageSync('attention');
  //     attention.push(user);
  //     console.log(user);
  //     wx.setStorage({
  //       key: 'attention',
  //       data: attention,
  //       success: function(res) {
  //       // TODO:调用后端接口发送关注请求,并更新对应用户项的状态
  //       }
  //     });
  //   } 

  //   console.log('关注用户', userId);
  //   wx.showToast({ title: '关注成功', icon: 'success' });
  // },
  
  unfollowUser(event) {
    // TODO：在关注界面加一个取消关注确认比较好(现在是取关后刷新界面消失，暂无回关操作)
    // 如果关注的人也在粉丝列表，需要更新粉丝列表
    var fans = wx.getStorageSync('fans');
    const userId = event.currentTarget.dataset.id;
    var user = fans.find(function(u) {
      return u.id === userId;
    });
    console.log(user)
    if (user) {
      user.followed = false;
      wx.setStorage({
        key: 'fans',
        data: fans,
        success: function(res) {
        }
      });
    } 

    // 本地attention删人
    var attention = wx.getStorageSync('attention');
    var updatedAttention = attention.filter(function(u) {
      return u.id !== userId;
    });
    wx.setStorage({
      key: 'attention',
      data: updatedAttention,
      success: function(res) {
      // TODO:调用后端接口发送取消关注请求,并更新对应用户项的状态
      }
    });
    console.log('取消关注', userId);
    wx.showToast({ title: '已取消关注', icon: 'success' });

    this.setData({
      userList: attention
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
    var ids = wx.getStorageSync('attentionId');
    var id = wx.getStorageSync('id')
    //console.log(ids.length)
    var that = this
    for(let i = 0; i < ids.length; i++){
      wx.request({
        url:'http://127.0.0.1:8000/user/getDetail/',
        data:{
          'hostId': id,
          'customerId':ids[i]
        },
        method:'GET',
        success:function(res){
          var data = JSON.parse(res.data)
          var user = {
            id: ids[i],
            nickName: data.nickName,
            avatar: data.avatarUrl,
            followed: data.following_state,
            signature: data.signature
          }
          that.data.userList.push(user)
          if(i == ids[i] - 1){
            that.setData({
              userList: that.data.userList
            })
          }
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