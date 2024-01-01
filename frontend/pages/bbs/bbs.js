Page({
  data: {
    id:4, // 用于确定是否为自己主页
    // bbsList: for debug use
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
    post: {},
    replyList: [],
    // todo：点赞和取消处理
    likeLabels: [0, 1, 0, 0],
    replyshow: false,
    replytext: '',
    // 当前回复的楼层，0为lz，1为第一个回复
    replyindex: 0,
    deleteallshow: false,
    deleteshow: false,
    deleteindex: 0,
    bbsId: 0
  },
  likePost(){
    var that = this
    wx.request({
      url:'http://43.138.52.97:8001/bbs/likePost/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:that.data.id,
        postId:that.data.bbsId
      },
      method:'POST',
      success:function(res){
        that.onLoad()
      }
    })
  },
  dislikePost(){
    var that = this
    wx.request({
      url:'http://43.138.52.97:8001/bbs/dislikePost/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:that.data.id,
        postId:that.data.bbsId
      },
      method:'POST',
      success:function(res){
        that.onLoad()
      }
    })
  },
  likeAct(event){
    var floor = event.target.dataset.index
    var that = this
    wx.request({
      url:'http://43.138.52.97:8001/bbs/likeReply/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:that.data.id,
        postId:that.data.bbsId,
        floor: floor
      },
      method:'POST',
      success:function(res){
        that.onLoad()
      }
    })
  },
  dislikeAct(event){
    var floor = event.target.dataset.index
    var that = this
    wx.request({
      url:'http://43.138.52.97:8001/bbs/dislikeReply/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:that.data.id,
        postId:that.data.bbsId,
        floor: floor
      },
      method:'POST',
      success:function(res){
        that.onLoad()
      }
    })
  },
  onClickRight(){
    wx.showToast({ title: '便于后续功能添加', icon: 'none' });
    // 屏蔽某层发言人?
  },
  // TODO: 回复功能的对接
  replyConfirm() {
    var floor = this.data.replyindex
    var that = this
    var nowTime = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0') + " " + parseInt(new Date().getHours()).toString().padStart(2, '0') + ":" + parseInt(new Date().getMinutes()).toString().padStart(2, '0')
    wx.request({
      url:'http://43.138.52.97:8001/bbs/addReply/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:that.data.id,
        postId:that.data.bbsId,
        time: nowTime,
        content: that.data.replytext,
        aboveId: floor
      },
      method:'POST',
      success:function(res){
        that.onLoad()
      }
    })
    wx.request({
      url:'http://43.138.52.97:8001/user/getDetail/',
      data:{
        'hostId': that.data.id,
        'customerId':that.data.id
      },
      method:'GET',
      success:function(res){
        var data = JSON.parse(res.data)
        var nickName = data.nickName
        if(floor == 1){
          var messageContent = nickName + "评论了你的动态“" + that.data.post.title + "”"
          var toUrl = '../bbs/bbs?bbsid=' + that.data.bbsId
          var recieverId = that.data.post.userId
        }
        else{
          var messageContent = nickName + "回复了你在“" + that.data.post.title + "”下的评论"
          var toUrl = '../bbs/bbs?bbsid=' + that.data.bbsId + '&floor=' + floor
          recieverId = that.getIdByFloor(floor)
        }
        wx.request({
          url:'http://43.138.52.97:8001/message/sendMessage/',
          header:{ 'content-type': 'application/x-www-form-urlencoded'},
          data:{
            receiverId: recieverId,
            time: nowTime,
            content: messageContent,
            toUrl: toUrl
          },
          method:'POST',
          success:function(res){
            that.onLoad()
          }
        })
      }
    })
  },
  deleteConfirm() {
    var floor = this.data.deleteindex
    var that = this
    wx.request({
      url:'http://43.138.52.97:8001/bbs/deleteReply/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:that.data.id,
        postId:that.data.bbsId,
        floor: floor
      },
      method:'POST',
      success:function(res){
        that.onLoad()
      }
    })
  },
  deleteallConfirm() {
    var that = this
    wx.request({
      url:'http://43.138.52.97:8001/bbs/deletePost/',
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        id:that.data.id,
        postId:that.data.bbsId
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
    if(options){
      const bbsid = options.bbsid;
      this.setData({
        bbsId:bbsid
      })
      if (options.floor) {
        wx.nextTick(() => {
          const query = wx.createSelectorQuery()
          query.select('#floor-' + options.floor).boundingClientRect(res => {
            wx.pageScrollTo({
              scrollTop: res.top - 60,
              duration: 300
            })
          }).exec()
        })
      }
    }

    var id = wx.getStorageSync('id')
    var that = this
    this.setData({
      id:id
    })
    wx.request({
      url:'http://43.138.52.97:8001/bbs/getPostDetail/',
      data:{
        id:id,
        postId: that.data.bbsId
      },
      method:'GET',
      success:function(res){
        var data = res.data
        that.setData({
          post: data,
          replyList: data.replies
        })
        var likeLabel = []
        if(that.data.post.likeList.includes(id)){
          likeLabel[0] = 1
        }
        else{
          likeLabel[0] = 0
        }
        for(var k = 0;k < that.data.replyList.length;k++){
          if(that.data.replyList[k].likeList.includes(id)){
            likeLabel[that.data.replyList[k].floor] = 1
          }
          else{
            likeLabel[that.data.replyList[k].floor] = 0
          }
        }
        that.setData({
          likeLabels: likeLabel
        })
      }
    })
    const selectedbbs = this.data.bbsList.find(item => item.id == this.data.bbsId);
    var post = selectedbbs;
    this.setData({
      post: post,
      replyList: selectedbbs.replies,
    });
  },
  toFloor(event){
    var floor = event.currentTarget.dataset.index;
    wx.nextTick(() => {
      const query = wx.createSelectorQuery()
        query.select('#floor-' + floor).boundingClientRect(res => {
          console.log(res)
          wx.pageScrollTo({
            scrollTop: res.top - 60,
            duration: 300
          })
      }).exec()
    })
  },
   getNameByFloor(floor){
     for(var i = 0;i<this.data.replyList.length;i++){
       if(this.data.replyList[i].floor == floor){
         return this.data.replyList[i].name
       }
     }
   },
   getIdByFloor(floor){
     for(var i = 0;i<this.data.replyList.length;i++){
       if(this.data.replyList[i].floor == floor){
         return this.data.replyList[i].userId
      }
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

  },
  handlereplyInput(event) {
    this.setData({ replytext: event.detail.value });
  },
  handleReply(event) {
    const index = event.currentTarget.dataset.index;
    this.setData({ 
      replyshow : true,
      replyindex: index
     });
  },
  handleDelete(event) {
    const index = event.currentTarget.dataset.index;
    this.setData({ 
      deleteshow : true,
      deleteindex: index
     });
  },
  handleDeleteAll() {
    this.setData({ deleteallshow : true });   
  },
  onreplyClose(){
    this.setData({ replyshow : false });    
  },
  ondeleteClose(){
    this.setData({ deleteshow : false });    
  },
  ondeleteallClose(){
    this.setData({ deleteallshow : false });    
  },
})