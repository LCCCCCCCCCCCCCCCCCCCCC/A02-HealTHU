// pages/changehealth/changehealth.js
Page({

  /**
   * 页面的初始数据
   */
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
    }
  },
  ChangeHealthClick() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  change(){
    var bmiNumber = (this.data.update.weight*10000/this.data.update.height/this.data.update.height).toFixed(2);
    var date = new Date();
    var dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-'+ date.getDate();
    this.setData({
      'update.updateTime': dateString,
      'update.bmi': bmiNumber
    });
    // wx.setStorageSync('age', this.data.update.age);
    // wx.setStorageSync('height', this.data.update.height);
    // wx.setStorageSync('weight', this.data.update.weight);
    // wx.setStorageSync('bmi', this.data.update.bmi);
    wx.showToast({
      title: "修改成功",
      icon: "success"
    });
    // 后端更新数据（以及重新计算体测分数）
    // 想画变化曲线的话要后端都存起来x
    // 年龄的话还是根据生日计算比较合适？；性别的修改
  },
  // 需要把本页的data.update改为storage
  ChangeGender(event){
    this.setData({
      'update.gender': event.detail
    });
  },
  ChangeAge(event){
    this.setData({
      'update.age': event.detail
    });
  },
  ChangeHeight(event){
    this.setData({
      'update.height': event.detail
    });
  },
  ChangeWeight(event){
    this.setData({
      'update.weight': event.detail
    });
  },
  ChangeBeizhu(event){
    this.setData({
      'update.beizhu': event.detail
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