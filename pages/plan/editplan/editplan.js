// pages/plan/editplan/editplan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate(),
    dateshow: false,
    option1: [
      { text: 'ddl', value: 0 },
      { text: '课程', value: 1 },
      { text: '活动', value: 2 },
      { text: '运动', value: 3 },
      { text: '饮食', value: 4 }
    ],
    oldTodo:{},
    optionvalue1: 0,
    start: "",
    end: "",
    todos: [],
    title:"",
    label:"",
    showpicker: false,
    nowId: 0,
    nowtype: "",
    isValid:false,
    readOnly:0,
    Title:"编辑日程"
  },
  onClickLeft(){
    wx.navigateBack({delta:1})
  },
  onTypeConfirm(event){
    this.setData({ optionvalue1: event.detail});
  },
  // 以下四个日期选择(默认当天)
  onDisplay() {
    if(!this.data.readOnly){
      this.setData({ dateshow: true });
    }
  },
  onClose() {
    this.setData({ dateshow: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    //TODO：把todos里的值改为该天的todos
  },
  onConfirm(event) {
    this.setData({
      dateshow: false,
      date: this.formatDate(event.detail),
    });
    console.log(this.data.date)
  },
  //以下三个为设置任务信息
  handleNameInput(event) {
    this.setData({
      title: event.detail
    });
  },
  handleLabelInput(event) {
    this.setData({
      label: event.detail
    });
  },
  handleStartTimeInput(event) {
    this.setData({
      start: event.detail,
      showpicker:false
    });
  },
  handleEndTimeInput(event) {
    this.setData({
      end: event.detail,
      showpicker:false
    });
  },
  showPicker1(){
    if(!this.data.readOnly){
      this.setData({
        showpicker:1
      });
    }
  },
  showPicker2(){
    if(!this.data.readOnly){
      this.setData({
        showpicker:2
      });
    }
  },
  closePicker(){
    this.setData({
      showpicker:false
    });
  },

  // 添加编辑完的活动
  onClickRight(){
    var that = this
    var id = wx.getStorageSync('id')
    if(this.data.title == ""){
      wx.showToast({
        title: '主题不可为空',
      })
      return;
    }
    wx.request({
      url:'http://127.0.0.1:8000/schedule/todos/',
      data:{
        'id': id,
        'date': that.data.date
      },
      method:'GET',
      success:function(res){
        var data = res.data
        that.setData({
          todos: data
        });
        let newType = that.switchTypebyValue(that.data.optionvalue1);
        var newtodos = that.data.todos;
        if(that.data.date == that.data.oldTodo.date){
          newtodos.splice(that.data.nowId,1);
        }
        if(newType == "ddl"){
          that.setData({
            start:that.data.end
          })
        }
        if(!that.isValid(that.data.start,that.data.end,newtodos,newType)){
          wx.showToast({ title: '时间不合法', icon: 'success' });
        }
        else{
          var id = wx.getStorageSync('id')
          wx.request({
            url:'http://127.0.0.1:8000/schedule/changeTodo/',
            header:{ 'content-type': 'application/x-www-form-urlencoded'},
            data:{
              id: id,
              oldDate: that.data.oldTodo.date,
              oldStart: that.data.oldTodo.start,
              oldEnd: that.data.oldTodo.end,
              oldTitle: that.data.oldTodo.title,
              newTitle: that.data.title,
              newDate: that.data.date,
              newStart: that.data.start,
              newEnd: that.data.end,
              newLabel: that.data.label,
              newType: newType,
              newState: that.data.oldTodo.state,
              newSportType: that.data.oldTodo.sportType,
              newSportState: that.data.oldTodo.sportState
            },
            method:'POST',
            success:function(res){
              wx.showToast({ title: '修改成功', icon: 'success' });
              wx.navigateBack({delta:1})
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id && options.date && options.readOnly) {
      // 通过日期和点击id传递到编辑界面
      var readOnly = 1
      if(options.readOnly == 0){
        readOnly = 0
      }
      else{
        this.setData({
          Title:"查看日程"
        })
      }
      this.setData({
        nowId: options.id,
        date: options.date,
        readOnly: readOnly
      });
    } 
    var oldTodo = wx.getStorageSync('oldTodo')
    var typeValue = this.switchValuebyType(oldTodo.type);
    this.setData({ 
      oldTodo: oldTodo,
      title: oldTodo.title,
      start: oldTodo.start,
      end: oldTodo.end,
      nowtype: oldTodo.type,
      label: oldTodo.label,
      optionvalue1: typeValue
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
  },
  switchValuebyType(type){
    switch(type){
      case "ddl":
        return 0;
      case "课程":
        return 1;
      case "活动":
        return 2;        
      case "运动":
        return 3;
      case "饮食":
        return 4;
    }
  },
  switchTypebyValue(value){
    switch(value){
      case 0:
        return "ddl";
      case 1:
        return "课程";
      case 2:
        return "活动";        
      case 3:
        return "运动";
      case 4:
        return "饮食";
    }
  },
  isValid(start,end,todos,type){
    var nowTime = new Date().getHours() + ":" + (new Date().getMinutes()).toString().padStart(2, '0')
    nowTime = parseInt(nowTime.replace(":",""))
    var date = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate(),
    start = parseInt(start.replace(":", ""))
    end = parseInt(end.replace(":", ""))
    if(start>end){
      return false;
    }
    if((date == this.data.date)&&((start<=nowTime)||(end<=nowTime))){
      return false;
    }
    if(type != "ddl"){
      for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];
        let thestart = parseInt(todo.start.replace(":", ""))
        let theend = parseInt(todo.end.replace(":", ""))
        if (!((start <= thestart && end <= thestart) || (end >= theend && start >= theend))) {
          return false; // 与某一项有重叠，不合法
        }
      }
    }
    return true; // 没有重叠，合法
  },
  //删除事务，TODO：加个确认删除
  deleteAct(){
    var id = wx.getStorageSync('id')
    var that = this
    wx.request({
      url:'http://127.0.0.1:8000/schedule/deleteTodo/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id: id,
        oldDate: that.data.oldTodo.date,
        oldStart: that.data.oldTodo.start,
        oldEnd: that.data.oldTodo.end,
        oldTitle: that.data.oldTodo.title
      },
      method:'POST',
      success:function(res){
        wx.showToast({ title: '删除成功', icon: 'success' });
        wx.navigateBack({delta:1})
      }
    })
  },
})