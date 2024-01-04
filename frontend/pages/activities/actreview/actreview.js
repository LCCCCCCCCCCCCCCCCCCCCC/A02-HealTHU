// pages/activities/actreview/actreview.js
Page({
  data: {
    activity: {
      // title: "软件学院2023秋第10周集体锻炼",
      // participantNum:2,
      // partNumMin:2,
      // partNumMax:4,
      // date:"2023/12/18",
      // start:"17:00",
      // end:"18:00",
    },
    reviewList: [
      // {id: 1, nickName:"GUMI", text:"软院 2022012222 张三"},
      // {id: 2, nickName:"teto",  text:"软件学院 2021011111 李四，请让我参加活动，我什么都会做的！"},
      // {id: 404, nickName:"anonymous",  text:"让我看看"}
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
      var that = this
      var token = wx.getStorageSync('token')
      wx.request({
        url:'http://43.138.52.97:8001/schedule/appReply/',
        header:{ 'content-type': 'application/x-www-form-urlencoded','Authorization': token},
        data:{
          id:id,
          applicationId:applicationId,
          isAgree: 1
        },
        method:'POST',
        success:function(res){
          wx.showToast({ title: '已同意', icon: 'success' });
          var token = wx.getStorageSync('token')
          wx.request({
            url:'http://43.138.52.97:8001/user/getDetail/',
            header: {'Authorization': token},
            data:{
              'hostId': id,
              'customerId':id
            },
            method:'GET',
            success:function(res){
              var data = JSON.parse(res.data)
              var nickName = data.nickName
              var messageContent = nickName + "同意了你的报名请求"
              var nowTime = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0') + " " + parseInt(new Date().getHours()).toString().padStart(2, '0') + ":" + parseInt(new Date().getMinutes()).toString().padStart(2, '0')
              var recieverId = that.data.tempItem.applyerId
              var toUrl = '../activities/activity/activity?actid=' + that.data.activity.id
              var token = wx.getStorageSync('token')
              wx.request({
                url:'http://43.138.52.97:8001/message/sendMessage/',
                header:{ 'content-type': 'application/x-www-form-urlencoded','Authorization': token},
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
          that.onLoad()
        }
      })
    }
    else if(this.data.radio === "2"){
      var id = wx.getStorageSync('id')
      var applicationId = this.data.tempItem.id
      console.log(this.data.tempItem)
      var that = this
      console.log(id + " " + applicationId)
      var token = wx.getStorageSync('token')
      wx.request({
        url:'http://43.138.52.97:8001/schedule/appReply/',
        header:{ 'content-type': 'application/x-www-form-urlencoded','Authorization': token},
        data:{
          id:id,
          applicationId:applicationId,
          isAgree: 2
        },
        method:'POST',
        success:function(res){
          wx.showToast({ title: '已拒绝'});
          var token = wx.getStorageSync('token')
          wx.request({
            url:'http://43.138.52.97:8001/user/getDetail/',
            header: {'Authorization': token},
            data:{
              'hostId': id,
              'customerId':id
            },
            method:'GET',
            success:function(res){
              var data = JSON.parse(res.data)
              var nickName = data.nickName
              var messageContent = nickName + "拒绝了你的报名请求"
              var nowTime = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0') + " " + parseInt(new Date().getHours()).toString().padStart(2, '0') + ":" + parseInt(new Date().getMinutes()).toString().padStart(2, '0')
              var recieverId = that.data.tempItem.applyerId
              var toUrl = '../activities/activity/activity?actid=' + that.data.activity.id
              var token = wx.getStorageSync('token')
              wx.request({
                url:'http://43.138.52.97:8001/message/sendMessage/',
                header:{ 'content-type': 'application/x-www-form-urlencoded','Authorization': token},
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
          that.onLoad()
        }
      })
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
    if(options){
      var actid = options.actid;
      this.setData({actId:actid})
    }
    var id = wx.getStorageSync('id')
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url:'http://43.138.52.97:8001/schedule/getActDetail/',
      header: {'Authorization': token},
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
    var token = wx.getStorageSync('token')
    wx.request({
      url:'http://43.138.52.97:8001/schedule/getApplication/',
      header: {'Authorization': token},
      data:{
        id: id
      },
      method:'GET',
      success:function(res){
        var data = res.data
        var filteredApps = data.filter(function(data) {
          return actid == data.actId
        });

        if(filteredApps.length == 0){
          that.setData({reviewList:[]})
        }
        for(let i = 0;i< filteredApps.length;i++){
          var j = 0
          filteredApps[i].text = filteredApps[i].message
          //filteredApps[i].id = filteredApps[i].applyerId
          var token = wx.getStorageSync('token')
          wx.request({
            url:'http://43.138.52.97:8001/user/getDetail/',
            header: {'Authorization': token},
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