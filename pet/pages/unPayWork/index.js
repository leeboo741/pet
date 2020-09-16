// pages/unPayWork/index.js
const util = require("../../utils/util.js");
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const pagePath = require("../../utils/pagePath.js");
const ShareUtil = require("../../utils/shareUtils.js");
const workOrderManager = require("../../manager/orderManager/workOrderManager.js");
const notificationCenter = require("../../manager/notificationCenter.js");
const { WORKORDER_DELETE, WORKORDER_ADD_REMARK, WORKORDER_CHANGE_PRICE, WORKORDER_UPLOAD_PAYMENT_VOUCHER, WORKORDER_ADD_TEMPDELIVER } = require("../../static/notificationName.js");

const app = getApp();

const Limit = 20;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], // 订单列表
    userInfo: null,
    loadMoreLoading: false,
    loadMoreTip: "暂无数据",
    offset: 0,
    keyword: null,
    orderDate: null,
    orderStateList: [
      config.Order_State_ToPay, // 待付款
      config.Order_State_ToVerify // 待审核
    ], // 订单状态列表
    currentOrderState: "全部", // 当前订单状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
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
    app.globalData.verifyPaymentVoucherOrder = null;
    wx.startPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  startRefresh: function(){
    this.data.offset = 0;
    let that = this; 
    this.setData({
      loadMoreLoading: true,
      loadMoreTip: "数据加载中"
    })
    this.getOrderData(this.data.offset,
      function getDataCallback(data){
        that.setData({
          orderList: data
        })
        that.data.offset = that.data.offset + Limit;
        that.setData({
          loadMoreLoading: false,
        })
        if (data.length >= Limit) {
          that.setData({
            loadMoreTip: "上拉加载数据"
          })
        } else if (data.length < Limit && data.length > 0) {
          that.setData({
            loadMoreTip: "已经到底了"
          })
        } else {
          that.setData({
            loadMoreTip: "暂无数据"
          })
        }
      }
    );
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.startRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.loadMoreTip == "已经到底了"
      || this.data.loadMoreTip == "数据加载中"
      || this.data.loadMoreTip == "暂无数据") {
      return;
    }
    this.setData({
      loadMoreTip: "数据加载中",
    })
    let that = this;
    this.getOrderData(this.data.offset,
      function getDataCallback(data){
        let tempList = that.data.orderList.concat(data);
        that.setData({
          orderList: tempList
        })
        that.data.offset = that.data.offset + Limit;
        that.setData({
          loadMoreLoading: false,
        })
        if (data.length >= Limit) {
          that.setData({
            loadMoreTip: "上拉加载数据"
          })
        } else {
          that.setData({
            loadMoreTip: "已经到底了"
          })
        }
      }
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return ShareUtil.getOnShareAppMessageForShareOpenId();
  },

  /**
   * 点击确认输入搜索
   * @param {*}} e 
   */
  searchOrder: function(e) {
    this.data.keyword = e.detail.value;
    wx.startPullDownRefresh();
  },

  /**
   * 点击选择状态
   */
  tapStateFilter: function() {
    let that = this;
    wx.showActionSheet({
      itemList: ['全部','待付款','待审核'],
      success(res) {
        if (res.tapIndex == 0) {
          that.changeCurrentOrderState("全部");
        } else if (res.tapIndex == 1) {
          that.changeCurrentOrderState(config.Order_State_ToPay);
        } else if (res.tapIndex == 2) {
          that.changeCurrentOrderState(config.Order_State_ToVerify);
        }
      }
    })
  },

  /**
   * 更改当前订单状态
   */
  changeCurrentOrderState: function(state) {
    this.setData({
      currentOrderState : state
    })
    if (state != config.Order_State_ToPay && state != config.Order_State_ToVerify) {
      this.data.orderStateList = [
        config.Order_State_ToPay,
        config.Order_State_ToVerify
      ];
    } else {
      this.data.orderStateList = [state];
    }
    wx.startPullDownRefresh();
  },

  /**
   * 获取数据
   */
  getOrderData: function (offset, getDataCallback) {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        if (util.checkEmpty(that.data.userInfo)) {
          that.setData({
            userInfo: loginUtil.getUserInfo()
          })
        }
        that.requestOrderList(offset,
          function callback(data) {
            if (getDataCallback && typeof getDataCallback == "function") {
              getDataCallback(data);
            }
          }
        );
      }
    })
  },

  /**
   * 请求单据
   */
  requestOrderList: function (offset, getOrderDataCallback) {
    let that = this;
    workOrderManager.getOrderList_1(this.data.orderStateList, offset, Limit, this.data.keyword, this.data.orderDate, function(success, data) {
      wx.stopPullDownRefresh();
      wx.hideLoading();
      if (success) {
        if (util.checkIsFunction(getOrderDataCallback)) {
          getOrderDataCallback(data);
        } 
      } else {
        wx.showToast({
          title: '获取订单列表失败',
          icon: 'none'
        })
      }
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
   * 点击订单详情
   */
  tapOrderDetail: function(e) {
    wx.navigateTo({
      url: '/pages/orderDetail/workOrderDetail/index' + "?orderno=" + e.currentTarget.dataset.orderno,
    })
  },
})