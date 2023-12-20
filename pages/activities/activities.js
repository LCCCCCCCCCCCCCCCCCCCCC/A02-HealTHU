// pages/activities/activities.js
Page({
  data: {
    canlendarshow: false,
    canlendardate: '',
    minDate:new Date(2023, 10, 1).getTime(),
    maxDate:new Date(2024, 5, 10).getTime(),
    startDate:"2023/12/20",
    endDate:"2024/05/10",
    active: 1,
    value: '',
    activities1:[],
    activities2:[],
    activities3:[],
    activities4:[],
    // remain to frontend debugging
    // activities:[
    //   {title: "软件学院2023秋第10周集体锻炼", promoter:"NLno", participantNum:2,partNumMin:2,partNumMax:4,date:"2023/12/18",start:"17:00",end:"18:00",label:"打卡统计",tags:["紫荆操场","飞盘","集体锻炼"],state:0,id:3734},
    //   {title: "寻找网球等球类搭子", promoter:"NLno", participantNum:0,partNumMin:1,partNumMax:2,date:"2023/12/19",start:"15:00",end:"18:00",label:"初学者，水平一般，周末都有空，希望不嫌我菜",tags:["紫荆网球场","网球","羽毛球","交友"],state:1,id:6852},
    // ],
    id: '',
  },
  handleReview(event) {
    const id = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: './actreview/actreview?actid=' + this.data.activities3[id].id
    })
  },
  onClickRight() {
    this.setData({active:1})
    this.onLoad()
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
        'keyForSearch': this.data.value,
        minDate: that.data.startDate,
        maxDate: that.data.endDate
      },
      method:'GET',
      success:function(res){
        let data = res.data
        that.setData({
          active: 1
        })
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
              data[i].promoterId = data[i].promoter
              data[i].promoter = dataa.nickName
              data[i].state = that.getState(data[i].date,data[i].start,data[i].end)
              if(j == data.length - 1){
                that.setData({
                  activities2: data,
                  active: 1
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
    this.setData({
      id:id
    })
    wx.request({
      url:'http://127.0.0.1:8000/schedule/findAct/',
      data:{
        'isRandom': 1,
        minDate: that.data.startDate,
        maxDate: that.data.endDate
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
              'customerId':data[i].promoter,
            },
            method:'GET',
            success:function(res){
              var dataa = JSON.parse(res.data)
              data[i].promoterId = data[i].promoter
              data[i].promoter = dataa.nickName
              data[i].state = that.getState(data[i].date,data[i].start,data[i].end)
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
                'promoter': dat.followings[k],
                minDate: that.data.startDate,
                maxDate: that.data.endDate
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
                      'customerId':data[i].promoter,
                    },
                    method:'GET',
                    success:function(res){
                      var dataa = JSON.parse(res.data)
                      data[i].promoterId = data[i].promoter
                      data[i].promoter = dataa.nickName
                      data[i].state = that.getState(data[i].date,data[i].start,data[i].end)
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
          'promoter': id,
          minDate: that.data.startDate,
          maxDate: that.data.endDate
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
                'customerId':data[i].promoter,
              },
              method:'GET',
              success:function(res){
                var dataa = JSON.parse(res.data)
                data[i].promoterId = data[i].promoter
                data[i].promoter = dataa.nickName
                data[i].state = that.getState(data[i].date,data[i].start,data[i].end)
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
          'participants': ids,
          minDate: that.data.startDate,
          maxDate: that.data.endDate
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
                'customerId':data[i].promoter,
              },
              method:'GET',
              success:function(res){
                var dataa = JSON.parse(res.data)
                data[i].promoterId = data[i].promoter
                data[i].promoter = dataa.nickName
                data[i].state = that.getState(data[i].date,data[i].start,data[i].end)
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
  getState(date,start,end){
    var nowTime = parseInt(new Date().getHours() + (new Date().getMinutes()).toString().padStart(2, '0'))
    var nowDate = parseInt(new Date().getFullYear() + (new Date().getMonth() + 1).toString().padStart(2, '0') + new Date().getDate().toString().padStart(2, '0')),
    start = parseInt(start.replace(":", ""))
    end = parseInt(end.replace(":", ""))
    date = parseInt(date.replace(/\//g, ""));
    if((date>nowDate)||((date == nowDate)&&(start>nowTime))){
      return 0
    }
    else if((date<nowDate)||((date == nowDate)&&(end<nowTime))){
      return 2
    }
    else{
      return 1
    }
  },
  oncanConfirm(event) {
    const [start, end] = event.detail;
    this.setData({
      canlendarshow: false,
      startDate: this.formatDate(start),
      endDate: this.formatDate(end)
    });
    // TODO: 传递日期筛选

  },
  oncanClose() {
    this.setData({ canlendarshow: false });
  },
  onClickLeft() {
    this.setData({ canlendarshow: true });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  }
})