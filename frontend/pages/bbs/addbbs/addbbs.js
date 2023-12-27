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
    wx.request({
      url:'http://127.0.0.1:8000/bbs/addPost/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:id,
        title: that.data.title,
        time:nowTime,
        content: that.data.content,
        images: `${that.data.images}`
      },
      method:'POST',
      success:function(res){
        wx.navigateBack({delta:1})
      }
    })
  },
  afterRead(event) {
    const { file } = event.detail;
    console.log(file[0].url)
    const { fileList = [] } = this.data;
    fileList.push({ ...file, url: file[0].url });
    var images = this.data.images
    images.push(file[0].url)
    this.setData({ fileList });
    this.setData({
      images:images
    })
    console.log(this.data.images)

    /*
     wx.uploadFile({
       url: 'http://127.0.0.1:8000/user/postImage/',
       filePath: file[0].url,
       name: 'image',
       formData: { id: id },
       header:{ 'content-type': 'application/x-www-form-urlencoded'},
       method:"POST",
       success(res) {
         // 上传完成需要更新 fileList
         const { fileList = [] } = that.data;
         fileList.push({ ...file, url: 'http://43.138.52.97:8001/' + res.data });
         //fileList.push({ ...file, url: file[0].url });
         var images = that.data.images
         images.push('http://43.138.52.97:8001/' + res.data)
         that.setData({ fileList });
         that.setData({
           images:images
         })
         console.log(that.data.images)
       },
     });
     */
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