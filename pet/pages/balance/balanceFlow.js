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
      function getDataCallback(data) {
        console.log("获取余额流水： \n" + JSON.stringify(data));
        that.setData({
          dataSource: data,
        })
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
        wx.stopPullDownRefresh();
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
      loadMoreTip: "数据加载中",
    })
    let that = this;
    this.requestData(this.data.offset,
      function getDataCallback(data) {
        console.log("获取已发货订单： \n" + JSON.stringify(data));
        let tempList = that.data.dataSource.concat(data);
        that.setData({
          dataSource: tempList
        })
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
  * @param offset
  * @param getDataCallback
  */
  requestData: function (offset, getDataCallback, getFailCallback) {
    let that = this;
    if (LoginUtil.getStationNo() != null) {
      BalanceManager.getStationBalanceFlow(LoginUtil.getStationNo(), offset, Limit, function getFlowCallback(res){
        console.log("余额流水 success： \n" + JSON.stringify(res));
        if (res.data.code == Config.RES_CODE_SUCCESS) {
          that.data.offset = that.data.offset + Limit;
          if (Util.checkIsFunction(getDataCallback)) {
            getDataCallback(res.data.data)
          }
        } else {
          let msg = res.data.message;
          if (msg == null) {
            msg = "获取流水失败";
          }
          wx.showToast({
            title: msg,
            icon: 'none'
          })
          if (Util.checkIsFunction(getFailCallback)) {
            getFailCallback(res)
          }
        }
      }, function failCallback(res) {
        console.log("余额流水 fail \n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: 'none'
        })
        if (Util.checkIsFunction(getFailCallback)) {
          getFailCallback(res)
        }
      })
    } else if (LoginUtil.getBusinessNo() != null) {
      BalanceManager.getBusinessBalanceFlow(LoginUtil.getBusinessNo(), offset, Limit, function getFlowCallback(res){
        console.log("余额流水 success： \n" + JSON.stringify(res));
        if (res.data.code == Config.RES_CODE_SUCCESS) {
          if (Util.checkIsFunction(getDataCallback)) {
            getDataCallback(res.data.data)
          }
        } else {
          let msg = res.data.message;
          if (msg == null) {
            msg = "获取流水失败";
          }
          wx.showToast({
            title: msg,
            icon: 'none'
          })
          if (Util.checkIsFunction(getFailCallback)) {
            getFailCallback(res)
          }
        }
      }, function failCallback(res){
        console.log("余额流水 fail \n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: 'none'
        })
        if (Util.checkIsFunction(getFailCallback)) {
          getFailCallback(res)
        }
      })
    }
  }
})