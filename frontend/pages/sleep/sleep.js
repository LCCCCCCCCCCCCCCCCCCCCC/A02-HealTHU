// pages/sleep/sleep.js
const wxCharts = require('../../utils/wxcharts.js');
// var不行，const就行了x
var app = getApp();
var columnChart = null;
var chartData = {}
var tofix = [
  {date: "2023-12-30", data: [2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0]},
  {date: "2023-12-31", data: [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 2]},
  {date: "2024-01-01", data: [2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0]},
  {date: "2024-01-02", data: [2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0]},
  {date: "2024-01-03", data: [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1]},
  {date: "2024-01-04", data: [2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0]},
  {date: "2024-01-05", data: [2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0]},
  {date: "2024-01-06", data: [2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0]},
]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lasttime: '2023-12-6 0:53',
    chartTitle: '近七日睡眠时间',
    isMainChartDisplay: true,
    sleepHour: 0,
    score:"",
    isShort:false,//睡眠时间是否不足
    isLate:false,//是否熬夜
    isSleep: false,
    startDate:'2024/01/02',
    startHour:22,
    endDate:'2024/01/03',
    endHour:6,
    sleepDaily:[],
    sleepData:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    sleepData2:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  startSleep(){
    var date = new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "-" + new Date().getDate().toString().padStart(2, '0')
    var currentHour = new Date().getHours()
    if(new Date().getMinutes > 30){
      currentHour ++
    }
    this.setData({
      lasttime: date + ' ' + new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0'),
      isSleep:true,
      startDate: date,
      startHour: currentHour
    })
    this.saveState()
    var sleepData = [0,0,0,0,0,0,0,0,0,0,0,0]
    //播放音乐
  },
  endSleep(){
    var date = new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "-" + new Date().getDate().toString().padStart(2, '0')
    var currentHour = new Date().getHours()
    if(new Date().getMinutes > 30){
      currentHour ++
    }
    this.setData({
      isSleep:false,
      endDate: date,
      endHour: currentHour
    })
    //提前获取start天的sleepData
    var sleepData = [0,0,0,0,0,0,0,0,0,0,0,0]
    for(var i = 0; i < 8; i++){
      if(this.data.sleepDaily[i].date == this.data.startDate){
        sleepData = this.data.sleepDaily[i].data
      }
    }
    sleepData = sleepData.split(",")
    var sleepHour = 0
    if(this.data.startDate == this.data.endDate){
      for(var i = this.data.startHour;i<this.data.endHour;i++){
        sleepHour++
        if(i == 0){sleepData[0] ++}
        else{sleepData[((i-1)/2).toFixed(0)] ++}
      }
      //向后端传入修改指令
      this.setData({
        lasttime: date + ' ' + new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0'),
        sleepData:sleepData,
        sleepHour:sleepHour
      })
      this.saveSleep(this.data.startDate,sleepData)
    }
    else if(this.isnext(this.data.startDate,this.data.endDate)){//睡眠一天以内
      //提前获取start天的sleepData
      for(var i = this.data.startHour;i<24;i++){
        sleepHour++
        if(i == 0){sleepData[0] ++}
        else{sleepData[((i-1)/2).toFixed(0)] ++}
      }
      //向后端传入修改指令
      this.setData({
        sleepData:sleepData,
      })
      this.saveSleep(this.data.startDate,sleepData)
      sleepData = [0,0,0,0,0,0,0,0,0,0,0,0]
      for(var i = 0;i<this.data.endHour;i++){
        sleepHour++
        if(i == 0){sleepData[0] ++}
        else{sleepData[((i-1)/2).toFixed(0)] ++}
      }
      //向后端传入修改指令
      this.setData({
        lasttime: date + ' ' + new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0'),
        sleepData2:sleepData,
        sleepHour:sleepHour
      })
      this.saveSleep(this.data.endDate,this.data.sleepData2)
    }
    else{
      wx.showToast({ title: '睡眠时间超过一天，记录无效', icon: 'none' });
    }
    this.saveState()
  },
  backToMainChart: function () {
    this.setData({
        chartTitle: chartData.main.title,
        isMainChartDisplay: true
    });
    this.getscore()
    columnChart.updateData({
        categories: chartData.main.categories,
        series: [{
            name: 'sleep',
            data: chartData.main.data,
            format: function (val, name) {
                return val.toFixed(1);
            }
        }]
    });
},
touchHandler: function (e) {
    var index = columnChart.getCurrentDataIndex(e);
    if (index > -1 && index < chartData.sub.length && this.data.isMainChartDisplay) {
        this.setData({
            chartTitle: chartData.sub[index].title,
            isMainChartDisplay: false
        });
        columnChart.updateData({
            categories: chartData.sub[index].categories,
            series: [{
                name: 'sleep',
                data: chartData.sub[index].data,
                format: function (val, name) {
                    return val.toFixed(1);
                }
            }]
        });

    }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var id = wx.getStorageSync('id')
    var that = this
    var date = new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "-" + new Date().getDate().toString().padStart(2, '0')
    wx.request({
      url:'http://127.0.0.1:8000/sleep/getSleep/',
      data:{
        'id': id,
        'date': date
      },
      method:'GET',
      success:function(res){
        var label = Object.keys(res.data)
        var data = []
        for(var i = 0;i<label.length;i++){
          var newlabel = {}
          newlabel.date = label[i]
          newlabel.data = res.data[label[i]]
          data[7 - i] = newlabel
        }
        var lastTime = wx.getStorageSync('lastTime')
        var sleepHour = wx.getStorageSync('sleepHour')
        var isSleep = wx.getStorageSync('isSleep')
        var startDate = wx.getStorageSync('startDate')
        var startHour = wx.getStorageSync('startHour')
        that.setData({
          sleepDaily: data,
          lasttime: lastTime,
          sleepHour: sleepHour,
          isSleep: isSleep,
          startDate: startDate,
          startHour: startHour
        })
        that.drawChart()
      }
    })
   this.drawChart()
  },
  drawChart(){
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    //chartData = this.tochart(tofix)
    chartData = this.tochart(this.data.sleepDaily)
    columnChart = new wxCharts({
        canvasId: 'columnCanvas',
        type: 'column',
        animation: true,
        categories: chartData.main.categories,
        series: [{
            name: 'sleep',
            data: chartData.main.data,
            format: function (val, name) {
                return val.toFixed(1);
            }
        }],
        yAxis: {
            format: function (val) {
                return val;
            },
            // title: 'hello',
            min: 0
        },
        xAxis: {
            disableGrid: false,
            type: 'calibration'
        },
        extra: {
            column: {
                width: 15
            }
        },
        width: windowWidth,
        height: 200,
    });
    this.getscore()
  },
  getscore(){
    var lengthScore = 0//睡眠时长评分
    var timeScore = 0//睡眠时间评分
    var scores = [0,0,0,0,0,0,0]
    for(var i = 0;i < 7;i++){
      scores[i] = chartData.main.data[i] / 8
      if(scores[i]>1){
        scores[i] = 1
      }
    }
    lengthScore = (scores[6]*0.5 + scores[5]*0.3 + scores[4]*0.1 + scores[3]*0.04 + scores[2]*0.02 + scores[1]*0.01 + scores[0]*0.01) * 60
    if(lengthScore < 52.5){
      this.setData({
        isShort:true
      })
    }
    for(var i = 0;i < 7;i++){
      var data = chartData.sub[i].data
      scores[i] = 1
      if(data[11] < 1){scores[i] -= 0.2}
      if(data[0] < 2){scores[i] -= (2-data[0]) * 0.2}
      if(data[1] < 2){scores[i] -= (2-data[1]) * 0.2}
    }
    timeScore = (scores[6]*0.5 + scores[5]*0.3 + scores[4]*0.1 + scores[3]*0.04 + scores[2]*0.02 + scores[1]*0.01 + scores[0]*0.01) * 40
    if(timeScore < 30){
      this.setData({
        isLate:true
      })
    }
    this.setData({
      score:(lengthScore+timeScore).toFixed(2)
    })
  },
  saveState(){//保存临时睡眠状态
    wx.setStorageSync('lastTime', this.data.lasttime)
    wx.setStorageSync('sleepHour', this.data.sleepHour)
    wx.setStorageSync('isSleep', this.data.isSleep)
    wx.setStorageSync('startDate', this.data.startDate)
    wx.setStorageSync('startHour', this.data.startHour)
    this.onLoad()
  },
  saveSleep(date,data){
    var id = wx.getStorageSync('id')
    var that = this
    console.log(date)
    console.log(data)
    wx.request({
      url:'http://127.0.0.1:8000/sleep/changeSleep/',
      data:{
        id:id,
        date: date,
        data: data
      },
      header:{ 'content-type': 'application/x-www-form-urlencoded'},
      method:'POST',
      success:function(res){
        that.onLoad()
      }
    })
  },
  isnext(startDate,endDate){//判断后者是否为前者的后一天
    var currentDate = startDate.split("-");
    var year = parseInt(currentDate[0]);
    var month = parseInt(currentDate[1]);
    var day = parseInt(currentDate[2]);
    var newDate = new Date(year, month - 1, day + 1);
    var newYear = newDate.getFullYear();
    var newMonth = (newDate.getMonth() + 1).toString().padStart(2, '0');
    var newDay = newDate.getDate().toString().padStart(2, '0');
    var dateString = newYear + '-' + newMonth + '-' + newDay;
    return (endDate == dateString)
  },
  tochart(dailys){
    var chart = {}
    var main = {}
    main.title = "近七日睡眠时间"
    main.data = [0,0,0,0,0,0,0]
    main.categories = []
    var sub = []
    for(var i = 0;i < 7;i++){
      sub[i] = {}
      var dates = dailys[i].date.split("-")
      var shortDate = dates[1] + "-" + dates[2]
      sub[i].title = shortDate + "睡眠时间分布"
      sub[i].data = dailys[i].data
      sub[i].categories = ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23']
      for(var j = 0;j < 12; j++){
        main.data[i] += sub[i].data[j]
      }
      main.categories[i] = shortDate
    }
    chart.sub = sub
    chart.main = main
    return chart
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