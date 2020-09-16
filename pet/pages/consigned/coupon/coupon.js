// pages/consigned/coupon/coupon.js

const app = getApp();
const config = require("../../../utils/config.js");
const loginUtil = require("../../../utils/loginUtils.js");
const pagePath = require("../../../utils/pagePath.js");
const ShareUtil = require("../../../utils/shareUtils.js");
const couponManager = require("../../../manager/couponManager/couponManager.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: [], // 优惠券列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestCouponList(); 
      }
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
    console.log("/coupon/coupon 销毁")
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
   * 请求优惠券列表
   */
  requestCouponList: function() {
    let that = this;
    couponManager.getCouponList(function(success, data){
      if (success) {
        that.setData({
          couponList: data
        })
      } else {
        wx.showToast({
          title: '获取优惠券失败',
          icon: "none"
        })
      }
    })
  },

  /**
   * 用券
   */
  tapUseCoupon: function (e) {
    let tempIndex = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: pagePath.Path_Order_Coupon_QRCode + '?couponcode=' + this.data.couponList[tempIndex].couponNo,
    })
  }
})