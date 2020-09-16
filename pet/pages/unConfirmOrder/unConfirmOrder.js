// pages/unConfirmOrder/unConfirmOrder.js
const util = require("../../utils/util.js");
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const pagePath = require("../../utils/pagePath.js");
const ShareUtil = require("../../utils/shareUtils.js");
const { GetOrderParam } = require("../../manager/orderManager/workOrderManager.js");
const workOrderManager = require("../../manager/orderManager/workOrderManager.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], // 订单列表
    userInfo: null,
    searchKey: null, // 搜索关键字

    orderFilter: null, // 更多筛选条件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 开始刷新
   */
  startRefresh: function(){
    wx.startPullDownRefresh();
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
    wx.startPullDownRefresh();
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
    this.getOrderData(this.data.serachKey);
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
   * 搜索单据
   */
  searchOrder: function (e) {
    wx.startPullDownRefresh();
  },

  /**
   * 搜索关键字输入
   */
  searchInput: function(e) {
    this.data.serachKey = e.detail.value;
  },


  /**
   * 点击更多筛选
   */
  tapFilterAction: function (e) {
    wx.navigateTo({
      url: pagePath.Path_Order_Filter + '?type=1',
    })
  },


  /**
   * 开始筛选
   */
  startFilter: function (orderFilter) {
    this.setData({
      orderFilter: orderFilter
    })
    this.getOrderData(this.data.searchKey);
  },

  /**
   * 清除筛选条件
   */
  tapClearFilter: function () {
    this.setData({
      orderFilter: null
    })
    this.startRefresh();
  },

  /**
   * 获取数据
   */
  getOrderData: function (searchKey) {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        if (util.checkEmpty(that.data.userInfo)) {
          that.setData({
            userInfo: loginUtil.getUserInfo()
          })
        }
        that.requestInHarbour(searchKey);
      }
    })
  },

  /**
   * 请求收货单
   */
  requestInHarbour: function (searchKey) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    let orderFilter = this.data.orderFilter;
    let tempSearchKey = "";
    if (searchKey != null) {
      tempSearchKey = searchKey
    }
    let orderTypes = [
      config.Order_State_ToArrived,
      config.Order_State_Arrived,
      config.Order_State_Delivering,
      config.Order_State_ToSign
    ];
    let endCity = "";
    let name = "";
    let phone = "";
    let code = "";
    let startOrderDate = "";
    let endOrderDate = "";
    let startLeaveDate = "";
    let endLeaveDate = "";
    if (orderFilter != null && !util.checkEmpty(orderFilter.orderType)) {
      orderTypes = [
        orderFilter.orderType
      ];
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.endCity)) {
      endCity = orderFilter.endCity;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.name)) {
      name = orderFilter.name;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.phone)) {
      phone = orderFilter.phone;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.code)) {
      code = orderFilter.code;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.startOrderDate)) {
      startOrderDate = orderFilter.startOrderDate;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.endOrderDate)) {
      endOrderDate = orderFilter.endOrderDate;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.startLeaveDate)) {
      startLeaveDate = orderFilter.startLeaveDate;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.endLeaveDate)) {
      endLeaveDate = orderFilter.endLeaveDate;
    }

    let tempParam = new GetOrderParam(tempSearchKey,orderTypes, startOrderDate, endOrderDate, startLeaveDate, endLeaveDate,endCity, name, phone, code);
    workOrderManager.getOrderList_2(tempParam, function(success, data){
      wx.hideLoading();
      wx.stopPullDownRefresh();
      if (success) {
        that.setData({
          orderList: data
        })
      } else {
        wx.showToast({
          title: '获取订单失败',
          icon: 'none',
        })
      }
    })
  },

  /**
   * 点击订单详情
   */
  tapOrderDetail: function(e){
    wx.navigateTo({
      url: '/pages/orderDetail/workOrderDetail/index' + "?orderno=" + e.currentTarget.dataset.orderno,
    })
  },

  /**
   * 点击图片
   */
  tapImage: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.orderindex];
    let tempImageList = [];
    if (tempOrder.orderStates[0].pictureList != null && tempOrder.orderStates[0].pictureList.length > 0) {
      for (let i = 0; i < tempOrder.orderStates[0].pictureList.length; i++) {
        tempImageList.push(tempOrder.orderStates[0].pictureList[i].viewAddress);
      }
    }
    if (tempOrder.currentUploadImages != null && tempOrder.currentUploadImages.length > 0) {
      for (let i = 0; i < tempOrder.currentUploadImages.length; i++) {
        tempImageList.push(tempOrder.currentUploadImages[i].viewAddress);
      }
    }
    if (tempOrder.uploadImages != null && tempOrder.uploadImages.length > 0) {
      tempImageList = tempImageList.concat(tempOrder.uploadImages);
    }
    let currrentUrl = e.currentTarget.dataset.imageurl;
    wx.previewImage({
      urls: tempImageList,
      current: currrentUrl
    })
  },

  /**
   * 拨打电话
   */
  callPhone: function (e) {
    let phoneNumber = e.currentTarget.dataset.phone;
    if (util.checkEmpty(phoneNumber)) {
      return;
    }
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
    })
  },
  
  /**
   * 点击预览视频
   */
  tapVideoItem: function (e) {
    let videoContext = wx.createVideoContext(e.currentTarget.dataset.id, this);
    videoContext.play();
  },
})