// pages/search/search.js
Page({
  data: {
    searchkey: '',
    bbsList:[
      {userId:1, name:"NLno", avatar: "../images/avatar4.png", title:"[失物招领]在紫操西北角捡到一串钥匙，已经交到紫荆一楼了", time:"2023-12-17 17:30", id:101, content: "如图所示", images: ['../images/swiper1.jpg', '../images/swiper2.jpg'], likeList:[], replies:[]},
    ],
    userList:[
      {userId:995, name:"test1", avatar:"../images/avatar1.png"},
      {userId:996, name:"test2", avatar:"../images/avatar2.png"},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    if(options){
      var token = wx.getStorageSync('token')
      wx.request({
        url:'http://127.0.0.1:8000/bbs/searchPost/',
        header: {'Authorization': token},
        data:{
          key: options.key
        },
        method:'GET',
        success:function(res){
          var data = res.data
          that.setData({
            bbsList: data,
          });
        }
      })
      var token = wx.getStorageSync('token')
      wx.request({
        url:'http://127.0.0.1:8000/user/search/',
        header: {'Authorization': token},
        data:{
          key: options.key
        },
        method:'GET',
        success:function(res){
          var data = res.data
          that.setData({
            userList: data,
          });
        }
      })
      this.setData({ searchkey: options.key });
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

  }
})