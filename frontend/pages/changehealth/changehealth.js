// pages/changehealth/changehealth.js
Page({
  data: {
    show: false,
    update:{
      updateTime: '2023-11-20',
      birthday: '2003/08/28',
      age:'20',
      height: '170',
      weight: '62.2',
      bmi: '21.52',
      grade: '60.7',
      thousand: '4:30',
      grade_thousand: '8.9',
      ehundred: '',
      grade_ehundred: '',
      gender: '男',
      fifty:'6.9',
      grade_fifty:'18',
      jump:'2.36',
      grade_jump:'15',
      sar:'10.6',
      grade_sar:'6',
      situp:'10',
      grade_situp:'10',
      pullup:'5',
      grade_pullup:'8',
      beizhu:''
    },
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
    if(typeof this.data.update.weight !== 'number' || typeof this.data.update.height !== 'number' || typeof this.data.update.age !== 'number'){
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
        'update.updateTime': dateString,
        'update.bmi': bmiNumber,
        'update.gender': current.gender,
        'update.age': current.age,
        'update.height': current.height,
        'update.weight': current.weight,
        'update.beizu': current.beizu,
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