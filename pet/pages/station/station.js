// pages/station/station.js

const app = getApp();
const config = require("../../utils/config.js");
const util = require("../../utils/util.js");
const ShareUtil = require("../../utils/shareUtils.js");
const PagePath = require("../../utils/pagePath.js");
const LoadFootItemState = require("../../lee-components/leeLoadingFootItem/loadFootObj.js");

const Limit = 20;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stationList:[],
    location:null, // 位置信息
    pageIndex: 0,
    loadState: LoadFootItemState.Loading_State_Normal
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
    console.log("/station/station 销毁")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.pageIndex = 0;
    this.requestLocation();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.loadState == LoadFootItemState.Loading_State_End ||
      this.data.loadState == LoadFootItemState.Loading_State_Loading) {
      return;
    }
    this.setData({
      loadState: LoadFootItemState.Loading_State_Loading,
    })
    this.requestStation();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return ShareUtil.getOnShareAppMessageForShareOpenId();
  },

  /**
   * 拨打电话
   */
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenumber,
    })
  },

  /**
   * 点击驿站
   */
  tapStation: function(e) {
    let tempStation = this.data.stationList[e.currentTarget.dataset.index];
    let stationNo = e.currentTarget.dataset.stationno;

    // wx.navigateTo({
    //   url: PagePath.Path_Station_Detail + "?stationno=" + stationNo,
    // })

  },

  /**
   * 请求当前位置
   */
  requestLocation: function() {
    wx.showLoading({
      title: '请稍等...',
    })
    if (this.data.location) {
      this.requestStation();
    } else {
      let that = this;
      wx.getLocation({
        type: "gcj02",
        success: function (res) {
          console.log("------------ 定位成功 ------------");
          console.log(res);
          // 将经纬度交给 globalData 保管
          const latitude = res.latitude;
          const longitude = res.longitude;  
          that.data.location = {};
          that.data.location.latitude = latitude;
          that.data.location.longitude = longitude;
          that.requestStation();
        },
        fail: function (res) {
          wx.showToast({
            title: '定位失败,请重新再试',
            icon: 'none'
          })
          wx.hideLoading();
          wx.stopPullDownRefresh();
        },
      })
    }
  },

  /**
   * 请求数据
   */
  requestStation: function () {
    const latitude = this.data.location.latitude;
    const longitude = this.data.location.longitude;
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_GetBusinessByPosition,
      data: {
        latitude: this.data.location.latitude,
        longitude: this.data.location.longitude,
        offset: this.data.pageIndex,
        limit: Limit
      },
      success(res) {
        wx.hideLoading();
        console.log("获取周边商家列表 success: \n" + JSON.stringify(res));
        if (res.data.code != config.RES_CODE_SUCCESS) {
          wx.showToast({
            title: '获取周边商家列表错误',
            icon: 'none'
          })
        } else {
          if (that.data.pageIndex == 0) {
            that.setData({
              stationList: res.data.data,
              pageIndex: that.data.pageIndex + Limit,
              loadState: LoadFootItemState.Loading_State_Normal
            })
          } else {
            let tempData = that.data.stationList.concat(res.data.data);
            that.data.pageIndex = that.data.pageIndex + Limit;
            if (res.data.data.length < Limit) {
              that.setData({
                stationList: tempData,
                loadState: LoadFootItemState.Loading_State_End
              })
            } else {
              that.setData({
                stationList: tempData,
                loadState: LoadFootItemState.Loading_State_Normal
              })
            }
          }
        }
      },
      fail(res) {
        wx.hideLoading();
        console.log("获取周边商家列表 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '获取周边商家列表失败',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("获取周边商家列表 complete: \n" + JSON.stringify(res));
        wx.stopPullDownRefresh();
      },
    })
  },

})