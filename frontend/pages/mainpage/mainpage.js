// pages/mainpage/mainpage.js
Page({
  data: {
    switchColorbyType: {
      "课程": "#BBBB00",
      "运动": "#00BB00",
      "活动": "#0000FF",
      "ddl":  "#009999",
      "饮食": "#BB00BB",
    },
    todos:[],
    fans:[],
    attention:[],
    fannum: 0,
    attentionnum: 0,
    ddls:[],
    currentTab: 0,
    userInfo: {},
    exitshow: false,
    bbsactivate: 0,
    // 未读消息数量
    unreadNum: 0,
    noticeList: [],
    bbsList: [],
    bbsList1: [],
    bbsList2: [],
    bbsList3: [],
    id:0,
    readchecked: false,
    searchvalue: '',
    noneshow: false,
  },
  // TODO：未读消息阅读更新
  delUnread(event){
    var tempList = this.data.noticeList;
    const personindex = event.currentTarget.dataset.index;
    var tempItem = tempList[personindex];
    if(tempItem.state == 0){
      tempItem.state = 1;
      var unread = this.data.unreadNum;
      unread--;
      this.setData({
        noticeList: tempList,
        unreadNum: unread
      });
    }
    var id = wx.getStorageSync('id')
    var token = wx.getStorageSync('token')
    wx.request({
      url:'http://43.138.52.97:8001/message/read/',
      header:{ 'content-type': 'application/x-www-form-urlencoded','Authorization': token},
      data:{
        id:id,
        messageId: tempList[personindex].id
      },
      method:'POST',
      success:function(res){
      }
    })
  },
  onbbsChange(event){
    var choice = event.detail.index
    var that = this
    var id = wx.getStorageSync('id')
    if(choice != 3){
      var token = wx.getStorageSync('token')
      wx.request({
        url:'http://43.138.52.97:8001/bbs/getPost/',
        header: {'Authorization': token},
        data:{
          id:id,
          type: choice
        },
        method:'GET',
        success:function(res){
          var data = res.data
          if(choice == 0){
            that.setData({
              bbsList1: data,
            });
          }
          else if (choice == 1){
            that.setData({
              bbsList2: data,
            });
          }
          else{
            that.setData({
              bbsList3: data,
            });
          }
        }
      })
    }
    else{
      var token = wx.getStorageSync('token')
      wx.request({
        url:'http://43.138.52.97:8001/message/getMessages/',
        header: {'Authorization': token},
        data:{
          id:id,
        },
        method:'GET',
        success:function(res){
          var data = res.data
          var unreadNum = 0
          for(var i = 0;i< data.length; i++){
            if(data[i].state == 0){
              unreadNum ++
            }
          }
          that.setData({
            noticeList: data,
            unreadNum: unreadNum
          });
        }
      })
    }
  },
  unreadChange(event){
    this.setData({ readchecked: event.detail });
  },
  onsearchChange(event){
    this.setData({ searchvalue: event.detail });
  },
  onSearch(){
    console.log(this.data.searchvalue)
    if(this.data.searchvalue.length == 0){
      this.setData({ noneshow: true });
    }
    else {
      wx.navigateTo({
        url: '../search/search?key=' + this.data.searchvalue
      })
    }
  },

  handleTabChange(event){
    this.setData({ currentTab: event.detail });
  },
  
  gotoedit(){
    wx.navigateTo({
      url: '../plan/plan'
    })
  },
  changeInfo(){
    wx.navigateTo({
      url: '../changeinfo/changeinfo'
    })
  },
  messages(){
    wx.navigateTo({
      url: '../messages/messages'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var tabid = options.tabid;
    var id = wx.getStorageSync('id')
    this.setData({ currentTab: tabid,id:id });
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
    // datas.filter is not a function, 没有在首页登录的话就会没有storage，所以其他页面应该先检查一下登陆状态（以及后端）
    var date = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0')
    var currentTime = parseInt(new Date().getHours() + "" + (new Date().getMinutes()).toString().padStart(2, '0'))
    var that = this
    var id = wx.getStorageSync('id')
    var token = wx.getStorageSync('token')
    wx.request({
      url:'http://43.138.52.97:8001/user/getDetail/',
      header: {
        'Authorization': token
      },
      data:{
        'hostId': id,
        'customerId':id
      },
      method:'GET',
      success:function(res){
        var data = JSON.parse(res.data)
        that.setData({
          fans: data.followers,
          attention: data.followings,
          userInfo:{
            avatarUrl: data.avatarUrl,
            nickName: data.nickName,
            id:id,
            sign: data.signature
          },
          attentionnum:data.followings.length,
          fannum:data.followers.length,
        });
        wx.setStorageSync('fansId', that.data.fans)
        wx.setStorageSync('attentionId', that.data.attention)
      }
    })
    wx.request({
      url:'http://43.138.52.97:8001/schedule/todos/',
      header: {'Authorization': token},
      data:{
        'id': id,
        'date': date
      },
      method:'GET',
      success:function(res){
        var data = res.data
        var filteredTasks = data.filter(function(data) {
          var end = parseInt(data.end.replace(":", ""));
          return end > currentTime
        });
        filteredTasks.sort(function(a, b) {
          var startTimeA = parseInt(a.start.replace(":", ""));
          var startTimeB = parseInt(b.start.replace(":", ""));
          return startTimeA - startTimeB;
        });
        that.setData({
          todos: filteredTasks,
        });
      }
    })
    wx.request({
      url:'http://43.138.52.97:8001/schedule/getddl/',
      header: {'Authorization': token},
      data:{
        'id': id,
        'date': date,
        'range': 7
      },
      method:'GET',
      success:function(res){
        var data = res.data
        for(var i = 0; i < data.length; i++){
          data[i].date = data[i].date.split("/").slice(1).join("/")
        }
        that.setData({
          ddls: data,
        });
      }
    })
    wx.request({
      url:'http://43.138.52.97:8001/bbs/getPost/',
      header: {'Authorization': token},
      data:{
        id:id,
        type: 0
      },
      method:'GET',
      success:function(res){
        var data = res.data
        that.setData({
          bbsList1: data,
        });
      }
    })
    wx.request({
      url:'http://43.138.52.97:8001/message/getMessages/',
      header: {'Authorization': token},
      data:{
        id:id,
      },
      method:'GET',
      success:function(res){
        var data = res.data
        var unreadNum = 0
        for(var i = 0;i< data.length; i++){
          if(data[i].state == 0){
            unreadNum ++
          }
        }
        that.setData({
          noticeList: data,
          unreadNum: unreadNum
        });
      }
    })
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
  onexitClose() {
    this.setData({ exitshow: false });
  },
  exit_confirm(){
    this.setData({ exitshow: true });
  },
  
  loginExit(){
    wx.redirectTo({
      url: '../personalcenter/personalcenter'
    })
  }
})