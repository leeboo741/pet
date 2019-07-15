// pages/consigned/selectCity/selectCity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    startCity: null,
    transport: null,
    cityType: null,
    citys:[
      "南昌",
      "北京",
      "南京",
      "昆明",
      "杭州",
      "广州",
      "深圳",
      "上海"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.cityType == "begin"){
      this.setData({
        title : "始发城市",
        transport: options.transport,
        cityType: options.cityType,
      })
    } else {
      this.setData({
        title: "目的城市",
        startCity: options.start,
        transport: options.transport,
        cityType: options.cityType,
      })
    }
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

  }
})