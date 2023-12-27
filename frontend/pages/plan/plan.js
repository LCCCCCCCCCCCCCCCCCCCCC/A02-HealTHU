
// pages/plan/plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchColorbyType: {
        "课程": "#BBBB00",
        "运动": "#00BB00",
        "活动": "#0000FF",
        "ddl":  "#009999",
        "饮食": "#BB00BB"
    },
    dateshow: false,
    date: new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0'),
    todos:[
    ],
    title:"",
    start:"",
    end:"",
    label:"",
    showedit: false,
    showpicker: false,
    nowId: 0,
    nowtype: "",
    minDate: new Date(2023, 10, 1).getTime(),
    maxDate: new Date(2024, 0, 31).getTime(),
  },
  showPicker1(){
    this.setData({
      showpicker:1
    });
  },
  showPicker2(){
    this.setData({
      showpicker:2
    });
  },
  closePicker(){
    this.setData({
      showpicker:false
    });
  },
  //上端获取前/后一天日期
  subDate() {
    // 获取当前日期
    var date = this.data.date;
    var currentDate = date.split("/");
    var year = parseInt(currentDate[0]);
    var month = parseInt(currentDate[1]);
    var day = parseInt(currentDate[2]);
    // 构建新的日期字符串，假设你想向后切换一天
    var newDate = new Date(year, month - 1, day - 1);
    var newYear = newDate.getFullYear();
    var newMonth = (newDate.getMonth() + 1).toString().padStart(2, '0');
    var newDay = newDate.getDate().toString().padStart(2, '0');
    var dateString = newYear + '/' + newMonth + '/' + newDay;
    // 页面跳转并传递新的日期参数
    wx.redirectTo({
      url: '../plan/plan?date=' + dateString,
    })
  },
  addDate() {
    // 获取当前日期
    var date = this.data.date;
    var currentDate = date.split("/");
    var year = parseInt(currentDate[0]);
    var month = parseInt(currentDate[1]);
    var day = parseInt(currentDate[2]);
    // 构建新的日期字符串，假设你想向后切换一天
    var newDate = new Date(year, month - 1, day + 1);
    var newYear = newDate.getFullYear();
    var newMonth = (newDate.getMonth() + 1).toString().padStart(2, '0');
    var newDay = newDate.getDate().toString().padStart(2, '0');
    var dateString = newYear + '/' + newMonth + '/' + newDay;
    // 页面跳转并传递新的日期参数
    console.log(dateString);
    wx.redirectTo({
      url: '../plan/plan?date=' + dateString,
    })
  },

  tohandleEdit(event) {
    var urldate = this.data.date;
    const buttonId = event.currentTarget.dataset.id;
    var nowTime = new Date().getHours() + ":" + (new Date().getMinutes()).toString().padStart(2, '0')
    nowTime = parseInt(nowTime.replace(":",""))
    var date = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0')
    var start = parseInt(this.data.todos[buttonId].start.replace(":", ""))
    var end = parseInt(this.data.todos[buttonId].end.replace(":", ""))
    if((date > this.data.date)||((date == this.data.date)&&(end<nowTime))){
      this.data.todos[buttonId].readOnly = 1
    }
    if((date == this.data.date)&&((start<=nowTime)&&(end>=nowTime))&&(this.data.todos[buttonId].state == 2)){
      var id = wx.getStorageSync('id')
      var that = this
      wx.showToast({ title: '事项进行中', icon: 'success' });
      wx.request({
        url:'http://127.0.0.1:8000/schedule/doTodo/',
        header:{ 'content-type': 'application/x-www-form-urlencoded'},
        data:{
          id: id,
          title: that.data.todos[buttonId].title,
          date: that.data.todos[buttonId].date,
          start: that.data.todos[buttonId].start,
          end: that.data.todos[buttonId].end,
        },
        method:'POST',
        success:function(res){
          wx.showToast({ title: '事项已完成', icon: 'success' });
          that.onShow()//刷新页面
        }
      })
    }
    else{
      wx.setStorageSync('oldTodo', this.data.todos[buttonId])
      wx.navigateTo({
        url: './editplan/editplan?id=' + buttonId + '&date=' + urldate + '&readOnly=' + this.data.todos[buttonId].readOnly
      })
    }
    //事项状态参考API文档，可以根据事项状态设置一下不同的显示样式
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
    var that = this
    var id = wx.getStorageSync('id')
    wx.request({
      url:'http://127.0.0.1:8000/schedule/todos/',
      data:{
        'id': id,
        'date': that.data.date
      },
      method:'GET',
      success:function(res){
        var data = res.data
        data.sort(function(a, b) {
          var startTimeA = parseInt(a.start.replace(":", ""));
          var startTimeB = parseInt(b.start.replace(":", ""));
          return startTimeA - startTimeB;
        });
        var nowTime = new Date().getHours() + ":" + (new Date().getMinutes()).toString().padStart(2, '0')
        nowTime = parseInt(nowTime.replace(":",""))
        var date = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0')
        for(var i = 0;i<data.length;i++){
          var start = parseInt(data[i].start.replace(":", ""))
          var end = parseInt(data[i].end.replace(":", ""))
          if((date == that.data.date)&&((start<=nowTime)&&(end>=nowTime)&&(data[i].state == 0))){
            data[i].state = 2
          }
        }
        that.setData({
          todos: data
        });
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

  },

  // 通过日历选择日期
  onDisplay() {
    this.setData({ dateshow: true });
  },
  onClose() {
    this.setData({ dateshow: false });
  },
  formatDate(date) {
    var newDate = new Date(date);
    var newYear = newDate.getFullYear();
    var newMonth = (newDate.getMonth() + 1).toString().padStart(2, '0');
    var newDay = newDate.getDate().toString().padStart(2, '0');
    var dateString = newYear + '/' + newMonth + '/' + newDay;
    console.log(dateString)
    return dateString;
  },
  onConfirm(event) {
    this.setData({
      dateshow: false,
    });
    var dateString = this.formatDate(event.detail);
    wx.redirectTo({
      url: '../plan/plan?date=' + dateString
    })
  },
})