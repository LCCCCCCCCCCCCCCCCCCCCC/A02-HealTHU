
// pages/personal/personal.js
Page({
  data: {
    active: 0,
    nickName: '微信用户',
    avatarUrl: '',
    signature: "这个人很懒，即使这样也没有留下签名",
    followed: false,
    userId: 0,
    id:1, // 用于确定是否为自己主页
    // 展示最近获得的6个成就
    achList: [
      {img: "../images/oneyear.png",text: "一年的坚持与守望", time: "2023/11", detail:"注册满一年", state: 100},
      {img: "../images/ach11.png", text: "月度纪念2023", time: "2023/11", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach10.png", text: "月度纪念2023", time: "2023/10", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach9.png",text: "月度纪念2023", time: "2023/9", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach8.png",text: "月度纪念2023", time: "2023/8", detail:"当月打卡日期超过10天", state: 100},
      {img: "../images/ach7.png",text: "月度纪念2023", time: "2023/7", detail:"当月打卡日期超过10天", state: 100},
    ],
    bbsList: [
      { title:"今天真冷啊..", time:"2023-12-18 13:56", id: 103},
      {title:"[提问氵]西操体育馆几点开放啊", time:"2023-12-17 18:56", id:102},
      {title:"[失物招领]在紫操西北角捡到一串钥匙，已经交到紫荆一楼了", time:"2023-12-17 17:30", id:101},
      // {name:"NLno", title:"[新成就] “一年的坚持与守望”", time:"2023-11-31 10:02", url: '../bbs/bbs?bbsid=100'}
    ],
    actList: [
    ],
    actaddList: [
      {name:"NLno", title:"[活动报名] 2023秋软件学院集体锻炼", time:"2023-12-18 9:20", id: 10001},
    ]
  },
  onChange(event) {
  // event.detail.name
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      // 获取options.id对应的用户信息
      this.setData({ userId: options.id });
    } 
    var id = wx.getStorageSync('id')
    var that = this
    /*
    if(1 == 0){
      wx.request({
        url:'http://127.0.0.1:8000/user/getPersonal/',
        data:{
          hostId: id,
          customerId: that.data.userId
        },
        method:'GET',
        success:function(res){
          var data = res.data
          var followed = true;
          if(data.following_state == "true"){
            followed = true
          }
          if(data.following_state == "false"){
            followed = false
          }
          that.setData({
            nickName: data.nickName,
            avatarUrl: data.avatarUrl,
            signature:data.signature,
            followings: data.followings,
            followers: data.followers,
            following_state: data.following_state,
            achList:data.achievements,
            bbsList:data.posts,
            actList:data.partActs,
            actaddList: data.iniActs,
            followed:followed
          });
        }
      })
    }
    */
    var id = wx.getStorageSync('id')
    this.setData({
      id:id
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

  }
})