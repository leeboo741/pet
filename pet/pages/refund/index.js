// pages/refund/index.js

const ShareUtil = require("../../utils/shareUtils");
const workOrderManager = require("../../manager/orderManager/workOrderManager.js");
const notificationCenter = require("../../manager/notificationCenter");
const { WORKORDER_REFUND } = require("../../static/notificationName");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: null,

    serviceAmount: null,
    refundReason: null,

    backTimeout : null,

    submiting: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNo: options.orderno
    })
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
    clearTimeout(this.data.backTimeout);
    this.data.backTimeout = null;
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

    return ShareUtil.getOnShareAppMessageForShareOpenId();
  },

  /**
   * 输入扣减服务费
   */
  inputServiceAmount: function (e) {
    this.setData({
      serviceAmount: e.detail.value
    })
  },

  /**
   * 输入退款原因
   */
  inputReason: function(e) {
    this.setData({
      refundReason: e.detail.value
    })
  },

  /**
   * 点击提交
   */
  tapSubmit: function() {
    if (this.data.submiting) {
      return;
    }
    this.requestSubmit();
  },

  /**
   * 请求提交
   */
  requestSubmit: function() {
    this.setData({
      submiting: true
    })
    let that = this;
    workOrderManager.submitRefund(this.data.orderNo, this.data.serviceAmount, this.data.refundReason, function(success, data) {
      that.setData({
        submiting: false
      })
      if (success && data > 0) {
        notificationCenter.postNotification(WORKORDER_REFUND);
        wx.navigateBack()
      } else {
        wx.showToast({
          title: '申请退款失败',
          icon: 'none'
        })
      }
    })
  }
})