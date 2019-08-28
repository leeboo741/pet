// pages/station/station.js

const app = getApp();
const config = require("../../utils/config.js");
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stationList:[
      // {
      //   stationName: "南昌第一站点",
      //   stationAddress: "江西省南昌市青山湖区北京东路1666号",
      //   stationImages: null,
      //   stationLogo: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565613260260&di=f71dd50782dbd2ac7b1279d1f93a6ebd&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F12%2F39%2F63%2F93u58PICEMQ.jpg",
      //   stationPhone: '0791-32219342',
      //   stationBusinessHours: "08:00-22:00",
      // }
    ],
    location:null, // 位置信息
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
    this.requestLocation();
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
    console.log("/station/station 销毁")
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
   * 拨打电话
   */
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenumber,
    })
  },

  /**
   * 请求当前位置
   */
  requestLocation: function() {
    wx.showLoading({
      title: '请稍等...',
    })
    if (this.data.location) {
      this.requestStation();
    } else {
      let that = this;
      wx.getLocation({
        type: "gcj02",
        success: function (res) {
          console.log("------------ 定位成功 ------------");
          console.log(res);
          // 将经纬度交给 globalData 保管
          const latitude = res.latitude;
          const longitude = res.longitude;  
          that.data.location = {};
          that.data.location.latitude = latitude;
          that.data.location.longitude = longitude;
          that.requestStation();
        },
        fail: function (res) {
          wx.showToast({
            title: '定位失败,请重新再试',
            icon: 'none'
          })
          wx.hideLoading();
        },
      })
    }
  },

  /**
   * 请求数据
   */
  requestStation: function () {
    const latitude = this.data.location.latitude;
    const longitude = this.data.location.longitude;
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_GetBusinessByPosition,
      data: {
        latitude: this.data.location.latitude,
        longitude: this.data.location.longitude
      },
      success(res){
        console.log("获取周边商家列表 success: \n" + JSON.stringify(res));
        if (res.data.prompt != null && res.data.prompt == config.Error) {
          wx.showToast({
            title: '获取周边商家列表错误',
            icon: 'none'
          })
        } else {
          that.setData({
            stationList: res.data.data
          })
        }
      },
      fail(res) {
        console.log("获取周边商家列表 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '获取周边商家列表失败',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("获取周边商家列表 complete: \n" + JSON.stringify(res));
        wx.hideLoading();
      },
    })
  },

})