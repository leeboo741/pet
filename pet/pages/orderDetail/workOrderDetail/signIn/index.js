// pages/orderDetail/workOrderDetail/signIn/index.js

const { URL_Service, URL_UploadFile } = require("../../../../utils/config");
const notificationCenter = require("../../../../manager/notificationCenter");
const { WORKORDER_SIGNIN } = require("../../../../static/notificationName");
const util = require("../../../../utils/util");
const commonOrderManager = require("../../../../manager/orderManager/commonOrderManager");
const shareUtils = require("../../../../utils/shareUtils");

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    order: null,

    // 上传
    uploadUrl: null,
    formData: null,

    imagePathList: [], // 图片

    signInDisable: true,
    signInLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let formData = {
      "orderNo": app.globalData.workOrder.orderNo,
      "sn": app.globalData.workOrder.orderStates[app.globalData.workOrder.orderStates.length - 1].sn,
      "orderType": app.globalData.workOrder.orderStates[app.globalData.workOrder.orderStates.length - 1].orderType
    };
    this.setData({
      uploadUrl: URL_Service + URL_UploadFile,
      order: app.globalData.workOrder,
      formData: formData,
    })  
  },

  /**
   * 入港操作
   */
  tapSignIn: function(){
    let that = this;
    if (!this.data.signInLoading) {
      this.buttonLoading(true);
      this.requestUnPayPremiumCount(this.data.order.orderNo, function(count) {
        if (count > 0) {
          that.buttonLoading(false);
          wx.showModal({
            title: '还有未支付补价单',
            content: '完成补价后再执行该操作',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          })
        } else {
          that.requestSignIn(function(){
            that.buttonLoading(false);
            notificationCenter.postNotification(WORKORDER_SIGNIN);
            wx.navigateBack();
          });
        }
      })
    }
  },

  /**
   * 上传完成
   * @param {*} e 
   */
  uploadComplete: function(res) {
    util.printLog("uploadComplete", res);
    this.resetImagePathList(res.detail.uploadReturnDataList);
  },

  /**
   * 删除图片
   * @param {*} e 
   */
  deleteImage: function(res) {
    this.resetImagePathList(res.detail.imagePathList);
  },

  /**
   * 按钮是否loading
   * @param {boolean} loading 
   */
  buttonLoading: function(loading) {
    this.setData({
      signInLoading: loading
    })
  },

  /**
   * 重置图片列表
   * @param {*} imageList 
   */
  resetImagePathList: function(imageList){
    this.setData({
      imagePathList: imageList
    })
    this.setData({
      signInDisable: imageList==null||imageList.length <= 0
    })
  },

  /**
   * 获取上传的文件地址列表
   */
  getSignInFileList: function() {
    let fileList = [];
    this.data.imagePathList.forEach(fileItem => {
      if (typeof fileItem == "object") {
        fileList.push(fileItem.viewAddress);
      } else if (typeof fileItem == 'string') {
        fileList.push(fileItem);
      }
    });
    return fileList;
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
   * 获取未支付补价单数量
   * @param {string} orderNo 订单编号 
   * @param {function(number)} callback
   */
  requestUnPayPremiumCount: function (orderNo, callback) {
    let that = this;
    commonOrderManager.checkUnpayPremiumCount(orderNo, function(success, data) {
      if (success) {
        if (util.checkIsFunction(callback)) {
          callback(data);
        }
      } else {
        that.buttonLoading(false);
        wx.showToast({
          title: '查询未付补价单失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 签收
   * @param {function} callback 
   */
  requestSignIn: function(callback) {
    let that = this;
    commonOrderManager.confirmOrderReceiving(this.data.order.orderNo, this.getSignInFileList(), function(success, data) {
      if (success) {
        if (util.checkIsFunction(callback)) {
          callback();
        }
      } else {
        that.buttonLoading(false);
        wx.showToast({
          title: '确认签收失败',
          icon: 'none'
        })
      }
    })
     
  }
})