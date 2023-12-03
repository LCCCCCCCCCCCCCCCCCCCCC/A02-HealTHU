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
    wx.login({
      success: (res) => {
            if(res.code){
              wx.request({
                url:'http://127.0.0.1:8000/user/index',
                data:{
                  'code':res.code
                },
                method:'GET',
                success:function(res){
                  console.log(res.data)
                }
              })
          }
      },
    })
    this.setData({ show: true });
    wx.setStorageSync('avatarUrl', this.data.userInfo.avatarUrl);
    wx.setStorageSync('nickName', this.data.userInfo.nickName);
    wx.setStorageSync('id', this.data.userInfo.id);
    wx.setStorageSync('sign', "尚未设置");
    wx.setStorageSync('todos', [
      { title: "任务1", type:"课程", color:"#BBBB00", start:"09:00", end:"09:30", label:"1"},
      { title: "任务2", type:"运动", color:"#00BB00", start:"12:00", end:"14:30", label:"不同颜色对应活动类型"},
      { title: "任务3", type:"活动", color:"#0000FF", start:"15:00", end:"15:30", label:"修改为序号或类型logo"},
      { title: "任务4", type:"ddl", color:"#009999", start:"16:00", end:"16:30", label:"其他样式设计（填充？）"},
      { title: "任务5", type:"饮食", color:"#BB00BB", start:"20:00", end:"23:30", label:"5"}
    ]);
    wx.setStorageSync('fans',[
      {
        id: '1',
        nickname: 'testuser1',
        avatar: '../images/avatar1.png',
        signature: '签名1',
        followed: true
      },
      {
        id: '2',
        nickname: 'testuser2',
        avatar: '../images/avatar2.png',
        signature: '签名2',
        followed: true
      },
      {
        id: '3',
        nickname: 'testuser3',
        avatar: '../images/avatar3.png',
        signature: '签名3',
        followed: false
      },
    ]);
    wx.setStorageSync('attention', [
      {
        id: '1',
        nickname: 'testuser1',
        avatar: '../images/avatar1.png',
        signature: '签名1',
        followed: true
      },
      {
        id: '2',
        nickname: 'testuser2',
        avatar: '../images/avatar2.png',
        signature: '签名2',
        followed: true
      },
    ])
    wx.navigateTo({
      url: '../mainpage/mainpage'
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