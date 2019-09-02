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
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: "", // 输入的电话号码
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
    console.log("/register/register 销毁")
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
   * 判断手机号
   */
  isPoneAvailable:function(poneInput) {
    var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    if (!myreg.test(poneInput)) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 注册账号 
   */
  registerAccount: function () {
    // 确认 手机号 输入
    if (this.data.phoneNumber == null || 
        this.data.phoneNumber.length <= 0 || 
        !this.isPoneAvailable(this.data.phoneNumber)) {
      wx.showToast({
        title: '请输入正确手机号码！',
        icon: 'none',
      })
      return;
    }
    // 请求注册
    wx.showLoading({
      title: '注册中...',
    })
    let tempData = null;
    let userInfo = loginUtil.getUserInfo();
    tempData = {
      "openid": app.globalData.openID,
      "customerName": app.globalData.nickName,
      "headerImage": app.globalData.avatarUrl,
      "sex": app.globalData.gender,
      "phone": this.data.phoneNumber,
    }
    console.log("绑定数据 => " + JSON.stringify(tempData));
    wx.request({
      url: config.URL_Service + config.URL_Register,
      data: tempData, // 参数
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST", // 请求方式
      success: res => {
        console.log("registerAccount success => " + JSON.stringify(res));
        this.requestSuccess(res);
      }, // 请求成功回调
      fail: res => {
        console.log("registerAccount fail => " + JSON.stringify(res));
        this.requestFail(res);
      }, // 请求失败回调
      complete: res => {
        console.log("registerAccount complite => " + JSON.stringify(res));
        wx.hideLoading();
      }, // 请求完成回调
    })
  },
  /**
     * 获取用户信息
     */
  getUserInfo: function () {
    loginUtil.login(function loginCallback(state, msg){
      if (state == loginUtil.Login_Success) {
        wx.navigateBack({
          delta: 1
        })
      } else if (state == loginUtil.Login_Fail) {
        wx.showToast({
          title: msg,
          icon: 'none'
        })
      } else {

      }
    });
  },

  /**
   * 注册成功
   * res 请求成功数据
   */
  requestSuccess: function (res) {
    let that = this;
    if (res.data.prompt == config.Prompt_Success) {
      wx.showModal({
        showCancel: false,
        title: res.data.root,
        message: "确定登陆！",
        success(res) {
          if (res.confirm) {
            that.getUserInfo();
          }
        }
      })
    } else {
      wx.showToast({
        title: '绑定失败！',
        icon: 'none',
        image: '../../resource/request_fail.png',
        duration: 2000,
      })
    }
  },

  /**
   * 注册失败
   * res 请求失败数据
   */
  requestFail: function (res) {
    wx.showToast({
      title: '绑定失败！',
      icon: 'none',
      image: '../../resource/request_fail.png',
      duration: 2000,
    })
  },

  /**
   * 输入框输入
   */
  phoneNumberInput: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
})