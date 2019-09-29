/**
 * ******** 个人中心页面 ********
 * ===================================================================================================================================
 * 在这个页面完成 输入寄宠人信息，收宠人信息
 * 预订之后直接付款
 * ===================================================================================================================================
 */

const app = getApp();
const loginUtil = require("../../utils/loginUtils.js");
const pagePath = require("../../utils/pagePath.js");

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
    console.log("/setting/setting 销毁")
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
   * 点击更新用户信息
   */
  tapUpdateUserInfo: function () {
    loginUtil.checkLogin(function alreadyLoginCallback(islogin){
      if (islogin) {
        loginUtil.login(function loginCallback(state, msg) {
          if (state == loginUtil.Login_Success) {
            wx.showToast({
              title: '更新成功',
            })
          } else if (state == loginUtil.Login_Fail) {
            wx.showToast({
              title: '更新失败',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: msg,
              icon: 'none'
            })
          }
        })
      } else {
        wx.showModal({
          title: '您尚未登录',
          content: '请前往登录',
          confirmText: '前往登录',
          success(res){
            if (res.confirm) {
              wx.navigateTo({
                url: pagePath.Path_Login,
              })
            }
          }
        })
      }
    })
  },

  /**
   * 点击退出登陆
   */
  tapLogout: function () {
    loginUtil.deleteUserInfo(function callback(state){
      if (state) {
        wx.switchTab({
          url: pagePath.Path_Home,
        })
      } else {
        wx.showToast({
          title: '退出登陆失败！',
          icon:'none'
        })
      }
    })
  },

  /**
   * 点击注销
   */
  tapLogoff: function () {
    
  },
})