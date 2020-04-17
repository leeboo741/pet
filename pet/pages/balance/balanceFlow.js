// pages/balance/balanceFlow.js

const Limit = 20;
const LoginUtil = require("../../utils/loginUtils.js");
const Util = require("../../utils/util.js");
const Config = require("../../utils/config.js");
const ShareUtil = require("../../utils/shareUtils.js");

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
   * 请求数据
   */
  /**
  * 请求数据
  * @param offset
  * @param getDataCallback
  */
  requestData: function (offset, getDataCallback) {
    let tempUrl = "";
    let tempData = {};
    if (LoginUtil.getStationNo() != null) {
      tempUrl = Config.URL_Service + Config.URL_BalanceFlow_Station;
      tempData = {
        stationNo: LoginUtil.getStationNo(),
        offset: offset,
        limit: Limit
      }
    } else if (LoginUtil.getBusinessNo() != null) {
      tempUrl = Config.URL_Service + Config.URL_BalanceFlow_Business;
      tempData = {
        businessNo: LoginUtil.getBusinessNo(),
        offset: offset,
        limit: Limit
      }
    }
    wx.request({
      url: tempUrl,
      data: tempData,
      success(res) {
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
        }
      },
      fail(res) {
        console.log("余额流水 fail \n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: 'none'
        })
      },
    })
  }
})