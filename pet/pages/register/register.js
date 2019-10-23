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
const util = require("../../utils/util.js");
const ShareUtil = require("../../utils/shareUtils.js");

const intervalDuration = 60;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: "", // 输入的电话号码
    backType: 0, // 回退方式 0 回退一层 1 回退两层
    code: null, // 验证码
    getCodeTitle: "获取验证码", // 获取验证码按钮标题
    ableGetCode: true, // 是否允许获得验证码
    intervalID: null, // 获取验证码定时器Id
    intervalCount: intervalDuration, // 重新获取验证码倒计时
    cookie: null, // 获取验证码的cookie 包含有sessionId 提交申请的时候 服务器需要 通过sessionId 获取短信验证码 微信每次请求会清空sessionId
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      backType : options.backtype
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
    console.log("/register/register 销毁")
    clearInterval(this.data.intervalID);
    this.data.intervalID = null;
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
    return ShareUtil.getOnShareAppMessageForShareOpenId();
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
   * 请求短信验证码
   */
  requestCode: function (phone) {
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_GetCode,
      data: {
        phoneNumber: phone,
      },
      success(res) {
        console.log("获取验证码 success: \n" + JSON.stringify(res))
        let tempCookie = res.header["Set-Cookie"];
        that.setData({
          cookie: tempCookie
        })
      },
      fail(res) {
        console.log("获取验证码 fail: \n" + JSON.stringify(res))
      }
    })
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
    if (this.data.code == null || this.data.code.length <= 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
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
      "openId": app.globalData.openId,
      "customerName": app.globalData.nickName,
      "headerImage": app.globalData.avatarUrl,
      "sex": app.globalData.gender,
      "phone": this.data.phoneNumber,
      "verificationCode": this.data.code
    }
    tempData.shareOpenId = "";
    if (app.ShareData.openId != null) {
      tempData.shareOpenId = app.ShareData.openId
    }
    console.log("绑定数据 => " + JSON.stringify(tempData));
    wx.request({
      url: config.URL_Service + config.URL_Register,
      data: tempData, // 参数
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "cookie": this.data.cookie
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
    let that = this;
    loginUtil.login(function loginCallback(state, msg){
      if (state == loginUtil.Login_Success) {
        let backCount = 1;
        if (that.data.backType != 0) {
          backCount = 2;
        }
        wx.navigateBack({
          delta: backCount
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
      let msg = '绑定失败！';
      if (res.data.root != null && res.data.root.length > 0) {
        msg = res.data.root;
      }
      wx.showToast({
        title: msg,
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
  inputPhone: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  /**
   * 输入验证码
   */
  inputCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  /**
     * 获取验证码
     */
  getCode: function (e) {
    if (this.data.ableGetCode) {
      if (util.checkEmpty(this.data.phoneNumber) || !util.isPhoneAvailable(this.data.phoneNumber)) {
        wx.showToast({
          title: '请输入正确手机号码！',
          icon: 'none',
        })
        return;
      }
      console.log("开始倒计时");
      this.interval();
      this.requestCode(this.data.phoneNumber)
    }
    console.log("正在倒计时");
  },

  /**
   * 开始倒计时
   */
  interval: function (e) {
    let that = this;
    clearInterval(this.data.intervalID);
    this.data.intervalID = setInterval(function () {
      let tempCount = that.data.intervalCount;
      tempCount--;
      if (tempCount > 0) {
        that.setData({
          getCodeTitle: tempCount + '秒后获取',
          intervalCount: tempCount,
          ableGetCode: false
        })
        console.log("倒计时===> " + tempCount);
        that.interval();
      } else {
        that.setData({
          getCodeTitle: "获取验证码",
          intervalCount: intervalDuration,
          ableGetCode: true
        })
        console.log("倒计时结束");
        clearInterval(that.data.intervalID);
        that.data.intervalID = null;
      }
    }, 1000);
  },

})