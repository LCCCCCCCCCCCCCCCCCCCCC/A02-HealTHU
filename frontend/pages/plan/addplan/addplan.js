// pages/plan/addplan/addplan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    dateshow: false,
    option1: [
      { text: 'ddl', value: 0 },
      { text: '课程', value: 1 },
      { text: '活动', value: 2 },
      { text: '运动', value: 3 },
      { text: '饮食', value: 4 }
    ],
    optionvalue1: 2,
    start: "",
    end: "",
    todos: [],
    title:"",
    label: "",
    type: "",
    showpicker: false,
    isValid:false,
    sportType:0,
    sportState:0
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
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  },
  onConfirm(event) {
    this.setData({
      dateshow: false,
      date: this.formatDate(event.detail),
    });
  },
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
    if(this.isValid(this.data.start,this.data.end,this.data.todos,"活动")){
      this.setData({
        isValid:true,
        type:"活动"
      });
    }
  },
  //确定添加ddl
  handleDDL() {
    if(this.isValid(this.data.end,this.data.end,this.data.todos,"ddl")){
      this.setData({
        isValid:true,
        type:"ddl",
        start:this.data.end
      });
    }
  },
  HandleCourse(){
    if(this.isValid(this.data.start,this.data.end,this.data.todos,"课程")){
      this.setData({
        isValid:true,
        type:"课程"
      });
    }
  },
  HandleEat(){
    if(this.isValid(this.data.start,this.data.end,this.data.todos,"饮食")){
      this.setData({
        isValid:true,
        type:"饮食"
      });
    }
  },
  HandleSports(){
    if(this.isValid(this.data.start,this.data.end,this.data.todos,"运动")){
      this.setData({
        isValid:true,
        type:"运动"
      });
    }
  },
  // 添加活动总处理
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
        switch(that.data.optionvalue1){
          case 0:
            that.handleDDL();break;
          case 1:
            that.HandleCourse();break;
          case 2:
            that.handleAct();break;
          case 3:
            that.HandleSports();break;
          case 4:
            that.HandleEat();break;
          default:
            return;
        }
        if(that.data.isValid){
          var id = wx.getStorageSync('id')
          console.log(id)
          wx.request({
            url:'http://127.0.0.1:8000/schedule/addTodo/',
            header:{ 'content-type': 'application/x-www-form-urlencoded'},
            data:{
              id: id,
              title: that.data.title,
              date: that.data.date,
              start: that.data.start,
              end: that.data.end,
              label: that.data.label,
              type: that.data.type,
              state: 0,
              sportType: that.data.sportType,
              sportState: that.data.sportState,
              //sportStart: "",
              //sportEnd: "",
              readOnly: 0
            },
            method:'POST',
            success:function(res){
              wx.showToast({ title: '添加成功', icon: 'success' });
              that.setData({
              isValid:false
              })
              wx.navigateBack({delta:1})
            }
          })
        }
        else{
          wx.showToast({ title: '时间不合法', icon: 'success' });
        }
      }
    })
  },
  onClickLeft(){
    wx.navigateBack({delta:1})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      start:parseInt(new Date().getHours()).toString().padStart(2, '0') + ":" + parseInt(new Date().getMinutes()).toString().padStart(2, '0'),
      end:parseInt(new Date().getHours()).toString().padStart(2, '0') + ":" + parseInt(new Date().getMinutes()).toString().padStart(2, '0'),
      date: new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0'),
    })
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
    //var data = wx.getStorageSync('todos');
    //this.setData({
      //todos: data
    //});
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

  isValid(start,end,todos,type){
    var nowTime = new Date().getHours() + ":" + (new Date().getMinutes()).toString().padStart(2, '0')
    nowTime = parseInt(nowTime.replace(":",""))
    var date = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0'),
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
  }
})