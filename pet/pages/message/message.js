// pages/message/message.js

const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const util = require("../../utils/util.js");
const ShareUtil = require("../../utils/shareUtils.js");
const PagePath = require("../../utils/pagePath.js");
const messageManager = require("../../manager/messageManager/messageManager.js");

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
    messageManager.getMessageList(startIndex,this.data.pageSize, function(success, data) {
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
      if (success) {
        if (util.checkEmpty(data)) {
          that.setData({
            isEnd: true,
            messageList: that.data.messageList
          })
          return;
        }
        that.data.messageList = that.data.messageList.concat(data);
        let isEnd = false;
        if (data.length < that.data.pageSize) {
          isEnd = true;
        }
        that.setData({
          messageList: that.data.messageList,
          isEnd: isEnd,
          startIndex: startIndex + that.data.pageSize
        })
        that.startGetNewMessageInterval();
      } else {
        wx.showToast({
          title: '查询失败',
          icon: "none"
        })
      }
    })
  },

  /**
   * 查询 更新站内信
   */
  requestNewMessage: function () {
    let that = this;
    messageManager.getNewMessage(function(success, data){
      if (success) {
        if (data > 0) {
          wx.showModal({
            title: '有新消息',
            content: '您有新的站内信，刷新页面查看',
            showCancel: false,
            success(res){
              if(res.confirm) {
                wx.startPullDownRefresh();
              }
            }
          })
        }
      } else {
        wx.showToast({
          title: '查询异常',
          icon: "none"
        })
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
  },

  /**
   * 点击站内信
   */
  tapMessage: function (e) {
    let link = e.currentTarget.dataset.link;
    if (util.checkEmpty(link)) {
      return;
    }
    let paths = link.split("?");
    let pathType = paths[0];

    if (pathType == "action") {
      if (paths[1] == "login") {
        loginUtil.getNewUserInfo(function getNewUserInfo(success) {
          if (success) {
            wx.navigateBack({
              delta: 1,
            })
          } else {
            wx.showModal({
              title: '更新用户信息失败',
              content: '请稍后再试',
              showCancel: false,
            })
          }
        })
      }
    } else {
      wx.navigateTo({
        url: link,
      })
    }
  }
})