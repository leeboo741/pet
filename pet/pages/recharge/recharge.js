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
const PayManager = require("../../manager/payManager/payManager");

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
    PayManager.payRecharge(this.data.rechargeAmount, function(res){
      wx.showToast({
        title: "充值成功"
      })
    }, function(){
      wx.showToast({
        title: '充值失败',
        icon: 'none'
      })
    })
  },
})