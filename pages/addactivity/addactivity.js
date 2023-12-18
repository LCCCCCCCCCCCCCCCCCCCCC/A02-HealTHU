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
    label: "", //活动类型
    detail: "", //活动介绍
    tagtext: "",
    tags: [],
    showpicker: false,
    fileList: [],
  },

  // 示例的上传图片到服务器并显示在界面
  // afterRead(event) {
  //   const { file } = event.detail;
  //   // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  //   wx.uploadFile({
  //     url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
  //     filePath: file.url,
  //     name: 'file',
  //     formData: { user: 'test' },
  //     success(res) {
  //       // 上传完成需要更新 fileList
  //       const { fileList = [] } = this.data;
  //       fileList.push({ ...file, url: res.data });
  //       this.setData({ fileList });
  //     },
  //   });
  // },

  addAct(){
    var id = wx.getStorageSync('id')
    wx.request({
      url:'http://127.0.0.1:8000/schedule/addAct/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id: id,
        pubTime: "2023/12/19 13:00",
        title: "原神",
        promoter: id,
        participants: '[1,2]',
        partNumMin: 2,
        partNumMax: 4,
        date: "2023/12/20",
        start: "14:00",
        end: "15:00",
        label: "我要玩原神！",
        detail: "",
        images: '["../../images/swiper1.jpg", "../../images/swiper2.jpg", "../../images/swiper3.jpg"]',
        tags: '["原神","op","玩原神玩的"]',
        state: 0,
        comments:[]
      },
      method:'POST',
      success:function(res){
        console.log(res)
        wx.showToast({ title: '添加成功', icon: 'success' });
      }
    })
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
    console.log(this.data.tags);
  },
  ontagClose(event) {
    const tags = this.data.tags;
    tags.splice(event.currentTarget.dataset.index, 1); 
    this.setData({tags: tags});
    console.log(this.data.tags);
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
})