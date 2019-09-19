// pages/message/message.js

const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const util = require("../../utils/util.js");

const NEW_MESSAGE_LOOP_TIME = 10000;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
    getNewMessageIntervalID: null,
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
    this.closeGetNewMessageInterval();
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
      url: config.URL_Service + config.URL_Get_Message + loginUtil.getOpenId(),
      success(res){
        console.log("获取站内信 success:\n" + JSON.stringify(res));
        if (res.data.code == 200) {
          that.setData({
            messageList: res.data.data
          })
          that.setLastGetMessageTime(util.formatTime(new Date()));
          that.startGetNewMessageInterval();
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

  /**
   * 查询 更新站内信
   */
  requestNewMessage: function () {
    let lastGetMessageTime = this.getLastGetMessageTime();
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_Get_New_Message,
      data: {
        openId: loginUtil.getOpenId(),
        lastModifyTime: lastGetMessageTime
      },
      success(res) {
        console.log("获取最新站内信 success:\n" + JSON.stringify(res));
        if (res.data.code == 200) {
          let tempList = res.data.data.concat(that.data.messageList);
          that.setData({
            messageList: tempList
          })
          that.setLastGetMessageTime(util.formatTime(new Date()));
        }
      },
      fail(res) {
        console.log("获取最新站内信 fail:\n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("获取最新站内信 complete:\n" + JSON.stringify(res));
      }
    })
  },


  /**
   * 开启新信息定时器
   */
  startGetNewMessageInterval: function () {
    let that = this;
    this.data.getNewMessageIntervalID = setInterval(function () {
      that.requestNewMessage();
    }, NEW_MESSAGE_LOOP_TIME);
  },


  /**
   * 关闭新信息定时器
   */
  closeGetNewMessageInterval: function () {
    clearInterval(this.data.getNewMessageIntervalID);
    this.data.getNewMessageIntervalID = null;
  },


  /**
   * 获取最后更新时间
   */
  getLastGetMessageTime: function () {
    try {
      let lastTime = wx.getStorageSync(config.Key_LastGetMessageTime);
      return lastTime;
    } catch (e) {
      return config.Value_Default_LastGetMessageTime;
    }
  },

  /**
   * 存储最后更新时间
   */
  setLastGetMessageTime: function (time) {
    try {
      wx.setStorageSync(config.Key_LastGetMessageTime, time);
    } catch (e) {

    }
  },
})