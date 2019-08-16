// pages/station/station.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stationList:[
      {
        stationName: "南昌第一站点",
        stationAddress: "江西省南昌市青山湖区北京东路1666号",
        stationImages: null,
        stationLogo: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565613260260&di=f71dd50782dbd2ac7b1279d1f93a6ebd&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F12%2F39%2F63%2F93u58PICEMQ.jpg",
        stationPhone: '0791-32219342',
        stationBusinessHours: "08:00-22:00",
      }
    ],
    location:null, // 位置信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestLocation();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 拨打电话
   */
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenumber,
    })
  },

  /**
   * 请求当前位置
   */
  requestLocation: function() {
    wx.showLoading({
      title: '请稍等...',
    })
    if (this.data.location) {
      this.requestStation();
    } else {
      let that = this;
      wx.getLocation({
        type: "gcj02",
        success: function (res) {
          console.log("------------ 定位成功 ------------");
          console.log(res);
          // 将经纬度交给 globalData 保管
          const latitude = res.latitude;
          const longitude = res.longitude;  
          that.data.location = {};
          that.data.location.latitude = latitude;
          that.data.location.longitude = longitude;
          that.requestStation();
        },
        fail: function (res) {
          wx.showToast({
            title: '定位失败,请重新再试',
            icon: 'none'
          })
        },
      })
    }
  },

  /**
   * 请求数据
   */
  requestStation: function () {
    const latitude = this.data.location.latitude;
    const longitude = this.data.location.longitude;
    wx.hideLoading();
  },

})