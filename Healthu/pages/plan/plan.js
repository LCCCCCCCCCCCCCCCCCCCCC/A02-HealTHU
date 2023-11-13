// pages/plan/plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
    todos:[
      { title: "任务1", type:"课程", color:"#BBBB00", start:"7:00", end:"7:30"},
      { title: "任务2", type:"运动", color:"#00BB00", start:"8:00", end:"8:30"},
      { title: "任务3", type:"活动", color:"#0000FF", start:"9:00", end:"9:30"},
      { title: "任务4", type:"ddl", color:"#009999", start:"10:00", end:"10:30"},
      { title: "任务5", type:"饮食", color:"#BB00BB", start:"11:00", end:"11:30"}
    ],
    title:"",
    start:"",
    end:"",
    show: false,
    showact: false,
    showddl: false,
    radio: "运动",
  },
  determine(){
    switch(this.data.radio){
      case "运动":
        wx.navigateTo({
          url: '../sports/sports'
        })
        break;
      case "活动":
        this.setData({ showact: true });
        break;
      case "ddl":
        this.setData({ showddl: true });
        break;
      case "饮食":
        this.setData({ showfood: true });
        break;
    }
    this.setData({ show: false });
  },
  handleNameInput(event) {
    this.setData({
      title: event.detail.value
    });
  },
  handleStartTimeInput(event) {
    this.setData({
      start: event.detail.value
    });
  },
  handleEndTimeInput(event) {
    this.setData({
      end: event.detail.value
    });
  },
  handleAct() {
    var newtodos = this.data.todos;
    newtodos.push({
      title:this.data.title,
      type:"活动",
      color:"#0000FF",
      start:this.data.start,
      end:this.data.end
    })
    this.setData({
      todos:newtodos,
      showact: false
    })
  },
  addAct(){
    wx.navigateTo({
      url: '../activities/activities'
    })
  },
  handleDDL() {
    var newtodos = this.data.todos;
    newtodos.push({
      title:this.data.title,
      type:"ddl",
      color:"#009999",
      start:this.data.start,
      end:this.data.start
    })
    this.setData({
      todos:newtodos,
      showddl: false
    })
  },
  subDate() {
    // 获取当前日期
    var date = this.data.date;
    var currentDate = date.split("-");
    var year = parseInt(currentDate[0]);
    var month = parseInt(currentDate[1]);
    var day = parseInt(currentDate[2]);
    // 构建新的日期字符串，假设你想向后切换一天
    var newDate = new Date(year, month - 1, day - 1);
    var newYear = newDate.getFullYear();
    var newMonth = newDate.getMonth() + 1;
    var newDay = newDate.getDate();
    var dateString = newYear + '-' + newMonth + '-' + newDay;
    // 页面跳转并传递新的日期参数
    console.log(dateString);
    wx.redirectTo({
      url: '../plan/plan?date=' + dateString,
    })
  },
  addDate() {
    // 获取当前日期
    var date = this.data.date;
    var currentDate = date.split("-");
    var year = parseInt(currentDate[0]);
    var month = parseInt(currentDate[1]);
    var day = parseInt(currentDate[2]);
    // 构建新的日期字符串，假设你想向后切换一天
    var newDate = new Date(year, month - 1, day + 1);
    var newYear = newDate.getFullYear();
    var newMonth = newDate.getMonth() + 1;
    var newDay = newDate.getDate();
    var dateString = newYear + '-' + newMonth + '-' + newDay;
    // 页面跳转并传递新的日期参数
    console.log(dateString);
    wx.redirectTo({
      url: '../plan/plan?date=' + dateString,
    })
  },
  showPopup() {
    this.setData({ show: true });
  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  onClose() {
    this.setData({ show: false });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.date) {
      // 如果传递了日期参数，则使用传递的日期
      this.setData({
        date: options.date
      });
    } 
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