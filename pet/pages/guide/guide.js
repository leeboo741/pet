// pages/guide/guide.js

/**
 * ******** 引导页面 ********
 * ===================================================================================================================================
 * 在这个页面完成 wx 登陆，获取code，向服务器请求注册状态的操作。
 * 如果未注册，跳转注册页面，注册手机号并绑定到该微信号。
 * 如果已注册，直接跳转首页请求业务数据。
 * ===================================================================================================================================
 */
//获取应用实例
const app = getApp()

const config = require("../../utils/config.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: "欢迎使用宠物之家托运系统!", // 页面信息
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.login();
    console.log("要死啊" + config.URL_Service)
  },

  /**
   * 自有服务器登陆请求
   */
  login: function () {
    wx.showLoading({
      title: '登陆中...',
    })
    let that = this;
    // let that = this;
    console.log("微信登陆")
    // 登录
    wx.login({
      success: res => {
        console.log("微信login success => " + res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        app.globalData.code = res.code
        that.startLogin(res.code);
      },
      fail(res) {
        console.log("微信login fail => " + JSON.stringify(res));
        wx.hideLoading();
        wx.showToast({
          title: '微信登陆失败',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("微信login complete => " + JSON.stringify(res));
      },
    })
  },

  /**
   * 开始登陆
   */
  startLogin: function (wxCode) {
    let that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log("微信登陆 => \n" + JSON.stringify(res));
              const userInfo = res.userInfo
              app.globalData.userInfo.nickName = userInfo.nickName
              app.globalData.userInfo.avatarUrl = userInfo.avatarUrl
              if (userInfo.gender != null && userInfo.gender == "1") {
                userInfo.gender = "男";
              } else {
                userInfo.gender = "女";
              }
              app.globalData.userInfo.gender = userInfo.gender
              app.globalData.userInfo.province = userInfo.province
              app.globalData.userInfo.city = userInfo.city
              app.globalData.userInfo.country = userInfo.country
              let urlstr = config.URL_Service + config.URL_Login;
              // 向服务器请求登陆，返回 本微信 在服务器状态，注册|未注册，
              wx.request({
                url: urlstr, // 服务器地址
                data: {
                  "code": wxCode
                }, // 参数
                success: res => {
                  console.log("success => " + JSON.stringify(res));
                  if (res.data.prompt == config.Prompt_Success) {
                    let tempUserInfo = JSON.parse(res.data.root)
                    app.globalData.userInfo.customerNo = tempUserInfo.customerNo
                    app.globalData.userInfo.openid = tempUserInfo.openid
                    app.globalData.userInfo.phone = tempUserInfo.phone
                    app.globalData.userInfo.nickName = tempUserInfo.customerName
                    app.globalData.userInfo.avatarUrl = tempUserInfo.headerImage
                    app.globalData.userInfo.gender = tempUserInfo.sex
                    app.globalData.userInfo.role = tempUserInfo.role
                    app.globalData.userInfo.balance = tempUserInfo.balance
                    that.jumpToHome();
                  } else if (res.data.prompt == config.Prompt_NotExist) {
                    app.globalData.userInfo.openid = res.data.root;
                    that.jumpToRegister();
                  } else {
                    wx.showModal({
                      title: '登陆错误！',
                      content: '登陆错误，请联系管理员或稍后再试',
                      success(res) {
                        if (res.confirm) {
                          that.login();
                        }
                      }
                    })
                  }
                }, // 请求成功回调 登陆成功 保存 用户信息。登陆失败，跳转注册页面
                fail: res => {
                  console.log("fail => " + JSON.stringify(res));
                  wx.showModal({
                    title: '请求登陆失败！',
                    content: '登陆失败，请稍后重新尝试',
                    success(res) {
                      if (res.confirm) {
                        that.login();
                      }
                    }
                  })
                }, // 请求失败回调,弹窗，重新请求
                complete: res => {
                  console.log("complite => " + JSON.stringify(res));
                  wx.hideLoading();
                }, // 请求完成回调，隐藏loading
              })
            }
          })
        }
      },
      fail (res) {

      },
      complete (res) {
        wx.hideLoading();
      },
    })
  },

  bindGetUserInfo(e) {
    this.login();
  },

  jumpToHome: function () {
    wx.switchTab({
      url: '/pages/consigned/base/base',
    })
  },

  /**
   * 跳转注册页面
   */
  jumpToRegister: function () {
    wx.navigateTo({
      url: '../register/register',
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
})