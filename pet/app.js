//app.js
var QQMapWX = require('libs/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
var qqmapsdk;

App({
  onLaunch: function () {
    var that = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'QUIBZ-EKGR2-FMWUD-CTYVT-6Z5LZ-MPBCJ'
    });

    // 微信定位接口
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        console.log("------------ app onLaunch ------------");
        console.log(res);
        const latitude = res.latitude;
        const longitude = res.longitude;
        that.globalData.location.latitude = latitude;
        that.globalData.location.longitude = longitude;
        if (that.locationReadyCallBack) {
          that.locationReadyCallBack(that.globalData.location);
        }
        // qq地图地理编码
        qqmapsdk.reverseGeocoder({
          // 传入经纬度坐标
          location: {
            latitude: latitude,
            longitude: longitude
          },
          // 成功回调
          success: function (addressRes) {
            console.log("----------- 地理位置解析 -------------");
            console.log(addressRes);
            var addressStr = addressRes.result.formatted_addresses.recommend;
            that.globalData.address = addressStr;
            if (that.addressReadyCallback) {
              that.addressReadyCallback(addressStr);
            }
          },
        })
      },
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.globalData.code = res.code
        if (that.codeReadyCallBack) {
          that.codeReadyCallBack(res)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    /** =========== 全局数据 Start =========== */
    servicePhone: "0791-012234221", // 客服电话
    code: null,
    /** =========== 全局数据 End =========== */

    /** =========== 地理信息 Start =========== */
    location: {
      latitude: null, // 纬度
      longitude: null, // 经度
    },
    address: null, // 当前地址
    province: null, // 省份
    city: null, // 市
    district: null, // 区县
    street: null, // 街道
    streetNumber: null, // 门牌号
    detailAddress: null, // 详细地址
    /** =========== 地理信息 End =========== */

  },

  /** =========== 网络请求 Start =========== */
  url: {
    url: "http://192.168.3.233:9090",
  },
  requestPromptValueName: {
    success: "Success",
    error: "Error",
    notExist: "NotExist"
  }
  /** =========== 网络请求 End =========== */
})