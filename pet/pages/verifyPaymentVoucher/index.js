const payManager = require("../../manager/payManager/payManager")
const util = require("../../utils/util")
const { RES_CODE_SUCCESS } = require("../../utils/config")

// pages/verifyPaymentVoucher/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null,
    feedback: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order: app.globalData.verifyPaymentVoucherOrder
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
   * 输入feedback
   * @param {input}} e 
   */
  inputFeedback: function(e) {
    this.data.feedback = e.detail.value
  },

  /**
   * 点击拒绝
   */
  tapReject: function() {
    this.verfiyPaymentVoucher(false, this.data.feedback, function(res) {
      if (res.code == RES_CODE_SUCCESS && res.data >= 1) {
        wx.navigateBack()
      } else {
        wx.showToast({
          title: '审核失败',
          icon: 'none'
        })
      }
    }, function(res) {
      wx.showToast({
        title: '链接失败',
        icon: 'none'
      })
    })
  },

  /**
   * 点击通过
   */
  tapVerify: function() {
    this.verfiyPaymentVoucher(true, null, function(res) {
      if (res.code == RES_CODE_SUCCESS && res.data >= 1) {
        wx.navigateBack()
      } else {
        wx.showToast({
          title: '通过失败',
          icon: 'none'
        })
      }
    }, function(res) {
      wx.showToast({
        title: '链接失败',
        icon: 'none'
      })
    })
  },

  /**
   * 审核
   */
  verfiyPaymentVoucher: function(result, feedback, successCallback, failCallback) {
    payManager.verifyPaymentVoucher(this.data.order.orderNo, result, feedback, function(res){
      if (util.checkIsFunction(successCallback)) {
        successCallback(res);
      }
    }, function(res) {
      if (util.checkIsFunction(failCallback)) {
        failCallback(res);
      }
    })
  }
})