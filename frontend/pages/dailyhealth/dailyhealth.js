// pages/sleep/sleep.js
const wxCharts = require('../../utils/wxcharts.js');
// var不行，const就行了x
var app = getApp();
var pieChart = null;
var lineChart = null;
var startPos = null;
var radarChart = null;
var columnChart = null;
var chartData = {
  lastmain: {
      data: [1, 0, 0, 0, 1, 2, 1, 2, 1.6, 1, 2, 2],
      categories: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23']
  },
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    lastNum: 10,
    wellNum: 6,
    lastHour: 12.6,
    lasting: 8,
    sleepHour: 6.1,
    heatNum: 27,
  },

  touchHandler: function (e) {
    lineChart.scrollStart(e);
},
touchHandler_pie: function (e) {
  console.log(pieChart.getCurrentDataIndex(e));
},      
moveHandler: function (e) {
    lineChart.scroll(e);
},
touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
        format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data 
        }
    });        
},
touchHandler_radar: function (e) {
  console.log(radarChart.getCurrentDataIndex(e));
},

createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 6; i++) {
        categories.push('12-' + (i + 1));
        data.push(Math.random()*(20-10)+4);
    }
    return {
        categories: categories,
        data: data
    }
}, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    var id = wx.getStorageSync('id')
    var date = new Date().getFullYear() + "/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getDate().toString().padStart(2, '0')
    var currentDate = date.split("/")
    var year = parseInt(currentDate[0]);
    var month = parseInt(currentDate[1]);
    var day = parseInt(currentDate[2]);
    var newDate = new Date(year, month - 1, day - 1);
    date = newDate.getFullYear() + "/" + (newDate.getMonth() + 1).toString().padStart(2, '0') + "/" + newDate.getDate().toString().padStart(2, '0')
    //var date = "2024/01/03"
    var sleepHour = wx.getStorageSync('sleepHour')
    var cal = wx.getStorageSync('cal').toFixed(0)
    this.setData({
      sleepHour:sleepHour,
      heatNum: cal
    })
    wx.request({
      url:'http://127.0.0.1:8000/schedule/todos/',
      data:{
        'id': id,
        'date': date
      },
      method:'GET',
      success:function(res){
        var data = res.data
        that.changeLastHour(data)
        that.changeLastNum(data)
        that.drawChart(data)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    
},
 drawChart(data){
  var windowWidth = 320;
    try {
        var res = wx.getSystemInfoSync();
        windowWidth = res.windowWidth;
    } catch (e) {
        console.error('getSystemInfoSync failed!');
    }
    
    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
        canvasId: 'lineCanvas',
        type: 'line',
        categories: simulationData.categories,
        animation: false,
        series: [{
            name: '打卡时长',
            data: simulationData.data,
            format: function (val, name) {
                return val.toFixed(1);
            }
        }],
        xAxis: {
            disableGrid: false
        },
        yAxis: {
            // title: '工作量趋势',
            format: function (val) {
                return val;
            },
            min: 0
        },
        width: windowWidth,
        height: 200,
        dataLabel: true,
        dataPointShape: true,
        enableScroll: true,
        legend: false,
        extra: {
            lineStyle: 'curve'
        }
    });
    var eatNum = data.filter(function(data) {
      return data.type == "饮食"
      }).length
    var sportNum = data.filter(function(data) {
      return data.type == "运动"
      }).length
    var courseNum = data.filter(function(data) {
        return data.type == "课程"
        }).length
    var actNum = data.filter(function(data) {
          return data.type == "活动"
        }).length
  pieChart = new wxCharts({
    animation: true,
    canvasId: 'pieCanvas-num',
    type: 'pie',
    series: [{
          name: '吃饭',
          data: eatNum,
      }, {
          name: '运动',
          data: sportNum,
      }, {
          name: '课程',
          data: courseNum,
      }, {
          name: '活动',
          data: actNum,
      }],
      width: windowWidth,
      height: 300,
      dataLabel: true,
  });
  this.changeChart(data)
  columnChart = new wxCharts({
    canvasId: 'columnCanvas',
    type: 'column',
    animation: true,
    categories: chartData.lastmain.categories,
    series: [{
        // name: '时间',
        data: chartData.lastmain.data,
        format: function (val, name) {
            return val.toFixed(1);
        }
    }],
    yAxis: {
        format: function (val) {
            return val;
        },
        min: 0,
    },
    xAxis: {
        disableGrid: false,
        type: 'calibration',
    },
    extra: {
        column: {
            width: 15
        }
    },
    width: windowWidth,
    height: 200,
    legend: false,
});

  radarChart = new wxCharts({
    canvasId: 'radarCanvas',
    type: 'radar',
    categories: ['堕落', '一般', '勤劳'],
    series: [{
        name: '每日工作量评估',
        data: [1, 2, 5]
    }],
    width: windowWidth,
    height: 220,
    legend: false,
    extra: {
        radar: {
            max: 7
        }
    }
});
 },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  changeLastHour(data){
    var res = 0
    for(var i = 0; i < data.length;i++){
      if(data[i].state == 1){
        var start = data[i].start.split(":")
        var end = data[i].end.split(":")
        res += (end[0]-start[0])*60 + (end[1]-start[1])
      }
    }
    res = (res / 60).toFixed(1)
    this.setData({
      lastHour:res
    })
  },
  changeLastNum(data){
    var lastNum = 0
    for(var i = 0; i < data.length;i++){
      if(data[i].state == 1){
        lastNum++
      }
    }
    this.setData({
      wellNum:data.length,
      lastNum:lastNum
    })
  },
  changeChart(data){
    console.log(data)
    var chartHour = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    for(var i = 0; i < data.length;i++){
      if(data[i].state == 1){
        var start = data[i].start.split(":")
        var end = data[i].end.split(":")
        start[0] = parseInt(start[0])
        start[1] = parseInt(start[1])
        end[0] = parseInt(end[0])
        end[1] = parseInt(end[1])
        if(start[0] == end[0]){
          chartHour[start[0]] += end[1] - start[1]
        }
        else{
          for(var j = start[0]; j <= end[0];j++ ){
            if(j == start[0]){
              chartHour[start[0]] += 60 - start[1]
            }
            else if(j == end[0]){
              chartHour[end[0]] += end[1]
            }
            else{
              chartHour[j] += 60
            }
          }
        }
      }
    }
    var newChart = [0,0,0,0,0,0,0,0,0,0,0,0]
    for(var i = 0;i<12;i++){
      newChart[i] = ((chartHour[2 * i] + chartHour[2 * i + 1]) / 60).toFixed(2)
    }
    chartData.lastmain.data = newChart
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