
const app = getApp();
const workOrderManager = require("../../../../manager/orderManager/workOrderManager");
const util = require("../../../../utils/util");
const notificationCenter = require("../../../../manager/notificationCenter");
const { WORKORDER_ADD_REMARK } = require("../../../../static/notificationName");
const shareUtils = require("../../../../utils/shareUtils");
// pages/orderDetail/workOrderDetail/newRemark/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remark: "",
    order: null,
  },

  /**
   * 输入备注
   * @param {object} e 输入框 
   */
  inputRemark: function(e) {
    this.data.remark = e.detail.value
  },
  
  /**
   * 点击确定添加
   */
  tapAdd: function() {
    if (util.checkEmpty(this.data.remark)) {
      wx.showToast({
        title: '请输入备注内容',
        icon: 'none'
      })
      return;
    }
    let that = this;
    wx.showLoading({
      title: '请稍等',
    })
    workOrderManager.addOrderRemark(this.data.order.orderNo, this.data.remark, function(success, data){
      wx.hideLoading({
        success: (res) => {},
      })
      if (success) {
        notificationCenter.postNotification(WORKORDER_ADD_REMARK, that.data.remark);
        wx.navigateBack();
      } else {
        wx.showToast({
          title: '新增备注失败',
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