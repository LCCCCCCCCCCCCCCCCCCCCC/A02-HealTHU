// pages/sports/sports.js
Page({
  data: {
    currentid: 0,
    onlyshow: false,
    endshow: false,
    startshow: false,
    percentage: 78,
    text:"",
    percentage_real: 100,
    walknum: 2000,
    goal: 5000,
    today_cal: 7.5,
    gymList: [
      {title:"综合体育馆", detail:"羽毛球场11:00~12:00", url:"../images/szonghe.png"},
      {title:"西体育馆", detail:"篮球场15:00~17:00", url:"../images/sxi.png"},
    ],
    todos: [
      {title:"晨跑", start:"9:00", end:"9:15", label:"紫荆操场", state: 1},
      {title:"集体锻炼", start:"17:00", end:"18:00", label:"紫荆操场东南角", state: 2},
      {title:"月光长骑", start:"22:00", end:"22:30", label:"3km", state: 0},
    ]
  },

  // 热量换算
  getcal() {
    var cal = 0.03*this.data.walknum;
    for(var i = 0;i<this.data.todos.length;i++){
      if(this.data.todos[i].state == 1){
        var start = this.data.todos[i].start.split(":")
        var end = this.data.todos[i].end.split(":")
        cal += ((end[0] - start[0])*60+ (end[1] - start[1])) * 500 / 60
      }
    }
    wx.setStorageSync('cal', cal)
    return cal;
  },
  // 微信步数获取刷新
  today_replay(){
    var newwalk = this.data.walknum + Math.random()*50+10;
    var per = (newwalk/this.data.goal * 100).toFixed(2);
    if(per>100){per = 100}
    var cal = this.getcal();
    this.setData({ 
      today_cal: cal,
      walknum: newwalk,
      percentage: per,
    });
  },
  handleBegin(event) {
    const id = event.currentTarget.dataset.id;
    if(this.data.todos[id].state == 1){
      this.setData({ 
        onlyshow:true,
        text:"运动时间" + this.data.todos[id].start + "-" + this.data.todos[id].end
       });
    } else if(this.data.todos[id].state == 2){
      var nowTime = new Date().getHours() + ":" + (new Date().getMinutes()).toString().padStart(2, '0')
      this.setData({ 
        endshow: true,
        text: "当前时间" + nowTime + ",是否结束运动?",
        currentid: id,
      });
    }
    else{
      this.setData({ 
        startshow:true,
        text:"计划运动时间" + this.data.todos[id].start + "-" + this.data.todos[id].end + ",请按时完成"
      });
    }
  },
  confirm(event){
    const id = this.data.currentid;
    var userId = wx.getStorageSync('id')
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url:'http://127.0.0.1:8000/schedule/doTodo/',
      header:{ 'content-type': 'application/x-www-form-urlencoded','Authorization': token},
      data:{
        id: userId,
        title: that.data.todos[id].title,
        date: that.data.todos[id].date,
        start: that.data.todos[id].start,
        end: that.data.todos[id].end,
      },
      method:'POST',
      success:function(res){
        that.onLoad()//刷新页面
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    var id = wx.getStorageSync('id')
    var date = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0')
    var token = wx.getStorageSync('token')
    wx.request({
      url:'http://127.0.0.1:8000/schedule/todos/',
      header: {'Authorization': token},
      data:{
        'id': id,
        'date': date
      },
      method:'GET',
      success:function(res){
        var data = res.data
        var filteredTasks = data.filter(function(data) {
          return data.type == "运动"
        });
        filteredTasks.sort(function(a, b) {
          var startTimeA = parseInt(a.start.replace(":", ""));
          var startTimeB = parseInt(b.start.replace(":", ""));
          return startTimeA - startTimeB;
        });
        var nowTime = new Date().getHours() + ":" + (new Date().getMinutes()).toString().padStart(2, '0')
        nowTime = parseInt(nowTime.replace(":",""))
        for(var i = 0;i<filteredTasks.length;i++){
          var start = parseInt(filteredTasks[i].start.replace(":", ""))
          var end = parseInt(filteredTasks[i].end.replace(":", ""))
          if(((start<=nowTime)&&(end>=nowTime)&&(filteredTasks[i].state == 0))){
            filteredTasks[i].state = 2
          }
        }
        that.setData({
          todos: filteredTasks,
        });
        var per = (that.data.walknum/that.data.goal * 100).toFixed(2);
        if(per>100){per = 100}
        var cal = that.getcal();
        that.setData({
          percentage: per, 
          today_cal: cal,
        });
      }
    })
  // TODO: 微信步数获取
    
  },
  toGym(){
    wx.navigateTo({
      url: '../gym/gym',
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