// pages/activities/actreview/actreview.js
Page({
  data: {
    activity: {
      title: "软件学院2023秋第10周集体锻炼",
      participantNum:2,
      partNumMin:2,
      partNumMax:4,
      date:"2023/12/18",
      start:"17:00",
      end:"18:00",
    },
    reviewList: [
      {id: 1, nickName:"GUMI", text:"软院 2022012222 张三"},
      {id: 2, nickName:"teto",  text:"软件学院 2021011111 李四，请让我参加活动，我什么都会做的！"},
      {id: 404, nickName:"anonymous",  text:"让我看看"}
    ],
    // 0未处理，1接受，2拒绝
    tempItem: {id: 1, nickname:"GUMI", text:"软院 2022012222 张三", state:1},
    reviewshow: false,
    radio: "1",
    actId:""
  },

  reviewHandle() {
    if(this.data.radio === "1") {
      // 同意请求,操作对象为tempItem,更新reviewList状态
      var id = wx.getStorageSync('id')
      var applicationId = this.data.tempItem.id
      console.log(this.data.tempItem)
      var that = this
      console.log(id + " " + applicationId)
      wx.request({
        url:'http://127.0.0.1:8000/schedule/appReply/',
        header:{ 'content-type': 'application/x-www-form-urlencoded'},
        data:{
          id:id,
          applicationId:applicationId,
          isAgree: 1
        },
        method:'POST',
        success:function(res){
          wx.showToast({ title: '操作成功', icon: 'success' });
        }
      })
    }
    else if(this.data.radio === "2"){
      //拒绝请求

      wx.showToast({ title: '已拒绝', icon: 'success' });
    }
  },
  reviewShow(event) {
    const personindex = event.currentTarget.dataset.index;
    const tempList = this.data.reviewList;
    const tempItem = tempList[personindex];
    this.setData({
      reviewshow: true,
      tempItem: tempItem
    });
  },
  onChange(event) {
    this.setData({ radio: event.detail });
  },
  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({ radio: name });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.actid){
      var actid = options.actid;
      this.setData({actId:actid})
    }
    var id = wx.getStorageSync('id')
    var that = this
    wx.request({
      url:'http://127.0.0.1:8000/schedule/getActDetail/',
      data:{
        actId: that.data.actId
      },
      method:'GET',
      success:function(res){
        var data = res.data
        data.participantNum = data.participants.length
        that.setData({
          activity:data
        })
      }
    })
    wx.request({
      url:'http://127.0.0.1:8000/schedule/getApplication/',
      data:{
        id: id
      },
      method:'GET',
      success:function(res){
        var data = res.data
        var filteredApps = data.filter(function(data) {
          return actid == data.actId
        });
        console.log(filteredApps)
        for(let i = 0;i< filteredApps.length;i++){
          var j = 0
          filteredApps[i].text = filteredApps[i].message
          //filteredApps[i].id = filteredApps[i].applyerId
          wx.request({
            url:'http://127.0.0.1:8000/user/getDetail/',
            data:{
              'hostId': id,
              'customerId':filteredApps[i].applyerId
            },
            method:'GET',
            success:function(res){
              var dataa = JSON.parse(res.data)
              filteredApps[i].nickName = dataa.nickName
              if(j == filteredApps.length - 1){
                that.setData({reviewList:filteredApps})
              }
              j++
            }
          })
        }
      }
    })
    // TODO：请求获取申请信息（需要对重复提交的进行筛选吗？），获取活动人数限制相关信息到activity
    // 但不知道是否要保留已经处理过的请求
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