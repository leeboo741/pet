// pages/paymentVoucher/index.js

const Config = require("../../utils/config");
const { RES_CODE_SUCCESS } = require("../../utils/config");
const util = require("../../utils/util");

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
        console.log(res);
        if (typeof res.data == 'string') {
          res.data = JSON.parse(res.data);
        }
        that.setData({
          paymentVoucher: res.data.root[0].fileAddress
        })
        wx.hideLoading()
      },
      fail(res) {
        console.log(res);
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
    wx.request({
      url: Config.URL_Service + Config.URL_Add_PaymentVoucher,
      data: {
        orderNo: this.data.orderNo,
        paymentVoucher: this.data.paymentVoucher
      },
      success(res) {
        console.log(res);
        wx.hideLoading()
        if (res.data.code == RES_CODE_SUCCESS && res.data.data == 1) {
          wx.navigateBack()
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '链接失败',
          icon: 'none'
        })
      }
    })
  }
})