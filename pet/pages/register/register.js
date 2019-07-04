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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:"", // 输入的电话号码
    checkAttention:false, // 是否确认了提醒事项
    showPrivace:false, // 是否展示隐私政策
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
   * 注册账号 
   */
  registerAccount: function () {
    // 确认 手机号 输入
    if (this.data.phoneNumber == null || this.data.phoneNumber.length <= 0) {
      wx.showToast({
        title: '请输入手机号码！',
        icon:'none',
      })
      return;
    }
    // 确认 隐私政策
    if (!this.data.checkAttention) {
      wx.showToast({
        title: '请确认已阅读隐私政策！',
        icon: 'none'
      })
      return;
    }
    // 请求注册
    wx.showLoading({
      title: '绑定中...',
    })
    // wx.request({
    //   url: app.url.url + app.url.register,
    //   data: {
    //     "phone": this.data.phoneNumber,
    //     "openid": app.globalData.openid,
    //   }, // 参数
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   method: "POST", // 请求方式
    //   success: res => {
    //     console.log("registerAccount success => " + JSON.stringify(res));
    //     this.requestSuccess(res);
    //   }, // 请求成功回调
    //   fail: res => {
    //     console.log("registerAccount fail => " + JSON.stringify(res));
    //     this.requestFail(res);
    //   }, // 请求失败回调
    //   complete: res => {
    //     console.log("registerAccount complite => " + JSON.stringify(res));
    //     wx.hideLoading();
    //   }, // 请求完成回调
    // })
  
    wx.reLaunch({
      url: '../consigned/consigned'
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo:function(){
    let that = this;
    wx.showLoading({
      title: '登陆中...',
    })
    // wx.request({
    //   url: app.url.url + app.url.userinfo + this.data.phoneNumber,
    //   success(res) {
    //     console.log("reginster get user success => " + JSON.stringify(res));
    //     that.getUserInfoSuccess(res);
    //   },
    //   fail(res) {
    //     console.log("reginster get user fail => " + JSON.stringify(res));
    //     that.getUserInfoFail(res);
    //   }, // 请求失败回调,弹窗，重新请求
    //   complete(res) {
    //     console.log("reginster get user complite => " + JSON.stringify(res));
    //     wx.hideLoading();
    //   }, // 请求完成回调，隐藏loading
    // })

    wx.redirectTo({
      url: '../consigned/consigned',
    })
  },

  /**
   * 获取用户信息成功
   */
  getUserInfoSuccess: function (res) {
    if (res.data.prompt == app.valueName.promptSuccess) {
      let root = res.data.root;
      if (root.yhmch != null) app.globalData.userInfo.nickName = root.yhmch;
      if (root.yhbh != null) app.globalData.userInfo.phone = root.yhbh;
      if (root.openid != null) app.globalData.userInfo.openid = root.openid;
      if (root.yhxb != null) app.globalData.userInfo.gender = root.yhxb;
      if (root.yhshr != null) app.globalData.userInfo.brithday = root.yhshr;
      if (root.yhjf != null) app.globalData.userInfo.point = root.yhjf;
      if (root.yhtx != null) app.globalData.userInfo.avatarUrl = root.yhtx;
      if (root.qcda != null) app.globalData.userInfo.carNumber = root.qcda;
      this.jumpToHome();
    } else {
      wx.showModal({
        showCancel: false,
        title: '登陆错误！',
        content: '登陆错误，请联系管理员或稍后再试',
      })
    }
  },

  /**
   * 获取用户信息失败
   */
  getUserInfoFail: function (res) {
    wx.showModal({
      showCancel: false,
      title: '请求登陆失败！',
      content: '登陆失败，请稍后重新尝试',
      success(res) {
        if (res.confirm) {
          that.getUserInfo();
        }
      }
    })
  },

  /**
   * 注册成功
   * res 请求成功数据
   */
  requestSuccess: function (res) {
    let that = this;
    if (res.data.prompt == app.valueName.promptSuccess){
      wx.showModal({
        showCancel:false,
        title: res.data.root,
        message: "确定登陆！",
        success(res) {
          if (res.confirm) {
            that.getUserInfo();
          }
        }
      })
    } else {
      
      wx.redirectTo({
        url: '../consigned/consigned',
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
    wx.redirectTo({
      url: '../consigned/consigned',
    })
  },

  /**
   * 跳转首页
   */
  jumpToHome: function(){
    wx.switchTab({
      url: '../home/home',
    })
  },

  /**
   * 输入框输入
   */
  phoneNumberInput: function (e) {
    this.setData({
      phoneNumber:e.detail.value
    })
  },

  /**
   * 点击隐私政策确认按钮
   */
  checkedAttention: function () {
    let checkAttentionValue = !this.data.checkAttention;
    this.setData({
      checkAttention:checkAttentionValue
    })
  },

  /**
   * 展示隐私政策页面
   */
  showPrivaceViewAction:function () {
    let show = !this.data.showPrivace;
    this.setData({
      showPrivace: show
    })
  }
})