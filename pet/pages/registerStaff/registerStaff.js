// pages/registerStaff/registerStaff.js

const config = require("../../utils/config.js");
const util = require("../../utils/util.js");
const loginUtil = require("../../utils/loginUtils.js");

const intervalDuration = 60;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null, // 名称
    phone: null, // 手机号
    code: null, // 验证码
    region: null, // 区域
    province: null, // 省
    city: null, // 市
    district: null, // 区
    stationList: null, // 站点列表
    selectStaionIndex: 0, // 选中的站点
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
    this.setData({
      phone: loginUtil.getPhone()
    })
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
    this.requestStationList(this.data.province, this.data.city);
  },

  /**
   * 选择站点
   */
  selectStation: function (e) {
    if (util.checkEmpty(this.data.region)) {
      wx.showToast({
        title: '请先选择省/市/区',
        icon: 'none'
      })
      return;
    }
    this.setData({
      selectStaionIndex: parseInt(e.detail.value) 
    })
  },

  /**
   * 提交申请
   */
  tapApply: function () {
    console.log("提交申请：\n" + JSON.stringify(this.data));
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        if (util.checkEmpty(that.data.name)) {
          wx.showToast({
            title: '请填写名称',
            icon: 'none'
          })
          return;
        }
        if (util.checkEmpty(that.data.phone)) {
          wx.showToast({
            title: '请输入手机号码',
            icon: 'none'
          })
          return;
        }
        if (util.checkEmpty(that.data.code)) {
          wx.showToast({
            title: '请输入验证码',
            icon: 'none'
          })
          return;
        }
        if (util.checkEmpty(that.data.region)) {
          wx.showToast({
            title: '请选择区域',
            icon:'none'
          })
          return;
        }
        if (!util.checkEmpty(that.data.stationList) && util.checkEmpty(that.data.stationList[that.data.selectStaionIndex])) {
          wx.showToast({
            title: '请选择站点',
            icon: 'none'
          })
          return;
        }
        that.requestApply();
      } else {
        wx.showModal({
          title: '尚未登陆',
          content: '请先登录后再提交申请',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          }
        })
      }
    })
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
   * 请求站点列表
   * @param province 省
   * @param city 市
   */
  requestStationList: function (province, city) {
    wx.showLoading({
      title: '查询站点中...',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_GetStationListByLocation,
      data: {
        province : province,
        city: city
      },
      success(res) {
        console.log("获取站点列表 success: \n" + JSON.stringify(res));
        that.setData({
          stationList: res.data.data
        })
      },
      fail(res) {
        console.log("获取站点列表 fail: \n" + JSON.stringify(res));
      },
      complete(res) {
        wx.hideLoading();
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
    let tempStaffObj = {
      openId: loginUtil.getOpenId(),
      phone: this.data.phone,
      staffName: this.data.name,
      station: this.data.stationList[this.data.selectStaionIndex],
      verificationCode: this.data.code,
    };

    let tempData = {
      staff: JSON.stringify(tempStaffObj)
    };
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_Register_Staff,
      data: tempStaffObj,
      header: {
        "cookie": that.data.cookie
      },
      method: "POST", // 请求方式
      success(res) {
        console.log("注册员工 success:\n" + JSON.stringify(res));
        if (res.data.code == 200) {
          wx.showToast({
            title: '申请提交成功',
            duration: 2000,
          })
          that.data.timeOutID = setTimeout(function () {
            wx.navigateBack({

            })
          }, 2000)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("注册员工 fail:\n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("注册员工 complete:\n" + JSON.stringify(res));
        wx.hideLoading();
      }
    })
  },
})