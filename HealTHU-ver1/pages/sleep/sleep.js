// pages/sleep/sleep.js
const wxCharts = require('../../utils/wxcharts.js');
// var不行，const就行了x
var app = getApp();
var columnChart = null;
var chartData = {
    main: {
        title: '一周睡眠时间',
        data: [7, 7, 8, 6, 6, 7, 6],
        categories: ['11-30', '12-1', '12-2', '12-3', '12-4', '12-5', '12-6']
    },
    sub: [
      {
        title: '11-30睡眠时间分布',
        data: [2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        categories: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23']
    }, {
        title: '12-1睡眠时间分布',
        data: [2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        categories: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23']
    }, {
        title: '12-2睡眠时间分布',
        data: [2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        categories: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23']
    }, {
        title: '12-3睡眠时间分布',
        data: [2, 2, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        categories: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23']                
    }, {
        title: '12-4睡眠时间分布',
        data: [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        categories: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23']
    }, {
      title: '12-5睡眠时间分布',
      data: [2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      categories: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23']
  }, {
    title: '12-6睡眠时间分布',
    data: [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    categories: ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23']
}
  ]
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chartTitle: '睡眠时间',
    isMainChartDisplay: true
  },
  backToMainChart: function () {
    this.setData({
        chartTitle: chartData.main.title,
        isMainChartDisplay: true
    });
    columnChart.updateData({
        categories: chartData.main.categories,
        series: [{
            name: 'sleep',
            data: chartData.main.data,
            format: function (val, name) {
                return val.toFixed(2) + '万';
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
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

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