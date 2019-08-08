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
    tempData = {
      "openid": app.globalData.userInfo.openid,
      "customerName": app.globalData.userInfo.nickName,
      "headerImage": app.globalData.userInfo.avatarUrl,
      "phone": this.data.phoneNumber,
      "sex": app.globalData.userInfo.gender,
    }
    console.log("绑定数据 => " + JSON.stringify(tempData));
    wx.request({
      url: app.url.url + app.url.register,
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
    this.login();
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
              let urlstr = app.url.url + app.url.login;
              // 向服务器请求登陆，返回 本微信 在服务器状态，注册|未注册，
              wx.request({
                url: urlstr, // 服务器地址
                data: {
                  "code": wxCode
                }, // 参数
                success: res => {
                  console.log("success => " + JSON.stringify(res));
                  if (res.data.prompt == app.requestPromptValueName.success) {
                    let tempUserInfo = JSON.parse(res.data.root)
                    app.globalData.userInfo.customerNo = tempUserInfo.customerNo
                    app.globalData.userInfo.openid = tempUserInfo.openid
                    app.globalData.userInfo.phone = tempUserInfo.phone
                    app.globalData.userInfo.nickName = tempUserInfo.customerName
                    app.globalData.userInfo.avatarUrl = tempUserInfo.headerImage
                    app.globalData.userInfo.gender = tempUserInfo.sex
                    that.jumpToHome();
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
      fail(res) {
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
      },
      complete(res) {
        wx.hideLoading();
      },
    })
  },

  /**
   * 注册成功
   * res 请求成功数据
   */
  requestSuccess: function (res) {
    let that = this;
    if (res.data.prompt == app.requestPromptValueName.success) {
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
   * 跳转首页
   */
  jumpToHome: function () {
    wx.switchTab({
      url: '/pages/consigned/base/base',
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