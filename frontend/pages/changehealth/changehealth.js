// pages/changehealth/changehealth.js
Page({
  data: {
    show: false,
    updateTime: '2023/12/28',
    age:'20',
    gender: '男',
    beizhu:'',
    grade: '70.8',
    update:{},
    current:{
      age:'20',
      height: '170',
      weight: '62.2',
      gender: '男',
      beizhu:''
    }
  },
  ChangeHealthClick() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  change(){
    if(typeof this.data.update.weight !== 'number' || typeof this.data.update.height !== 'number' || typeof this.data.age !== 'number'){
      wx.showToast({
        title: "输入数据不合法",
        icon: "none"
      });
    }
    else{
      var bmiNumber = (this.data.update.weight*10000/this.data.update.height/this.data.update.height).toFixed(2);
      var date = new Date();
      var dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-'+ date.getDate();
      this.setData({
        'updateTime': dateString,
        'update.bmi': bmiNumber,
        'gender': current.gender,
        'age': current.age,
        'update.height': current.height,
        'update.weight': current.weight,
        'beizu': current.beizu,
      });
      wx.showToast({
        title: "修改成功",
        icon: "success"
      });
    }

    // 后端更新数据（以及重新计算体测分数）
    // 想画变化曲线的话要后端都存起来x
  },
  ChangeGender(event){
    this.setData({
      'current.gender': event.detail
    });
  },
  ChangeAge(event){
    this.setData({
      'current.age': event.detail
    });
  },
  ChangeHeight(event){
    this.setData({
      'current.height': event.detail
    });
  },
  ChangeWeight(event){
    this.setData({
      'current.weight': event.detail
    });
  },
  ChangeBeizhu(event){
    this.setData({
      'current.beizhu': event.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var id = wx.getStorageSync('id')
    var that = this
    wx.request({
      url:'http://127.0.0.1:8000/thuInfo/getHealthInfo/',
      data:{
        id:id
      },
      method:'GET',
      success:function(res){
        var data = res.data
        data.bmi = data.bmi.toFixed(2)
        that.setData({
          update:data
        })
        that.setData
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