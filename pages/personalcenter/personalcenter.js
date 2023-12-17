// pages/personalCenter/personalcenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    //初始为默认值
    userInfo: {
      avatarUrl: '',
      nickName: '默认用户',
      id:0
    },
    wxcode:"",
  },
  sign(){
    const that = this;
    // 获取用户的当前设置，判断是否点击了“总是保持以上，不在询问”
    wx.getSetting({
      withSubscriptions: true, // 是否获取用户订阅消息的订阅状态，默认false不返回
      success(res) {
        console.log('res.authSetting', res.authSetting)
        if (res.authSetting['scope.subscribeMessage']) {
          console.log('用户点击了“总是保持以上，不再询问”')

        } else {
          console.log('用户没有点击“总是保持以上，不再询问”则每次都会调起订阅消息')
          that.authorizationBtn();
        }
      }
    })
    wx.login({
      success: (res) => {
            if(res.code){
              wx.request({
                url:'http://127.0.0.1:8000/user/getId/',
                data:{
                  'code':res.code
                },
                method:'GET',
                success:function(res){
                  wx.setStorageSync('id', res.data);
                  wx.navigateTo({
                    url: '../mainpage/mainpage'
                  })
                }
              })
          }
      },
    })
  },
  
  onChooseAvatar(e){
    console.log(e.detail.avatarUrl);
    this.setData({'userInfo.avatarUrl': e.detail.avatarUrl})
  },
  onChooseNickname(e){
    console.log(e);
    this.setData({'userInfo.nickName': e.detail.value})
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
    
  },
  authorizationBtn() {
    wx.requestSubscribeMessage({
      tmplIds: ['fHPE-sivPSATvWyAsqHrlIFKo6-6NN20DmVxFx8q4I8'],
      success(res) {
        console.log('授权成功')
      }
    })
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