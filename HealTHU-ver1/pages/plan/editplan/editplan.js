// pages/plan/editplan/editplan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowtime: new Date().getHours() + ":" + new Date().getMinutes(),
    date: new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate(),
    dateshow: false,
    option1: [
      { text: 'ddl', value: 0 },
      { text: '课程', value: 1 },
      { text: '活动', value: 2 },
      { text: '健身', value: 3 },
      { text: '吃饭', value: 4 }
    ],
    optionvalue1: 0,
    start: "",
    end: "",
    todos: [],
    title:"",
    label:"",
    showpicker: false,
    nowId: 0,
    nowtype: "",
    isValid:false
  },
  onClickLeft(){
    wx.navigateTo({
      url: '../plan'
    })
  },
  onTypeConfirm(event){
    this.setData({ optionvalue1: event.detail});
  },
  // 以下四个日期选择(默认当天)
  onDisplay() {
    this.setData({ dateshow: true });
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

  // 添加编辑完的活动
  onClickRight(){
    var newType = this.switchTypebyValue(this.data.optionvalue1);
    var newtodos = this.data.todos;
    newtodos.splice(this.data.nowId,1);
    if(!this.isValid(this.data.start,this.data.end,newtodos)){
      newtodos = this.data.todos;
    }
    else{
      newtodos.push({
        title:this.data.title,
        type:newType,
        color:this.switchColorbyType(newType),
        start:this.data.start,
        end:this.data.end,
        label:this.data.label
      })
      newtodos.sort(function(a, b) {
        var startTimeA = parseInt(a.start.replace(":", ""));
        var startTimeB = parseInt(b.start.replace(":", ""));
        return startTimeA - startTimeB;
      });
      this.setData({
        todos:newtodos,
      });
      wx.setStorageSync('todos', this.data.todos);
    }

    wx.showToast({ title: '修改成功', icon: 'success' });
    wx.navigateTo({
      url: '../plan',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    if (options.id && options.date) {
      // 通过日期和点击id传递到编辑界面
      this.setData({
        nowId: options.id,
        date: options.date
      });
    } 
    var data = wx.getStorageSync('todos');
    this.setData({
      todos: data
    });
    var newtodo = this.data.todos[options.id];
    var typeValue = this.switchValuebyType(newtodo.type);
    this.setData({ 
      title: newtodo.title,
      start: newtodo.start,
      end: newtodo.end,
      nowtype: newtodo.type,
      label: newtodo.label,
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
  isValid(start,end,todos){
    start = parseInt(start.replace(":", ""))
    end = parseInt(end.replace(":", ""))
    if(start>end){
      return false;
    }
    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i];
      let thestart = parseInt(todo.start.replace(":", ""))
      let theend = parseInt(todo.end.replace(":", ""))
      if (!((start <= thestart && end <= thestart) || (end >= theend && start >= theend))) {
        return false; // 与某一项有重叠，不合法
      }
    }
    return true; // 没有重叠，合法
  },
  //删除事务，TODO：加个确认删除
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
    })
    wx.setStorageSync('todos', this.data.todos);

    wx.showToast({ title: '删除成功', icon: 'success' });
    wx.navigateTo({
      url: '../plan',
    })
  },
})