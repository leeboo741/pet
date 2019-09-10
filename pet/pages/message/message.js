// pages/message/message.js

const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestMessageData();
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

  },

  /**
   * 请求数据
   */
  requestMessageData: function () {
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_Get_Message + loginUtil.getOpenID(),
      success(res){
        console.log("获取站内信 success:\n" + JSON.stringify(res));
        if (res.data.code == 200) {
          that.setData({
            messageList: res.data.data
          })
        }
      },
      fail(res) {
        console.log("获取站内信 fail:\n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("获取站内信 complete:\n" + JSON.stringify(res));
      }
    })
  },
})