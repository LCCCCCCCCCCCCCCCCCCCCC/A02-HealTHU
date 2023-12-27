// pages/bindthu/bindthu.js
Page({
  data: {
    isbind:false,
    showbind:false,
    ID:"暂未绑定",
    studentID:"",
    password:"",
    wrongmsg:"学号或密码输入有误"
  },
  bindthu(){
    this.setData({showbind:true})
  },
  unbindthu(){
    this.setData({
      ID:"暂未绑定",
      isbind:false,
      studentID:"",
      password:""
    })
  },
  handleIDInput(event){
    this.setData({ studentID: event.detail });
  },
  handlePasswordInput(event){
    this.setData({ password: event.detail });
  },
  isTenDigitNumber(str) {
    var regex = /^\d{10}$/; // 使用正则表达式 /^\d{10}$/ 来匹配十位数字
    return regex.test(str);
  },
  change(){
    if(this.data.studentID.length === 0 || this.data.password.length === 0){
      this.setData({ 
        showwrong: true,
        wrongmsg: "未输入学号或密码",
      });
    }
    else if (this.isTenDigitNumber(this.data.studentID) == 0){
      this.setData({ 
        showwrong: true,
        wrongmsg: "学号格式不正确",
      });
    }
    else{
      this.setData({
        ID: this.data.studentID,
        showbind:false,
        isbind:true
      });
    }
    console.log(this.data.studentID, this.data.password);
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