// pages/login/login.js


const loginUtil = require("../../utils/loginUtils.js");

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

  },

  /**
   * 点击登陆|注册
   */
  tapLoginOrRegister: function () {
    let that = this;
    loginUtil.login(function loginCallback(state, msg) {
      if (state == loginUtil.Login_Success) {
        wx.navigateBack({
          delta: 1,
        })
      } else if (state == loginUtil.Login_Fail) {
        wx.showModal({
          title: '登陆失败',
          content: msg,
          showCancel: false,
          success(res) {
            if (res.confirm) {
              that.tapLoginOrRegister();
            }
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/register/register?backtype=1',
        })
      }
    })
  },
})