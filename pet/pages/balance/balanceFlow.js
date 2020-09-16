// pages/balance/balanceFlow.js

const Limit = 20;
const LoginUtil = require("../../utils/loginUtils.js");
const Util = require("../../utils/util.js");
const Config = require("../../utils/config.js");
const ShareUtil = require("../../utils/shareUtils.js");
const PagePath = require("../../utils/pagePath.js");
const BalanceManager = require("../../manager/balanceManager/balanceManager.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: [],
    loadMoreLoading: false,
    loadMoreTip: "暂无数据",
    offset: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    let that = this;
    this.data.offset = 0;
    this.setData({
      loadMoreLoading: true,
      loadMoreTip: "数据加载中"
    })
    this.requestData(this.data.offset,
      function getDataCallback(success,data) {
        wx.stopPullDownRefresh();
        that.setData({
          loadMoreLoading: false,
          loadMoreTip: "上拉加载数据"
        })
        if (success) {
          console.log("获取余额流水： \n" + JSON.stringify(data));
          that.setData({
            dataSource: data,
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
      }
    )
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
      loadMoreLoading: true,
      loadMoreTip: "数据加载中",
    })
    let that = this;
    this.requestData(this.data.offset,
      function getDataCallback(success,data) {
        wx.stopPullDownRefresh();
        that.setData({
          loadMoreLoading: false,
          loadMoreTip: "上拉加载数据"
        })
        if (success) {
          console.log("获取已发货订单： \n" + JSON.stringify(data));
          let tempList = that.data.dataSource.concat(data);
          that.setData({
            dataSource: tempList
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
   * 点击流水item
   */
  tapFlowItemAction: function(button) {
    let flowItem = button.currentTarget.dataset.flow;
    let orderNo = flowItem.order.orderNo;
    let rebate = 0;
    flowItem.orderFlowDetails.forEach(detailItem => {
      if (detailItem.flowType == "orderRebate") {
        rebate = 1;
      }
    });
    wx.navigateTo({
      url: PagePath.Path_Order_Detail + '?orderno=' + orderNo + '&type=1' + "&ablecancelpremium=0" + "&showprice=1" + "&rebate=" + rebate,
    })
  },

  /**
   * 请求数据
   */
  /**
  * 请求数据
  * @param {number} offset 偏移量
  * @param {function(boolean, object)}getDataCallback
  */
  requestData: function (offset, getDataCallback) {
    let that = this;
    if (LoginUtil.getStationNo() != null) {
      BalanceManager.getStationBalanceFlow(LoginUtil.getStationNo(), offset, Limit, function(success, data){
        if (success) {
          that.data.offset = that.data.offset + Limit;
          if (Util.checkIsFunction(getDataCallback)) {
            getDataCallback(true, data)
          }
        } else {
          wx.showToast({
            title: "获取流水失败",
            icon: 'none'
          })
          if (Util.checkIsFunction(getDataCallback)) {
            getDataCallback(false, null)
          }
        }
      })
    } else if (LoginUtil.getBusinessNo() != null) {
      BalanceManager.getBusinessBalanceFlow(LoginUtil.getBusinessNo(), offset, Limit, function(suscces, data) {
        if (suscces) {
          that.data.offset = that.data.offset + Limit;
          if (Util.checkIsFunction(getDataCallback)) {
            getDataCallback(true, data)
          }
        } else {
          wx.showToast({
            title: "获取流水失败",
            icon: 'none'
          })
          if (Util.checkIsFunction(getDataCallback)) {
            getDataCallback(false, null)
          }
        }
      })
    }
  }
})