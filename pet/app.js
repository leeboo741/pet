//app.js
var QQMapWX = require('libs/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
var qqmapsdk;

App({
  onLaunch: function () {
    console.log("------------ app onLaunch ------------");
    console.log("地址：" + this.url.url);
    // var that = this;
    // // 实例化API核心类
    // qqmapsdk = new QQMapWX({
    //   key: '3IQBZ-UHKR6-XS4S2-M5GKI-XYW76-5ZF2D'
    // });
    // // 微信定位接口
    // wx.getLocation({
    //   type: "gcj02",
    //   success: function (res) {
    //     console.log("------------ 定位成功 ------------");
    //     console.log(res);
    //     // 将经纬度交给 globalData 保管
    //     const latitude = res.latitude;
    //     const longitude = res.longitude;
    //     that.globalData.location = {};
    //     that.globalData.location.latitude = latitude;
    //     that.globalData.location.longitude = longitude;
    //     if (that.locationReadyCallBack) {
    //       that.locationReadyCallBack(that.globalData.location);
    //     }
    //     // qq地图地理编码 将经纬度 解析成 地理位置信息
    //     qqmapsdk.reverseGeocoder({
    //       // 传入经纬度坐标
    //       location: {
    //         latitude: latitude,
    //         longitude: longitude
    //       },
    //       // 成功回调
    //       success: function (addressRes) {
    //         console.log("----------- 地理位置解析 -------------");
    //         console.log(addressRes);
    //         /** 将地理位置信息交给 globalData 保管 */
    //         var addressStr = addressRes.result.formatted_addresses.recommend;
    //         that.globalData.address = addressStr;
    //         that.globalData.province = addressRes.result.address_component.province;
    //         that.globalData.city = addressRes.result.address_component.city;
    //         that.globalData.district = addressRes.result.address_component.district;
    //         that.globalData.street = addressRes.result.address_component.street;
    //         that.globalData.streetNumber = addressRes.result.address_component.street_number;
    //         that.globalData.detailAddress = addressRes.result.address;
    //         if (that.addressReadyCallback) {
    //           that.addressReadyCallback(addressStr);
    //         }
    //       },
    //       fail(res) {
    //         console.log("----------- 地理位置解析失败 -------------");
    //         console.log(JSON.stringify(res));
    //       },
    //     })
    //   },
    // })
  },
  globalData: {
    /** =========== 全局数据 Start =========== */
    servicePhone: "0791-012234221", // 客服电话
    code: null,
    /** =========== 全局数据 End =========== */

    /** =========== 地理信息 Start =========== */
    // location: {
    //   latitude: null, // 纬度
    //   longitude: null, // 经度
    // },
    // address: null, // 当前地址
    // province: null, // 省份
    // city: null, // 市
    // district: null, // 区县
    // street: null, // 街道
    // streetNumber: null, // 门牌号
    // detailAddress: null, // 详细地址
    /** =========== 地理信息 End =========== */

    /** 用户信息 */
    userInfo: {
      customerNo: null, // id
      nickName: null, // 昵称
      avatarUrl: null, // 头像
      gender: null, // 性别
      openid: null, // openId
      phone: null, // 手机号
    }, // 用户信息

  },

  /** =========== 网络请求 Start =========== */
  url: {
    url: "http://192.168.3.187:5050",
    /** ============== 用户 =================== */ 
    register: "/api/customer/",
    login: "/api/oAuth",
    updateCustomer: "/api/customer/updateCustomer",
  },
  requestPromptValueName: {
    success: "Success",
    error: "Error",
    notExist: "NotExist"
  }
  /** =========== 网络请求 End =========== */
})