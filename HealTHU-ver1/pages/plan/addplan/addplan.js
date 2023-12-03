// pages/plan/addplan/addplan.js
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
    //把todos里的值改为该天的todos
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

  //确定添加普通活动
  handleAct() {
    var newtodos = this.data.todos;
    if(this.isValid(this.data.start,this.data.end,this.data.todos)){
      newtodos.push({
        title:this.data.title,
        type:"活动",
        color:"#0000FF",
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
        todos:newtodos,//添加日期标记
        isValid:true
      });
      wx.setStorageSync('todos', this.data.todos);
    }
  },
  //确定添加ddl
  handleDDL() {
    var newtodos = this.data.todos;
    if(this.isValid(this.data.end,this.data.end,this.data.todos)){
      newtodos.push({
        title:this.data.title,
        type:"ddl",
        color:"#009999",
        start:this.data.end,
        end:this.data.end,
        label:this.data.label
      });
      newtodos.sort(function(a, b) {
        var startTimeA = parseInt(a.start.replace(":", ""));
        var startTimeB = parseInt(b.start.replace(":", ""));
        return startTimeA - startTimeB;
      });
      this.setData({
        todos:newtodos,
        isValid:true
      });
      wx.setStorageSync('todos', this.data.todos);
    }
  },
  HandleCourse(){
    var newtodos = this.data.todos;
    if(this.isValid(this.data.start,this.data.start,this.data.todos)){
      newtodos.push({
        title:this.data.title,
        type:"课程",
        color:"#BBBB00",
        start:this.data.start,
        end:this.data.end,
        label:this.data.label
      });
      newtodos.sort(function(a, b) {
        var startTimeA = parseInt(a.start.replace(":", ""));
        var startTimeB = parseInt(b.start.replace(":", ""));
        return startTimeA - startTimeB;
      });
      this.setData({
        todos:newtodos,
        isValid:true
      });
      wx.setStorageSync('todos', this.data.todos);
    }
  },
  HandleEat(){
    var newtodos = this.data.todos;
    if(this.isValid(this.data.start,this.data.start,this.data.todos)){
      newtodos.push({
        title:this.data.title,
        type:"吃饭",
        color:"#BB00BB",
        start:this.data.start,
        end:this.data.end,
        label:this.data.label
      });
      newtodos.sort(function(a, b) {
        var startTimeA = parseInt(a.start.replace(":", ""));
        var startTimeB = parseInt(b.start.replace(":", ""));
        return startTimeA - startTimeB;
      });
      this.setData({
        todos:newtodos,
        isValid:true
      });
      wx.setStorageSync('todos', this.data.todos);
    }
  },
  HandleSports(){
    var newtodos = this.data.todos;
    if(this.isValid(this.data.start,this.data.start,this.data.todos)){
      newtodos.push({
        title:this.data.title,
        type:"健身",
        color:"#00BB00",
        start:this.data.start,
        end:this.data.end,
        label:this.data.label
      });
      newtodos.sort(function(a, b) {
        var startTimeA = parseInt(a.start.replace(":", ""));
        var startTimeB = parseInt(b.start.replace(":", ""));
        return startTimeA - startTimeB;
      });
      this.setData({
        todos:newtodos,
        isValid:true
      });
      wx.setStorageSync('todos', this.data.todos);
    }
  },
  // 添加活动总处理
  onClickRight(){
    switch(this.data.optionvalue1){
      case 0:
        this.handleDDL();break;
      case 1:
        this.HandleCourse();break;
      case 2:
        this.handleAct();break;
      case 3:
        this.HandleSports();break;
      case 4:
        this.HandleEat();break;
      default:
        return;
    }
    if(this.data.isValid){
      wx.showToast({ title: '添加成功', icon: 'success' });
      wx.navigateTo({
        url: '../plan',
      })
    }
    else{
      wx.showToast({ title: '时间不合法', icon: 'success' });
    }
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
  }
})