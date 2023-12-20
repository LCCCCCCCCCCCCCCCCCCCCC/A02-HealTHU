// pages/addactivity/editactivity/editactivity.js
Page({
  data: {
    deleteshow: false,
    actId:0,
    selfid: 3,
    date: "",
    dateshow: false,
    start: "",
    end: "",
    minNum: 0,
    maxNum: 1,
    title:"测试活动主题",
    label: "", //活动简介
    detail: "活动介绍文字", //活动介绍
    tagtext: "",
    tags: ["测试1", "测试2"],
    showpicker: false,
    fileList: [],
    images:[],
    todos: []
  },

  editAct(){
    var that = this
    wx.request({
      url:'http://127.0.0.1:8000/schedule/changeAct/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        actId: that.data.actId,
        newTitle: that.data.title,
        newPartNumMin: that.data.minNum,
        newPartNumMax: that.data.maxNum,
        newLabel: that.data.label,
        newDetail: that.data.detail,
        newImages:`${JSON.stringify(that.data.images)}`,
        newTags:`${JSON.stringify(that.data.tags)}`
      },
      method:'POST',
      success:function(res){
        console.log(res)
        wx.showToast({ title: '修改成功', icon: 'success' });
      }
    })
  },
  afterRead(event){

  },
  deleteConfirm() {
    var that = this
    wx.request({
      url:'http://127.0.0.1:8000/schedule/deleteAct/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        actId:that.data.actId
      },
      method:'POST',
      success:function(res){
        wx.navigateBack({delta:1})
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    if(options.actid){
      this.setData({ actId: options.actid });
    }
    wx.request({
      url:'http://127.0.0.1:8000/schedule/getActDetail/',
      data:{
        'actId': that.data.actId
      },
      method:'GET',
      success:function(res){
        var data = res.data
        that.setData({
          title:data.title,
          label:data.label,
          minNum:data.partNumMin,
          maxNum:data.partNumMax,
          tags:data.tags,
          date:data.date,
          start:data.start,
          end:data.end,
          images:data.images
        })
      }
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
  onClickLeft() {
    wx.navigateBack({delta:1});
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
  handleMin(event) {
    this.setData({
      minNum: event.detail
    });
    if (this.data.minNum > this.data.maxNum){
      const changenum = this.data.minNum;
      this.setData({ maxNum: changenum});
    }
    console.log(this.data.minNum, this.data.maxNum);
  },
  handleMax(event) {
    this.setData({
      maxNum: event.detail
    });
  },
  handleTagInput(event) {
    this.setData({
      tagtext: event.detail
    });
  },
  tagAdd() {
    const tags = this.data.tags.concat(this.data.tagtext);
    this.setData({
      tags: tags,
      tagtext: ''
    });
  },
  ontagClose(event) {
    const tags = this.data.tags;
    tags.splice(event.currentTarget.dataset.index, 1); 
    this.setData({tags: tags});
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
  handleDelete() {
    this.setData({ deleteshow: true });
  },
  deleteClose() {
    this.setData({ deleteshow: false });
  }
})