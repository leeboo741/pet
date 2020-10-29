// pages/paymentVoucher/index.js

const Config = require("../../utils/config");
const { RES_CODE_SUCCESS } = require("../../utils/config");
const util = require("../../utils/util");
const workOrderManager = require("../../manager/orderManager/workOrderManager");
const notificationCenter = require("../../manager/notificationCenter");
const { WORKORDER_UPLOAD_PAYMENT_VOUCHER } = require("../../static/notificationName");
const shareUtils = require("../../utils/shareUtils");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    paymentVoucher: null, // 付款凭证
    orderNo: null, // 订单编号
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
    return shareUtils.getOnShareAppMessageForShareOpenId();
  },

  /**
   * 选择付款凭证
   */
  tapSelectPaymentVoucher: function() {
    let that = this;
    wx.chooseImage({
      count: 1,
      success(res) {
        that.setData({
          paymentVoucher: res.tempFilePaths[0]
        })
        that.uploadImageFile();
      },
    })
  },

  /**
   * 上传付款凭证
   */
  uploadImageFile: function() {
    console.log('上传图片');
    let that = this;
    wx.showLoading({
      title: '上传中...',
    })
    wx.uploadFile({
      filePath: this.data.paymentVoucher,
      name: 'multipartFile',
      url: Config.URL_Service + Config.URL_Upload,
      header: { "Content-Type": "multipart/form-data" },
      success(res) {
        wx.hideLoading()
        if (typeof res.data == 'string') {
          res.data = JSON.parse(res.data);
        }
        if (res.data.code == 10000) {
          that.setData({
            paymentVoucher: res.data.root[0].fileAddress
          })
        } else {
          wx.showToast({
            title: '上传失败 ' + res.data.code,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      },
      complete(res) {
      }
    })
  },

  /**
   * 点击提交
   */
  tapCommit: function() {
    console.log('订单编号:', this.data.orderNo, '凭证地址:', this.data.paymentVoucher);
    wx.showLoading({
      title: '提交中...',
    })
    workOrderManager.submitPaymentVoucher(this.data.orderNo, this.data.paymentVoucher, function(success, data) {
      wx.hideLoading({
        success: (res) => {},
      })
      if (success && data > 0) {
        app.globalData.paymentVoucherBackFlag = 'toTop'
        wx.navigateBack()
        notificationCenter.postNotification(WORKORDER_UPLOAD_PAYMENT_VOUCHER);
      } else {
        wx.showToast({
          title: '提交失败',
          icon: 'none'
        })
      }
    })
  }
})