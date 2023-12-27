// pages/search/search.js
Page({
  data: {
    searchkey: '',
    bbsList:[
      // {userId:1, name:"NLno", avatar: "../images/avatar4.png", title:"[失物招领]在紫操西北角捡到一串钥匙，已经交到紫荆一楼了", time:"2023-12-17 17:30", id:101, content: "如图所示", images: ['../images/swiper1.jpg', '../images/swiper2.jpg'], likeList:[], replies:[]},
    ],
    userList:[
      {userid:995, name:"test1", avatar:"../images/avatar1.png"},
      {userid:996, name:"test2", avatar:"../images/avatar2.png"},
      {userid:997, name:"test3", avatar:"../images/avatar3.png"},
      {userid:998, name:"test4long", avatar:"../images/avatar4.png"},
      {userid:995, name:"test11", avatar:"../images/avatar1.png"},
      {userid:996, name:"test22", avatar:"../images/avatar2.png"},
      {userid:997, name:"test33", avatar:"../images/avatar3.png"},
      {userid:998, name:"test44", avatar:"../images/avatar4.png"},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.key){
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