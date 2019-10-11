// pages/message/message.js

const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const util = require("../../utils/util.js");
const ShareUtil = require("../../utils/shareUtils.js");

const NEW_MESSAGE_LOOP_TIME = 10000;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
    getNewMessageIntervalID: null,

    startIndex: 0, // 开始下标
    pageSize: 20, // 页长
    isEnd: false, // 是否到底
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
    this.closeGetNewMessageInterval();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.startIndex = 0;
    this.data.messageList = [];
    this.getMessageData(this.data.startIndex);
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
   * 获取数据
   * @param startIndex 开始下标
   */
  getMessageData: function (startIndex) {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestMessageData(startIndex);
      }
    })
  },

  /**
   * 请求数据
   * @param startIndex 开始下标
   */
  requestMessageData: function (startIndex) {
    this.closeGetNewMessageInterval();
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_Get_Message,
      data: {
        openId: loginUtil.getOpenId(),
        offset: startIndex,
        limit: this.data.pageSize
      },
      success(res){
        console.log("获取站内信 success:\n" + JSON.stringify(res));
        if (res.data.code == 200) {
          if (util.checkEmpty(res.data.data)) {
            that.setData({
              isEnd: true
            })
            return;
          }
          that.data.messageList = that.data.messageList.concat(res.data.data);
          let isEnd = false;
          if (res.data.data.length < that.data.pageSize) {
            isEnd = true;
          }
          that.setData({
            messageList: that.data.messageList,
            isEnd: isEnd,
            startIndex: startIndex + that.data.pageSize
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
        wx.stopPullDownRefresh();
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
        if (res.data.code == 200 && res.data.data > 0) {
          wx.showModal({
            title: '有新消息',
            content: '您有新的站内信，可以刷新页面查看',
            showCancel: false
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

  /**
   * 开始刷新
   */
  refresh: function () {
    wx.startPullDownRefresh();
  },

  /**
   * 加载更多
   */
  loadMore: function () {
    console.log("站内信加载更多");
    this.getMessageData(this.data.startIndex);
  }
})