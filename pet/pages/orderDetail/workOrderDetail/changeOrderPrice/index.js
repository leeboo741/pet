const util = require("../../../../utils/util");
const notificationCenter = require("../../../../manager/notificationCenter");
const { WORKORDER_CHANGE_PRICE } = require("../../../../static/notificationName");
const workOrderManager = require("../../../../manager/orderManager/workOrderManager");
const shareUtils = require("../../../../utils/shareUtils");
const app = getApp();

// pages/orderDetail/workOrderDetail/changeOrderPrice/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null,
    newPrice: null,
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
   * 输入新价格
   * @param {*} e 
   */
  inputNewPrice: function(e) {
    this.data.newPrice = e.detail.value
  },

  /**
   * 点击确定修改
   */
  tapChangePrice: function(){
    if (util.checkEmpty(this.data.newPrice)) {
      wx.showToast({
        title: '请输入新价格',
        icon: 'none'
      })
      return;
    }
    let that = this;
    wx.showModal({
      title: '确认修改',
      content: "确认修改订单价格",
      success(res){
        if (res.confirm) {
          that.requestChangeOrderPrice(that.data.order.orderNo, that.data.newPrice);
        }
      }
    })
  },

  /**
   * 修改订单价格
   * @param {string} orderNo 订单编号
   * @param {number} newPrice 新价格
   */
  requestChangeOrderPrice: function(orderNo, newPrice) {
    wx.showLoading({
      title: '请稍等',
    })
    workOrderManager.changeOrderPrice(orderNo, newPrice, function(success, data) {
      wx.hideLoading();
      if (success) {
        notificationCenter.postNotification(WORKORDER_CHANGE_PRICE, newPrice);
        wx.navigateBack();
      } else {
        wx.showToast({
          title: '改价失败',
          icon: 'none'
        })
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