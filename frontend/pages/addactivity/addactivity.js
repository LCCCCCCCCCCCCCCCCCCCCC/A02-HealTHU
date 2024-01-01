// pages/addactivity/addactivity.js
Page({
  data: {
    selfid: 3,
    date: "",
    dateshow: false,
    start: "",
    end: "",
    minNum: 0,
    maxNum: 1,
    title:"",
    label: "", //活动简介
    detail: "", //活动介绍
    tagtext: "",
    tags: [],
    showpicker: false,
    fileList: [],
    images:[],
    todos: []
  },

   //示例的上传图片到服务器并显示在界面
  afterRead(event) {
    const { file } = event.detail;
    var that = this
    var id = wx.getStorageSync('id')
     wx.uploadFile({
       url: 'http://127.0.0.1:8000/user/postImage/',
       filePath: file[0].url,
       name: 'image',
       formData: { id: id },
       header:{ 'content-type': 'application/x-www-form-urlencoded'},
       method:"POST",
       success(res) {
         // 上传完成需要更新 fileList
         var data = res.data.split('/')
         const { fileList = [] } = that.data;
         fileList.push({ ...file, url: 'http://127.0.0.1:8000/media/' + data[1] });
         //fileList.push({ ...file, url: file[0].url });
         var images = that.data.images
         images.push('http://127.0.0.1:8000/media/' + data[1])
         that.setData({ fileList });
         that.setData({
           images:images
         })
         console.log(that.data.images)
       },
     });
   },

  addAct(){
    let that = this
    let id = wx.getStorageSync('id')
    if((this.data.title == "")||(this.data.label == "")||(this.data.date == "")||(this.data.start == "")||(this.data.end == "")){
      wx.showToast({
        title: '请填写完整信息',
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
        if(that.isValid(that.data.start,that.data.end,that.data.todos,"活动")){
          var pubTime = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0') + " " + new Date().getHours().toString().padStart(2, '0') + ":" + (new Date().getMinutes()).toString().padStart(2, '0')
          console.log(that.data.detail)
          wx.request({
            url:'http://127.0.0.1:8000/schedule/addAct/',
            header:{ 'content-type': 'application/x-www-form-urlencoded'},
            data:{
              id: id,
              pubTime: pubTime,
              title: that.data.title,
              promoter: id,
              participants: '[]',
              partNumMin: that.data.minNum,
              partNumMax: that.data.maxNum,
              date: that.data.date,
              start: that.data.start,
              end: that.data.end,
              label: that.data.label,
              detail: that.data.detail,
              images: `${JSON.stringify(that.data.images)}`,
              tags: `${JSON.stringify(that.data.tags)}`,
              state: 0,
              comments:[]
            },
            method:'POST',
            success:function(res){
              console.log(res)
              wx.showToast({ title: '添加成功', icon: 'success' });
              wx.navigateBack({delta:1})
            }
          })
        }
      }
    })
    /*
    
    */
  },
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
  handleSignInput(event) {
    this.setData({
      detail: event.detail.value
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
  }
})