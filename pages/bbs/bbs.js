Page({
  data: {
    // bbsList: for debug use
    bbsList: [
      {title:"今天真冷啊..", time:"2023-12-18 13:56", id:103, content: "完全不想出门上课啊啊啊啊啊啊啊", image: [], likeList:['4', '5'], 
        replies:[{
          name: "teto",
          avatar: "../images/avatar3.png",
          time: "2023-12-18 14:02",
          content: "这是我见过最正确的话了",
          likeList:['3'],
        }]},
      {title:"[提问氵]西操体育馆几点开放啊", time:"2023-12-17 18:56", id:102, content: "想去打台球，但是不知道早上几点开门，谢谢大家了！", image: [], likeList:[], replies:[]},
      {title:"[失物招领]在紫操西北角捡到一串钥匙，已经交到紫荆一楼了", time:"2023-12-17 17:30", id:101, content: "如图所示", image: ['../images/swiper1.jpg', '../images/swiper2.jpg'], likeList:[], replies:[]},
      {title:"[新成就] “一年的坚持与守望”", time:"2023-11-31 10:02", id:100, content: "", image: [], likeList:['4', '5'], replies:[]},
    ],
    post: {
      name: "NLno",
      avatar: "../images/avatar4.png",
      title: "",
      time: "",
      content: "",
      image: [],
      likeList:[],
    },
    replyList: [],
    likeLabel: 0,
    likeLabels: [],
  },
  onClickRight(){
    wx.showToast({ title: '便于后续功能添加', icon: 'none' });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const bbsid = options.bbsid;
    const selectedbbs = this.data.bbsList.find(item => item.id == bbsid);
    var post = this.data.post;
    post.title = selectedbbs.title;
    post.time = selectedbbs.time;
    post.content = selectedbbs.content;
    post.image = selectedbbs.image;
    post.likeList = selectedbbs.likeList;
    this.setData({
      post: post,
      replyList: selectedbbs.replies,
    });
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