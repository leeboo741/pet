// pages/consigned/subPay/subPay.js
import drawQrcode from '../../../libs/weapp.qrcode.esm.js';
const Paymanager = require('../../../manager/payManager/payManager');
const ShareManager = require('../../../utils/shareUtils')
const app = getApp();

const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;
// 300rpx 在6s上为 150px
const qrcode_w = 440 / rate;
const qrcode_image_w = 80 / rate;
const qrcode_image_dx = 180 / rate;
const qrcode_padding = 12 / rate;
qrcode_w: qrcode_w,
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodePath: null,
    paymentAmount: 0,
    orderNo: null,
    customerNo: null,
    imageWidth: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      paymentAmount: options.amount,
      orderNo: options.orderno,
      customerNo: options.customerno,
      imageWidth: qrcode_w,
    })

    this.loadQRCode();
  },

  /**
   * 加载二维码
   */
  loadQRCode: function () {
    let codeStr = "?orderno=" + this.data.orderNo + "&customerno=" + this.data.customerNo + "&paymentamount=" + this.data.paymentAmount;
    let that = this;
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'canvas',
      text: codeStr,
      image: {
        dx: qrcode_image_dx,
        dy: qrcode_image_dx,
        dWidth: qrcode_image_w,
        dHeight: qrcode_image_w,
      },
      callback: () => {
        //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
        setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'canvas',
            success: function (res) {
              var tempFilePath = res.tempFilePath;
              that.setData({
                qrcodePath: tempFilePath
              })
            }
          },that);
        }, 0);
      },
    })
  },

  /**
   * 点击支付
   */
  tapPay: function(){
    Paymanager.payOrder(this.data.orderNo, function(){
      app.globalData.showToBeShip = true;
      wx.switchTab({
        url: pagePath.Path_Me_Index,
      })
    }, function(){
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      })
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
    return ShareManager.shareToOtherPay(this.data.orderNo, this.data.paymentAmount, this.data.qrcodePath);
  }
})