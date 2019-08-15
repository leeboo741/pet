// pages/orderDetail/orderDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestOrderDetail(options.orderno)
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
   * 点击图片
   */
  tapImage: function (e) {
    let tempOrder = this.data.orderData.stepList[e.currentTarget.dataset.stepindex];
    let currrentUrl = e.currentTarget.dataset.imageurl;
    wx.previewImage({
      urls: tempOrder.images,
      current: currrentUrl
    })
  },

  /**
   * 请求订单详情
   */
  requestOrderDetail: function(orderNo) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: app.url.url + app.url.orderDetail,
      data: {
        "orderNo": orderNo
      },
      success (res) {
        console.log("获取订单详情 success：\n" + JSON.stringify(res));
        if (res.data.root != null && res.data.prompt == "Success") {
          that.setData({
            orderData: res.data.root
          })
        } else {

        }
      },
      fail(res) {
        console.log("获取订单详情 fail：\n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("获取订单详情 complete：\n" + JSON.stringify(res));
        wx.hideLoading();
      },

    })
  },
})