// pages/sports/sports.js
Page({
  data: {
    currentstate: 0,
    onlyshow: false,
    beginshow: false,
    percentage: 78,
    percentage_real: 100,
    walknum: 3910,
    goal: 5000,
    today_cal: 7.5,
    gymList: [
      {title:"气膜馆", detail:"羽毛球场7:00~22:00", url:"../images/sqimo.png"},
      {title:"综合体育馆", detail:"羽毛球场13:00~22:30", url:"../images/szonghe.png"},
      {title:"西体育馆", detail:"羽毛球场11:30~22:30", url:"../images/sxi.png"},
      {title:"北体育馆", detail:"乒乓球场11:30~22:00", url:"../images/sbei.png"},
      {title:"紫荆学生区", detail:"网球场12:00~22:00", url:"../images/szijing.png"},
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
    return cal;
  },
  // 微信步数获取刷新
  today_replay(){
    var newwalk = this.data.walknum + Math.random()*50+10;
    var per = (newwalk/this.data.goal * 100);
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
      this.setData({ onlyshow:true });
    } else{
      this.setData({ 
        beginshow: true,
        currentstate: this.data.todos[id].state,
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  // TODO: 微信步数获取
    var per = (this.data.walknum/this.data.goal * 100);
    var cal = this.getcal();
    this.setData({
      percentage: per, 
      today_cal: cal,
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