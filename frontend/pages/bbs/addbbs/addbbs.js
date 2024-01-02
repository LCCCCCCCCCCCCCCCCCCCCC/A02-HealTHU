// pages/bbs/addbbs/addbbs.js
Page({
  data: {
    fileList: [],
    time: '',
    title: '',
    content: '',
    images: []
  },
  // TODO: 发送帖子对接
  addbbs() {
    var id = wx.getStorageSync('id')
    var that = this
    var nowTime = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0') + " " + parseInt(new Date().getHours()).toString().padStart(2, '0') + ":" + parseInt(new Date().getMinutes()).toString().padStart(2, '0')
    console.log(this.data.content.value)
    wx.request({
      url:'http://127.0.0.1:8000/bbs/addPost/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:id,
        title: that.data.title,
        time:nowTime,
        content: that.data.content.value,
        images: `${JSON.stringify(that.data.images)}`
      },
      method:'POST',
      success:function(res){
        wx.navigateBack({delta:1})
      }
    })
  },
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
  handleInput(event) {
    this.setData({
      content: event.detail
    });
  },
})