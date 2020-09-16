// pages/premium/premium.js
const app = getApp();
const LoginUtil = require("../../utils/loginUtils.js");
const ShareUtil = require("../../utils/shareUtils.js");
const Util = require("../../utils/util.js");
const workOrderManager = require("../../manager/orderManager/workOrderManager.js");
const notificationCenter = require("../../manager/notificationCenter.js");
const { WORKORDER_ADD_PREMIUM } = require("../../static/notificationName.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: null, // 订单号
    amount: null, // 金额
    reason: null, // 补差价原因
    timeOutID: null,
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
    clearTimeout(this.data.timeOutID);
    this.data.timeOutID = null;
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
   * 输入金额
   */
  inputAmount: function (e) {
    this.data.amount = e.detail.value;
  },

  /**
   * 输入原因
   */
  inputReason: function (e) {
    this.data.reason = e.detail.value;
  },

  /**
   * 提交补价
   */
  tapAddPremium: function () {
    if (Util.checkEmpty(this.data.amount)) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
      return;
    }

    if (Util.checkEmpty(this.data.reason)) {
      wx.showToast({
        title: '请输入原因',
        icon: 'none'
      })
      return;
    }

    let tempData = {
      orderNo: this.data.orderNo,
      reason: this.data.reason,
      staff: { 
        staffNo: LoginUtil.getStaffNo()
      },
      amount: this.data.amount
    }

    this.requestPremium(tempData);
  },

  /**
   * 请求新增补价单
   */
  requestPremium: function(requestData) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    workOrderManager.addNewPremium(requestData, function(success, data) {
      wx.hideLoading({
        success: (res) => {},
      })
      if (success && data > 0) {
        wx.showToast({
          title: '补价成功',
        },1000)
        notificationCenter.postNotification(WORKORDER_ADD_PREMIUM);
        that.data.timeOutID = setTimeout(function () {
          wx.navigateBack();
        }, 1000)
      } else {
        wx.showToast({
          title: '补价失败',
          icon: 'none'
        })
      }
    })
  }
})