// pages/orderFilter/orderFilter.js

const app = getApp();
const Config = require("../../utils/config.js");
const LoginUtil = require("../../utils/loginUtils.js");
const ShareUtil = require("../../utils/shareUtils.js");
const Util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: null, // 来源页面类型
    orderFilter: {},
    orderTypeRange: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderTypeList = [];
    if (options.type == 0) {
      orderTypeList = [
        Config.Order_State_ToInPort, 
        Config.Order_State_ToOutPort ,
        Config.Order_State_ToPack
      ];
    } else if (options.type == 1) {
      orderTypeList = [
        Config.Order_State_ToArrived ,
        Config.Order_State_Arrived ,
        Config.Order_State_Delivering ,
        Config.Order_State_ToSign
      ];
    } else if (options.type == 2) {
      orderTypeList = [
        Config.Order_State_ToInPort,
        Config.Order_State_ToOutPort,
        Config.Order_State_ToPack,
        Config.Order_State_ToArrived,
        Config.Order_State_Arrived,
        Config.Order_State_Delivering,
        Config.Order_State_ToSign,
        Config.Order_State_Completed,
      ]
    }
    this.setData({
      orderTypeRange: orderTypeList
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
    return ShareUtil.getOnShareAppMessageForShareOpenId();
  },

  /**
   * 选择订单类型
   */
  bindTypeChange: function (e) {
    this.data.orderFilter.orderType = this.data.orderTypeRange[e.detail.value];
    this.setData({
      orderFilter: this.data.orderFilter
    })
  },

  /**
   * 选择开始下单时间
   */
  bindStartOrderDate: function (e) {
    this.data.orderFilter.startOrderDate = e.detail.value;
    this.setData({
      orderFilter: this.data.orderFilter
    })
  },

  /**
   * 选择结束下单时间
   */
  bindEndOrderDate: function (e) {
    this.data.orderFilter.endOrderDate = e.detail.value;
    this.setData({
      orderFilter: this.data.orderFilter
    })
  },

  /**
   * 选择开始出发时间
   */
  bindStartLeaveDate: function (e) {
    this.data.orderFilter.startLeaveDate = e.detail.value;
    this.setData({
      orderFilter: this.data.orderFilter
    })
  },

  /**
   * 选择结束出发时间
   */
  bindEndLeaveDate: function (e) {
    this.data.orderFilter.endLeaveDate = e.detail.value;
    this.setData({
      orderFilter: this.data.orderFilter
    })
  },

  /**
   * 点击筛选
   */
  tapFilter: function() {
    let orderFilter = this.data.orderFilter;
    if (Util.checkEmpty(orderFilter.orderType) 
      && Util.checkEmpty(orderFilter.startOrderDate)
      && Util.checkEmpty(orderFilter.endOrderDate)
      && Util.checkEmpty(orderFilter.startLeaveDate)
      && Util.checkEmpty(orderFilter.endLeaveDate)){
      wx.showToast({
        title: '至少一个筛选条件',
        icon: 'none'
      })
      return;
    }
    if (!Util.checkEmpty(orderFilter.endOrderDate)
      && Util.checkEmpty(orderFilter.startOrderDate)) {
      wx.showToast({
        title: '请选择开始下单时间',
        icon: 'none'
      })
      return;
    }
    if (!Util.checkEmpty(orderFilter.startOrderDate)
      && Util.checkEmpty(orderFilter.endOrderDate)) {
      wx.showToast({
        title: '请选择结束下单时间',
        icon: 'none'
      })
      return;
    }
    if (!Util.checkEmpty(orderFilter.endLeaveDate)
      && Util.checkEmpty(orderFilter.startLeaveDate)) {
      wx.showToast({
        title: '请选择开始出发时间',
        icon: 'none'
      })
      return;
    }
    if (!Util.checkEmpty(orderFilter.startLeaveDate)
      && Util.checkEmpty(orderFilter.endLeaveDate)) {
      wx.showToast({
        title: '请选择结束出发时间',
        icon: 'none'
      })
      return;
    }
    var pages = getCurrentPages();
    if (pages.length > 1) { //说明有上一页存在
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里，调用上一页的函数
      prePage.startFilter(orderFilter)
    }
    wx.navigateBack({})
  }
})