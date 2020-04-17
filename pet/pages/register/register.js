// pages/register/register.js
/**
 * ******** 注册页面 ********
 * ===================================================================================================================================
 * 在这个页面完成 手机号 和 微信账号 的绑定。
 * 绑定完成后自动跳转首页页面
 * 绑定失败 Toast 提示
 * ===================================================================================================================================
 */

const app = getApp();
const Config = require("../../utils/config.js");
const LoginUtil = require("../../utils/loginUtils.js");
const Util = require("../../utils/util.js");
const ShareUtil = require("../../utils/shareUtils.js");

// const intervalDuration = 60;

const Login_Step_NoUserInfoAuthorize = 0; // 无获取用户信息授权
const Login_Step_GetPhoneNumber = 1; // 获取用户手机

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginStep: Login_Step_NoUserInfoAuthorize,
    wxUserInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
  },

  getPhoneNumber: function(button){
    LoginUtil.getLogin(this.data.wxUserInfo, button.detail.encryptedData, button.detail.iv, app.ShareData.openId, function loginCallback(result){
      wx.navigateBack({
        
      })
    }) 
  },

  getUserInfo: function(button) {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    LoginUtil.getWXUserInfo(function callback(wxUserInfo) {
      console.log("WXUserInfo:" + JSON.stringify(wxUserInfo));
      wx.hideLoading();
      wx.showModal({
        title: '请前往登录',
        content: '授权成功,请前往登录',
        showCancel: false,
        success(res) {
          that.setData({
            loginStep: Login_Step_GetPhoneNumber,
            wxUserInfo: wxUserInfo,
          })
        }
      })
      
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
    
  }
})
