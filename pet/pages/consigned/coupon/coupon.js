// pages/consigned/coupon/coupon.js

const app = getApp();
const config = require("../../../utils/config.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: [
      {
        name: "限时最高满￥700减￥150",
        imagePath: null,
        title: "您有一份优惠券待领取"
      },
      {
        name: "全场通用打5折",
        imagePath: null,
        title: "您有一份优惠券待领取"
      },
      {
        name: "全场食品类买一送五",
        imagePath: null,
        title: "您有一份优惠券待领取"
      },
    ], // 优惠券列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestCouponList();
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
   * 请求优惠券列表
   */
  requestCouponList: function() {
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_GetCouponList,
      data: {
        openId: app.globalData.userInfo.openid
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