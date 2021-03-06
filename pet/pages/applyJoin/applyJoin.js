// pages/applyJoin/applyJoin.js

const pagePath = require("../../utils/pagePath.js");
const ShareUtil = require("../../utils/shareUtils.js");
const loginUtils = require("../../utils/loginUtils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 点击宠物店
   */
  tapRegisterStation: function () {
    if (loginUtils.checkBusinessInfoComplete()) {
      wx.navigateTo({
        url: pagePath.Path_Apply_Register_Station,
      })
    } else {
      wx.navigateTo({
        url: pagePath.Path_Apply_Business_CompletionInfo,
      })
    }
  },

  /**
   * 点击员工加入
   */
  tapRegisterStaff: function () {
    wx.navigateTo({
      url: pagePath.Path_Apply_Register_Staff,
    })
  },
})