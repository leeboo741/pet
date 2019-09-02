// pages/consigned/coupon/coupon.js

const app = getApp();
const config = require("../../../utils/config.js");
const loginUtil = require("../../../utils/loginUtils.js");

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
    loginUtil.checkLogin(function alreadyLoginCallback() {
      that.requestCouponList();
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

  },

  /**
   * 请求优惠券列表
   */
  requestCouponList: function() {
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_GetCouponList,
      data: {
        openId: loginUtil.getOpenID()
      },
      success(res){
        console.log("获取优惠券 success => \n" + JSON.stringify(res));
        that.setData({
          couponList: res.data.data
        })
      },
      fail(res) {
        console.log("获取优惠券 fail => \n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("获取优惠券 complete => \n" + JSON.stringify(res));
      }
    })
  },

  /**
   * 领券
   */
  receiveCoupon: function(e){
    console.log("领取优惠券 :\n" + "优惠券id => " + e.currentTarget.dataset.couponid + "\nindex => " + e.currentTarget.dataset.couponindex);
    wx.scanCode({
      onlyFromCamera: true,
      success(res){
        console.log("扫码结果 success => \n" + JSON.stringify(res));
      },
      fail(res) {
        console.log("扫码结果 fail => \n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("扫码结果 complete => \n" + JSON.stringify(res));
      }
    })
  },
})