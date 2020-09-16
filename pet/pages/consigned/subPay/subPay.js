// pages/consigned/subPay/subPay.js
import loginUtils from '../../../utils/loginUtils';
import util from '../../../utils/util.js';
import { RES_CODE_SUCCESS } from '../../../utils/config';
import commonOrderManager from '../../../manager/orderManager/commonOrderManager';
const Paymanager = require('../../../manager/payManager/payManager');
const ShareManager = require('../../../utils/shareUtils');
const app = getApp();
const PagePath = require('../../../utils/pagePath');

const Config = require("../../../utils/config");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoUrl: null,

    userRole: null, // 当前用户角色

    orderInfo: null, // 订单详情
    orderStationQrcodePath: null, // 当前订单所属站点的微信支付二维码

    orderNo: null, // 支付订单号

    shareOtherPayQRPath: null, // 分享人分享订单所属站点的微信支付二维码
    shareOtherPayType: null, // 分享人选择的支付类型 平台/商家

    ableOtherPay: false, // 是否允许代支付 (代支付进入不能二次代支付, 只有自己生成的订单才能发起代支付)

    otherPayType: [
      {
        typeName: '付款至平台',
        typeId: ShareManager.ShareOtherPayType_Platform,
        buttonName: '发送至客户支付',
      },
      {
        typeName: '线下付款',
        typeId: ShareManager.ShareOtherPayType_Business,
        buttonName: '发送至客户确认'
      }
    ], // 代支付类型列表
    currentOtherPayType: null, // 选中代支付类型
  },

  /**
   * 
   * @param {*} options 
   */
  getOrderDetail: function() {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    commonOrderManager.getOrderInfo(this.data.orderNo, function(success, data) {
      wx.hideLoading({
        success: (res) => {},
      })
      if (success) {
        that.setData({
          orderInfo: data,
        })
      } else {
        wx.showToast({
          title: '获取订单失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userRole: loginUtils.getUserInfo().role,
      currentOtherPayType: this.data.otherPayType[0],
      orderNo: options.orderno,
      ableOtherPay: !(app.ShareData.payOrderNo!=null&&app.ShareData.payOrderNo==options.orderno),
      shareOtherPayType: app.ShareData.shareOtherPayType
    })
    this.getOrderDetail();
  },

  /**
   * 点击完成支付
   */
  tapCompletePay: function() {
    let that = this;
    wx.showModal({
      title: '是否确认完成支付',
      content: '请确认客户是否已经支付到您的账户，该订单金额将不会进入余额流水！',
      confirmText: '确认完成',
      cancelText: '稍后确认',
      confirmColor: '#ee2c2c',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: PagePath.Path_Me_PaymentVoucher + "?orderno=" + that.data.orderInfo.orderNo,
          })
        } 
      }
    })
  },

  /**
   * 点击代支付
   */
  tapPayForOther: function() {
    wx.showLoading({
      title: '支付中...',
    })
    Paymanager.payOtherOrder(this.data.orderInfo.orderNo, loginUtils.getCustomerNo(),function(){
      wx.hideLoading()
      app.ShareData.payOrderNo = null;
      app.ShareData.payAmount = null;
      app.ShareData.payCustomerNo = null;
      app.ShareData.shareQRCodePath = null;
      app.ShareData.shareOtherPayType = null;
      app.globalData.showToBeShip = true;
      wx.switchTab({
        url: PagePath.Path_Me_Index,
      })
    }, function(){
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      })
    })
  },

  /**
   * 点击支付
   */
  tapPay: function(){
    wx.showLoading({
      title: '支付中...',
    })
    Paymanager.payOrder(this.data.orderInfo.orderNo, loginUtils.getCustomerNo(),function(){
      wx.hideLoading()
      app.globalData.showToBeShip = true;
      wx.switchTab({
        url: PagePath.Path_Me_Index,
      })
    }, function(){
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      })
    })
  },
  /**
   * 选择代支付类型
   * @param {*} e 
   */
  selectOtherPayType: function(e) {
    this.setData({
      currentOtherPayType: this.data.otherPayType[e.currentTarget.dataset.index]
    })
  },

  /**
   * 保存商家收款码
   * @param {*} path 收款码地址
   * @param {*} saveSuccessCallback 保存成功回调
   */
  saveQRCode: function(path, saveSuccessCallback) {
    let that = this;
    wx.showLoading({
      title: '保存中...',
    })
    wx.downloadFile({
      url: path,
      success(res) {
        if (res.statusCode == 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(saveRes) {
              wx.showModal({
                title:'保存完成,请前往支付',
                content: '请打开微信扫一扫 -> 选择商家收款码 -> 支付 -> 截图 -> 订单列表选择上传截图',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    if (util.checkIsFunction(saveSuccessCallback)) {
                      saveSuccessCallback(res)
                    }
                  }
                }
              })
            },
            complete(saveRes){
              wx.hideLoading()
            }
          })
        }
      },
      fail(res){
        wx.hideLoading()
        wx.showToast({
          title: '下载付款码失败',
          icon:'none'
        })
      },
    })
  },

  /**
   * 点击保存商家收款码
   */
  tapSaveQRCode: function(e) {
    console.log('保存商家收款码')
    this.saveQRCode(e.currentTarget.dataset.path, function(res){
      app.ShareData.payOrderNo = null;
      app.ShareData.payAmount = null;
      app.ShareData.payCustomerNo = null;
      app.ShareData.shareQRCodePath = null;
      app.ShareData.shareOtherPayType = null;
      wx.switchTab({
        url: PagePath.Path_Me_Index,
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
    if (app.globalData.paymentVoucherBackFlag) {
      if (app.globalData.paymentVoucherBackFlag == 'toTop') {
        wx.switchTab({
          url: PagePath.Path_Me_Index,
        })
        app.globalData.paymentVoucherBackFlag = null;
      }
    }
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
    console.log('shareAppMessage');
    return ShareManager.shareToOtherPay(this.data.orderInfo.orderNo, this.data.orderInfo.paymentAmount, this.data.orderInfo.station.collectionQRCode, this.data.currentOtherPayType.typeId);
  },
})