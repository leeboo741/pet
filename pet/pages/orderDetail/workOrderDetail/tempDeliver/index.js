// pages/orderDetail/workOrderDetail/tempDeliver/index.js
const app = getApp();
const pagePath = require("../../../../utils/pagePath");
const util = require("../../../../utils/util");
const workOrderManager = require("../../../../manager/orderManager/workOrderManager");
const notificationCenter = require("../../../../manager/notificationCenter");
const { WORKORDER_ADD_TEMPDELIVER } = require("../../../../static/notificationName");
const shareUtils = require("../../../../utils/shareUtils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null,
    receiverName: null,
    receiverPhone: null,
    receiverAddress: null,
  },

  /**
   * 输入收件人名称
   */
  inputReceiverName: function(e) {
    this.data.receiverName = e.detail.value;
  },

  /**
   * 输入收件人电话
   */
  inputReceiverPhone: function(e) {
    this.data.receiverPhone = e.detail.value;
  },

  /**
   * 选择收货地址
   */
  selectedReceiverAddress: function() {
    wx.navigateTo({
      url: pagePath.Path_Map + "?city=" + this.data.order.transport.endCity + "&orderindex=0" + "&type=tempdeliver",
    })
  },

  /**
   * 确认提交
   */
  tapSubmit: function() {
    if (util.checkEmpty(this.data.receiverName)) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return;
    } 
    if (util.checkEmpty(this.data.receiverPhone)) {
      wx.showToast({
        title: '电话不能为空',
        icon: 'none'
      })
      return;
    } 
    if (util.checkEmpty(this.data.receiverAddress)) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none'
      })
      return;
    } 
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    workOrderManager.changeOrderDeliver(this.data.order.orderNo,this.data.receiverName, this.data.receiverPhone, this.data.receiverAddress, function(success, data){
      wx.hideLoading();
      if (success) {
        notificationCenter.postNotification(WORKORDER_ADD_TEMPDELIVER);
        wx.navigateBack();
      } else {
        wx.showToast({
          title: '临时派送添加失败',
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
      order: app.globalData.workOrder
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
    if (app.globalData.tempDeliverLocation) {
      let tempDeliverLocation = app.globalData.tempDeliverLocation;
      this.setData({
        receiverAddress: tempDeliverLocation.province + " " + tempDeliverLocation.city + " " + tempDeliverLocation.district + " " + tempDeliverLocation.detailAddress
      })
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
    return shareUtils.getOnShareAppMessageForShareOpenId();
  }
})