/**
 * ******** 充值 ********
 * ===================================================================================================================================
 * 
 * ===================================================================================================================================
 */

const app = getApp();
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const pagePath = require("../../utils/pagePath.js");
const ShareUtil = require("../../utils/shareUtils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rechargeAmount: 0, // 充值金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    console.log("/recharge/recharge 销毁")
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
   * 金额输入
   */
  amountInput: function(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        rechargeAmount: parseFloat(e.detail.value)
      })
    } else {
      this.setData({
        rechargeAmount: 0
      })
    }
  },

  /**
   * 充值
   */
  recharge: function() {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestRecharge();
      } else {
        wx.showModal({
          title: '暂未登录',
          content: '请先登录后使用该功能',
          success(res) {
            if (res.confirm) {
              loginUtil.login();
            }
          }
        })
      }
    })
  },

  /**
   * 请求充值
   */
  requestRecharge: function() {
    wx.showLoading({
      title: '支付中...',
    })
    wx.request({
      url: config.URL_Service + config.URL_Recharge,
      data: {
        customerNo: loginUtil.getCustomerNo(),
        rechargeAmount: this.data.rechargeAmount,
        appType: loginUtil.getAppType()
      },
      success(res) {
        wx.hideLoading();
        console.log("充值 success => \n" + JSON.stringify(res))
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
        })
      },
      fail(res) {
        wx.hideLoading();
        console.log("充值 fail => \n" + JSON.stringify(res))
        wx.showToast({
          title: '网络问题，支付失败',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("充值 complete => \n" + JSON.stringify(res))
      },
    })
  },
})