// pages/sleep/sleep.js
const wxCharts = require('../../utils/wxcharts.js');
// var不行，const就行了x
var app = getApp();
var pieChart = null;
var lineChart = null;
var startPos = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    lastNum: 10,
    lastHour: 13.6,
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
createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 6; i++) {
        categories.push('12-' + (i + 1));
        data.push(Math.random()*(20-10)+3);
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
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
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
            name: '工作量',
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
        height: 180,
        dataLabel: true,
        dataPointShape: true,
        enableScroll: true,
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