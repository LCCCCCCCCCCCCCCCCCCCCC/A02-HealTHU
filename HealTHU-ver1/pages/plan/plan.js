// pages/plan/plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
    todos:[
    ],
    title:"",
    start:"",
    end:"",
    show: false,
    showact: false,
    showddl: false,
    showedit: false,
    nowId: 0,
    nowtype: "",
    radio: "运动",
  },
  //选择添加事务类型后点击确定
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
  //以下三个为设置任务信息
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
  //确定添加普通活动
  handleAct() {
    var newtodos = this.data.todos;
    newtodos.push({
      title:this.data.title,
      type:"活动",
      color:"#0000FF",
      start:this.data.start,
      end:this.data.end
    })
    newtodos.sort(function(a, b) {
      var startTimeA = parseInt(a.start.replace(":", ""));
      var startTimeB = parseInt(b.start.replace(":", ""));
      return startTimeA - startTimeB;
    });
    this.setData({
      todos:newtodos,
      showact: false
    });
    wx.setStorageSync('todos', this.data.todos);
  },
  //跳转到发起活动页面
  addAct(){
    wx.navigateTo({
      url: '../activities/activities'
    })
  },
  //确定添加ddl
  handleDDL() {
    var newtodos = this.data.todos;
    newtodos.push({
      title:this.data.title,
      type:"ddl",
      color:"#009999",
      start:this.data.start,
      end:this.data.start
    });
    newtodos.sort(function(a, b) {
      var startTimeA = parseInt(a.start.replace(":", ""));
      var startTimeB = parseInt(b.start.replace(":", ""));
      return startTimeA - startTimeB;
    });
    this.setData({
      todos:newtodos,
      showddl: false
    });
    wx.setStorageSync('todos', this.data.todos);
  },
  //上端获取前/后一天日期
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
  //跳转到睡眠管理
  tosleep(){
    wx.navigateTo({
      url: '../sleep/sleep',
    })
  },
  //跳转到饮食管理
  toeat(){
    wx.navigateTo({
      url: '../eat/eat',
    })
  },
  //展示弹窗页面
  showPopup() {
    this.setData({ show: true });
  },
  //选择事务类型
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  //关闭弹窗页面
  onClose() {
    this.setData({ show: false });
  },
  handleEdit(event) {
    const buttonId = event.currentTarget.dataset.id;
    var newtodo = this.data.todos[buttonId];
    this.setData({ 
      showedit: true,
      title: newtodo.title,
      start: newtodo.start,
      end: newtodo.end,
      nowId: buttonId,
      nowtype: newtodo.type
     });
  },
  //编辑事务
  editAct(){
    var newtodos = this.data.todos;
    newtodos[this.data.nowId] = {
      title:this.data.title,
      type:this.data.nowtype,
      color:this.switchColorbyType(this.data.nowtype),
      start:this.data.start,
      end:this.data.end
    }
    newtodos.sort(function(a, b) {
      var startTimeA = parseInt(a.start.replace(":", ""));
      var startTimeB = parseInt(b.start.replace(":", ""));
      return startTimeA - startTimeB;
    });
    this.setData({
      todos:newtodos,
      showedit: false
    });
    wx.setStorageSync('todos', this.data.todos);
  },
  //删除事务
  deleteAct(){
    var newtodos = this.data.todos;
    newtodos.splice(this.data.nowId,1);
    newtodos.sort(function(a, b) {
      var startTimeA = parseInt(a.start.replace(":", ""));
      var startTimeB = parseInt(b.start.replace(":", ""));
      return startTimeA - startTimeB;
    });
    this.setData({
      todos:newtodos,
      showedit: false
    })
    wx.setStorageSync('todos', this.data.todos);
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
    var data = wx.getStorageSync('todos');
    this.setData({
      todos: data
    });
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

  },
  switchColorbyType(type){
    switch(type){
      case "课程":
        return "#BBBB00";
      case "运动":
        return "#00BB00";
      case "活动":
        return "#0000FF";
      case "ddl":
        return "#009999";
      case "饮食":
        return "#BB00BB";
    }
  }
})