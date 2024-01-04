// pages/changehealth/changehealth.js
Page({
  data: {
    show: false,
    updateTime: '2023/12/28',
    age:'20',
    gender: '男',
    beizhu:'',
    grade: '',
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
  },
  changeGender(){
    if(this.data.gender == "男"){
      this.setData({
        gender:"女"
      })
    }
    else{
      this.setData({
        gender:"男"
      })
    }
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
    var token = wx.getStorageSync('token')
    wx.request({
      url:'http://43.138.52.97:8001/thuInfo/getHealthInfo/',
      header: {'Authorization': token},
      data:{
        id:id
      },
      method:'GET',
      success:function(res){
        var data = res.data
        console.log(data)
        data.bmi = data.bmi.toFixed(2)
        that.setData({
          update:data
        })
        console.log(that.data.update)
        var grade = 0.15*that.data.update.grade_vitalCapacity + 0.2*that.data.update.grade_50m + 0.1*that.data.update.grade_sitreach + 0.1*that.data.update.grade_longjump + 0.1*(that.data.update.grade_pullup + that.data.update.grade_situp) + 0.2*(that.data.update.grade_800m + that.data.update.grade_1000m) 
        if(grade != 0){grade += 15}
        that.setData({
          grade:grade
        })
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