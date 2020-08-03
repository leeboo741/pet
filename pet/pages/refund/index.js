// pages/refund/index.js

const Config = require("../../utils/config.js");
const LoginUtil = require("../../utils/loginUtils.js");
const ShareUtil = require("../../utils/shareUtils");
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
    wx.request({
      url: Config.URL_Service + Config.URL_OrderRefund,
      data: {
        order: {
          orderNo: this.data.orderNo,
        },
        staff: {
          staffNo: LoginUtil.getStaffNo(),
        },
        serviceFeeAmount: this.data.serviceAmount==null?0:this.data.serviceAmount,
        refundReason: this.data.refundReason
      },
      method: "POST",
      success(res) {
        console.log("申请退款 success: \n" + JSON.stringify(res));

        if (res.data.code == Config.RES_CODE_SUCCESS) {
          if (res.data.data > 0) {

            wx.navigateBack({

            })
            // wx.showToast({
            //   title: '提交成功',
            //   duration: 1500,
            // })
            // that.data.backTimeout = setTimeout(
            //   function (res) {
            //     wx.navigateBack({
                  
            //     })
            //   },
            //   1550
            // )
          }
        }
      },
      fail(res) {
        console.log("申请退款 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: 'none'
        })
      },
      complete(res) {
        that.setData({
          submiting: false
        })
      }
    })
  }
})