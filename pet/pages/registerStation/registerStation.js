// pages/registerStation/registerStation.js

const config = require("../../utils/config.js");
const util = require("../../utils/util.js");
const ShareUtil = require("../../utils/shareUtils.js");

const intervalDuration = 60;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null, // 名称
    phone: null, // 手机号
    code: null, // 验证码
    startTime: null, // 开始时间
    endTime: null, // 结束时间
    region: null, // 区域
    province: null, // 省
    city: null, // 市
    district: null, // 区
    detail: null, // 详细地址
    describe: null, // 描述
    latitude: null, // 纬度
    longitude: null, // 经度
    getCodeTitle: "获取验证码", // 获取验证码按钮标题
    ableGetCode: true, // 是否允许获得验证码
    intervalID: null, // 获取验证码定时器Id
    intervalCount: intervalDuration, // 重新获取验证码倒计时
    cookie: null, // 获取验证码的cookie 包含有sessionId 提交申请的时候 服务器需要 通过sessionId 获取短信验证码 微信每次请求会清空sessionId
    timeOutID: null, // 
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
    clearInterval(this.data.intervalID);
    this.data.intervalID = null;
    clearTimeout(this.data.timeOutID);
    this.data.timeOutID = null;
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
   * 输入名称
   */
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  /**
   * 输入手机号
   */
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
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
      if (util.checkEmpty(this.data.phone) || !util.isPhoneAvailable(this.data.phone)) {
        wx.showToast({
          title: '请输入正确手机号码！',
          icon: 'none',
        })
        return;
      }
      console.log("开始倒计时");
      this.interval();
      this.requestCode(this.data.phone)
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

  /**
   * 选择开始时间
   */
  selectStartTime: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  /**
   * 选择结束时间
   */
  selectEndTime: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },

  /**
   * 选择省市区
   */
  selectRegion: function (e) {
    let tempRegion = e.detail.value;
    this.setData({
      region: tempRegion[0] + "/" + tempRegion[1] + "/" + tempRegion[2],
      province: tempRegion[0],
      city: tempRegion[1],
      district: tempRegion[2]
    })
  },

  /**
   * 输入地址
   */
  inputDetailAddress: function (e) {
    this.setData({
      detail: e.detail.value
    })
  },

  /**
   * 输入描述
   */
  inputDescribe: function (e) {
    this.setData({
      describe: e.detail.value
    })
  },

  /**
   * 提交申请
   */
  tapApply: function () {
    console.log("提交申请：\n" + JSON.stringify(this.data));
    if (util.checkEmpty(this.data.name)) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none'
      })
      return;
    }
    if (util.checkEmpty(this.data.phone) || !util.isPhoneAvailable(this.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      })
      return;
    }
    if (util.checkEmpty(this.data.code)) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return;
    }
    if (util.checkEmpty(this.data.startTime) || util.checkEmpty(this.data.endTime)) {
      wx.showToast({
        title: '请选择营业时间',
        icon: 'none'
      })
      return;
    }

    if (util.checkEmpty(this.data.region)) {
      wx.showToast({
        title: '请选择区域',
        icon: 'none'
      })
      return;
    }

    if (util.checkEmpty(this.data.detail)) {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none'
      })
      return;
    }
    this.requestApply();
  },


  /**
   * 请求短信验证码
   */
  requestCode: function (phone) {
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_GetCode,
      data: {
        phoneNumber: phone
      },
      success(res){
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
   * 请求申请
   */
  requestApply: function () {
    wx.showLoading({
      title: '提交申请中...',
    })
    let tempData = {
      businessName: this.data.name,
      phoneNumber: this.data.phone,
      startBusinessHours: this.data.startTime,
      endBusinessHours: this.data.endTime,
      describes: this.data.describe,
      province: this.data.province,
      city: this.data.city,
      detailAddress: this.data.district + this.data.detail,
      verificationCode: this.data.code,
    };
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_Register_Business,
      data: tempData,
      header: {
        // 'content-type': 'application/x-www-form-urlencoded',
        'coutent-type': 'application/json',
        "cookie": that.data.cookie
      },
      method: "POST", // 请求方式
      success(res){
        console.log("注册商家 success:\n" + JSON.stringify(res));
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '申请提交成功',
            duration: 1000,
          })
          that.data.timeOutID = setTimeout(function(){
            wx.navigateBack({
              
            })
          },1000)
        } else {
          let msg = "注册失败";
          if (!util.checkEmpty(res.data.message)) {
            msg = res.data.message;
          }
          wx.showToast({
            title: msg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.hideLoading();
        console.log("注册商家 fail:\n" + JSON.stringify(res));

        wx.showToast({
          title: "注册失败",
          icon: 'none'
        })
      },
      complete(res) {
        console.log("注册商家 complete:\n" + JSON.stringify(res));
      }
    })
  },

})