
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
      {userId:1, name:"NLno", avatar: "../images/avatar4.png", title:"今天真冷啊..", time:"2023-12-18 13:56", id:103, content: "完全不想出门上课啊啊啊啊啊啊啊", images: ['../images/swiper4.jpg'], likeList:['4', '5'],
        replies:[
          {
            floor: 3,
            userId:[4],
            name: "teto",
            avatar: "../images/avatar3.png",
            time: "2023-12-18 14:02",
            content: "这是我见过最正确的话了",
            likeList:[3],
            aboveId: 0
          },
          {
            floor: 2,
            userId:[5],
            name: "GUMI",
            avatar: "../images/avatar2.png",
            time: "2023-12-18 14:09",
            content: "水贴长经验呢",
            likeList:[],
            aboveId: 1,
            aboveName:"teto",
            aboveContent: "这是我见过最正确的话了"
          },
          {
            floor: 3,
            userId:[4],
            name: "teto",
            avatar: "../images/avatar3.png",
            time: "2023-12-18 14:15",
            content: "要你管",
            likeList:[],
            aboveId: 2,
            aboveName:"GUMI",
            aboveContent: "水贴长经验呢"
          },
      ]},
      {userId:1, name:"NLno", avatar: "../images/avatar4.png", title:"[提问氵]西操体育馆几点开放啊", time:"2023-12-17 18:56", id:102, content: "想去打台球，但是不知道早上几点开门，谢谢大家了！", images: [], likeList:[], replies:[]},
      {userId:1, name:"NLno", avatar: "../images/avatar4.png", title:"[失物招领]在紫操西北角捡到一串钥匙，已经交到紫荆一楼了", time:"2023-12-17 17:30", id:101, content: "如图所示", images: ['../images/swiper1.jpg', '../images/swiper2.jpg'], likeList:[], replies:[]},
    ],
    actList: [
    ],
    actaddList: [
      {name:"NLno", title:"[活动报名] 2023秋软件学院集体锻炼", time:"2023-12-18 9:20", id: 10001},
    ]
  },
  follow(){
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url:'http://127.0.0.1:8000/user/addAttention/',
      header:{ 'content-type': 'application/x-www-form-urlencoded','Authorization': token},
      data:{
        hostId: that.data.id,
        customerId: that.data.userId
      },
      method:'POST',
      success:function(res){
        that.onLoad()
      }
    })
  },
  unfollow(){
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url:'http://127.0.0.1:8000/user/delAttention/',
      header:{ 'content-type': 'application/x-www-form-urlencoded','Authorization': token},
      data:{
        hostId: that.data.id,
        customerId: that.data.userId
      },
      method:'POST',
      success:function(res){
        that.onLoad()
      }
    })
  },
  onChange(event) {
  // event.detail.name
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options) {
      // 获取options.id对应的用户信息
      this.setData({ userId: options.id });
    } 
    var id = wx.getStorageSync('id')
    this.setData({
      id:id
    })
    var that = this
    var token = wx.getStorageSync('token')
      wx.request({
        url:'http://127.0.0.1:8000/user/getPersonal/',
        header: {'Authorization': token},
        data:{
          hostId: id,
          customerId: that.data.userId
        },
        method:'GET',
        success:function(res){
          var data = res.data
          console.log(data)
          var followed = true;
          if(data.following_state == 1){
            followed = true
          }
          if(data.following_state == 0){
            followed = false
          }
          that.setData({
            nickName: data.nickName,
            avatarUrl: data.avatarUrl,
            signature:data.signature,
            followings: data.followings,
            followers: data.followers,
            following_state: data.following_state,
            //achList:data.achievements,
            bbsList:data.posts,
            actList:data.partActs,
            actaddList: data.iniActs,
            followed:followed
          });
        }
      })
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