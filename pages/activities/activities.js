// pages/activities/activities.js
Page({
  data: {
    active: 1,
    value: '',
    signshow: false,
    reviewshow: false,
    signtext: '',
    reviewList: [
      {id: 1, nickname:"GUMI", text:"软院 2022012222 张三", state:1},
      {id: 2, nickname:"teto",  text:"软件学院 2021011111 李四，请让我参加活动，我什么都会做的！", state: 0},
      {id: 404, nickname:"anonymous",  text:"让我看看", state: 2}
    ],
    // 0未处理，1接受，2拒绝
    activities1:[],
    activities3:[],
    activities2:[],
    activities4:[]
  },
  onClickRight() {
    wx.navigateTo({
      url: '../addactivity/addactivity',
    })
  },
  showdetail1(event) {
    const id = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: './activity/activity?actid=' + this.data.activities1[id].id
    })
  },
  showdetail2(event) {
    const id = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: './activity/activity?actid=' + this.data.activities2[id].id
    })
  },
  showdetail3(event) {
    const id = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: './activity/activity?actid=' + this.data.activities3[id].id
    })
  },
  showdetail4(event) {
    const id = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: './activity/activity?actid=' + this.data.activities4[id].id
    })
  },
  signupConfirm() {

  },
  onChange(e) {
    this.setData({
       value: e.detail,
    });
   },
   onClick() {
    var that = this
    let id = wx.getStorageSync('id')
    wx.request({
      url:'http://127.0.0.1:8000/schedule/findAct/',
      data:{
        'keyForSearch': this.data.value
      },
      method:'GET',
      success:function(res){
        let data = res.data
        for(let i = 0;i<data.length;i++){
          var j = 0
          data[i].participantNum = data[i].participants.length
          wx.request({
            url:'http://127.0.0.1:8000/user/getDetail/',
            data:{
              'hostId': data[i].promoter,
              'customerId':data[i].promoter
            },
            method:'GET',
            success:function(res){
              var dataa = JSON.parse(res.data)
              data[i].promoter = dataa.nickName
              if(j == data.length - 1){
                that.setData({
                  activities2: data
                })
              }
              j++
            }
          })
        }
      }
    })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    let id = wx.getStorageSync('id')
    wx.request({
      url:'http://127.0.0.1:8000/schedule/findAct/',
      data:{
        'isRandom': 1
      },
      method:'GET',
      success:function(res){
        let data = res.data
        for(let i = 0;i<data.length;i++){
          var j = 0
          data[i].participantNum = data[i].participants.length
          wx.request({
            url:'http://127.0.0.1:8000/user/getDetail/',
            data:{
              'hostId': data[i].promoter,
              'customerId':data[i].promoter
            },
            method:'GET',
            success:function(res){
              var dataa = JSON.parse(res.data)
              data[i].promoter = dataa.nickName
              if(j == data.length - 1){
                that.setData({
                  activities2: data
                })
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

  },
  handleReview(event) {
    this.setData({ reviewshow : true }); 
    const actindex = event.currentTarget.dataset.index;
    // TODO：请求获取申请信息, 根据id获得用户名（需要对重复提交的进行筛选吗？）
    // 但不知道是否要保留已经处理过的请求

  },
  agreeHandle(event) {
    //TODO: 同意请求
    const tempList = this.data.reviewList;
    const personindex = event.currentTarget.dataset.index;
    const tempItem = tempList[personindex];
    tempItem.state = 1;
    this.setData({reviewList: tempList});
    wx.showToast({ title: '已同意', icon: 'success' });
  },
  rejectHandle(event) {
    //TODO: 拒绝请求
    const tempList = this.data.reviewList;
    const personindex = event.currentTarget.dataset.index;
    const tempItem = tempList[personindex];
    tempItem.state = 2;
    this.setData({reviewList: tempList});
    wx.showToast({ title: '已拒绝', icon: 'success' });
  },
  handleSignup() {
    this.setData({ signshow : true }); 
  },
  onsignClose() {
    this.setData({ signshow : false });     
  },
  onactiveChange(event){
    this.setData({active: event.detail.index})
    var that = this
    let id = wx.getStorageSync('id')
    if(this.data.active == 0){
      this.setData({
        activities1:[]
      })
      wx.request({
        url:'http://127.0.0.1:8000/user/getDetail/',
        data:{
          'hostId': id,
          'customerId':id
        },
        method:'GET',
        success:function(res){
          var dat = JSON.parse(res.data)
          for(let k = 0;k < dat.followings.length;k++){
            wx.request({
              url:'http://127.0.0.1:8000/schedule/findAct/',
              data:{
                'promoter': dat.followings[k]
              },
              method:'GET',
              success:function(res){
                let data = res.data
                for(let i = 0;i<data.length;i++){
                  var j = 0
                  data[i].participantNum = data[i].participants.length
                  wx.request({
                    url:'http://127.0.0.1:8000/user/getDetail/',
                    data:{
                      'hostId': data[i].promoter,
                      'customerId':data[i].promoter
                    },
                    method:'GET',
                    success:function(res){
                      var dataa = JSON.parse(res.data)
                      data[i].promoter = dataa.nickName
                      if(j == data.length - 1){
                        var newdata = that.data.activities1
                        newdata = newdata.concat(data)
                        that.setData({
                          activities1: newdata
                        })
                      }
                      j++
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
    else if(this.data.active == 2){
      var that = this
      let id = wx.getStorageSync('id')
      wx.request({
        url:'http://127.0.0.1:8000/schedule/findAct/',
        data:{
          'promoter': id
        },
        method:'GET',
        success:function(res){
          let data = res.data
          for(let i = 0;i<data.length;i++){
            var j = 0
            data[i].participantNum = data[i].participants.length
            wx.request({
              url:'http://127.0.0.1:8000/user/getDetail/',
              data:{
                'hostId': data[i].promoter,
                'customerId':data[i].promoter
              },
              method:'GET',
              success:function(res){
                var dataa = JSON.parse(res.data)
                data[i].promoter = dataa.nickName
                if(j == data.length - 1){
                  that.setData({
                    activities3: data
                  })
                }
                j++
              }
            })
          }
        }
      })
    }
    else if(this.data.active == 3){
      var that = this
      let id = wx.getStorageSync('id')
      var ids = []
      ids.push(id)
      wx.request({
        url:'http://127.0.0.1:8000/schedule/findAct/',
        data:{
          'participants': ids
        },
        method:'GET',
        success:function(res){
          let data = res.data
          for(let i = 0;i<data.length;i++){
            var j = 0
            data[i].participantNum = data[i].participants.length
            wx.request({
              url:'http://127.0.0.1:8000/user/getDetail/',
              data:{
                'hostId': data[i].promoter,
                'customerId':data[i].promoter
              },
              method:'GET',
              success:function(res){
                var dataa = JSON.parse(res.data)
                data[i].promoter = dataa.nickName
                if(j == data.length - 1){
                  that.setData({
                    activities4: data
                  })
                }
                j++
              }
            })
          }
        }
      })
    }
  },
  handleSignInput(event) {
    this.setData({
      signtext: event.detail.value
    });
  },
})