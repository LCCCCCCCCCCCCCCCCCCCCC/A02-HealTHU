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
    lastHour: 12.6,
    lasting: 8,
    waiting: 2,
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
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

  pieChart = new wxCharts({
    animation: true,
    canvasId: 'pieCanvas-num',
    type: 'pie',
    series: [{
          name: '吃饭',
          data: 2,
      }, {
          name: '运动',
          data: 1,
      }, {
          name: '完成ddl',
          data: 3,
      }, {
          name: '课程',
          data: 3,
      }, {
          name: '活动',
          data: 1,
      }],
      width: windowWidth,
      height: 300,
      dataLabel: true,
  });

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