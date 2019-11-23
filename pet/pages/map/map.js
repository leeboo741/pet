// pages/map/map.js

var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
const config = require("../../utils/config.js");
const AddressUtil = require("../../utils/addressUtil.js");
const Util = require("../../utils/util.js");

const Map_Id = "MyMap";

/**
 * 传进来 城市名称
 * 通过城市名称 获取区县列表
 * 默认 区县为 区县列表第一列数据
 * 定位
 * 反编译中心点位置
 * 给 province city district detailAddress address 赋值，
 * markers 添加 中心点标注 为 first 数据
 * qqmapSdk 获取 周边 宠物相关 poi点  添加进markers列表
 * 数据初始化完成
 * 
 * 点击地图时 获取点击处位置坐标
 * 编译坐标
 * 给 province city district detailAddress address 赋值
 * 替换 markers first 数据
 * 
 * 点击其他 markers 数据， 获取markers 数据 替换markers first 数据
 * 
 * 地图区域改变的时候，
 * qqmapSdk 获取 周边 宠物相关 poi点  添加进markers列表
 * 
 * 点击地址栏 跳转 地址搜索页面
 * 传过去城市和区县
 * 地址搜索栏 选择 区县 填写详细地址
 * 选择 填写 完成后 反编译地址 
 * 返回 地图页 刷新数据
 * 
 * 地图页选择完成后 将地址数据传回上个页面
 * 
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    province: null, // 省份
    city: null, // 城市
    district: null, // 区县
    districtList: null, // 区县列表
    detailAddress: null, // 详细地址
    address: null, // 完整地址
    mapScale: 16, // 地图缩放等级
    mapCenterLocation: {
      latitude: 23.099994,
      longitude: 113.324520,
    }, // 地图中心坐标
    mapMarkers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      title: 'T.I.T 创意园',
      iconPath: "/resource/index_business_station.png",
      width: "40rpx",
      height: "40rpx",
      callout: {
        content: "文本",
        fontSize: 15,
        padding: 3,
        display:"BYCLICK"
      },
    }], // 地图标注点集合
    mapCtx: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      city: options.city,
    })
    this.getDistrictListByCity();
    qqmapsdk = new QQMapWX({
      key: config.Key_QQ_Map
    });

    let that = this;
    this.geocoderAddress(this.data.city + this.data.district,
      function getGeocoderCallback(result) {
        that.setMapCenter(result);
      }
    )
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
    if (this.data.mapCtx == null) {
      this.data.mapCtx = wx.createMapContext(Map_Id);
    }
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
   * 点击地址
   */
  tapAddress: function(e) {
  },

  /**
   * 点击地图
   */
  tapMap: function(e) {
    console.log("tapMap: \n" + JSON.stringify(e));
  },

  /**
   * 点击标注
   */
  tapMarker: function(e) {
    console.log("tapMarker: \n" + JSON.stringify(e));
  },

  /**
   * 点击标注气泡
   */
  tapCallout: function (e)  {
    console.log("tapCallout: \n" + JSON.stringify(e));
  },

  /**
   * 设置地图中心
   * @param location
   */
  setMapCenter: function(location) {
    this.setData({
      mapCenterLocation: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    })
    this.reGeocoderLocation(this.data.mapCenterLocation,
      function reGeocoderCallback(res) {

      }
    )
  },

  /**
   * 获取区县列表
   */
  getDistrictListByCity: function() {
    this.data.districtList = AddressUtil.getDistrictByCity(this.data.city);
    this.data.district = this.data.districtList[0];
  },

  /**
   * 地址解析
   * @param address 要编译的地址
   * @param getGeocoderCallback 编译回调
   */
  geocoderAddress: function (address, getGeocoderCallback) {
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: address, //地址参数
      success: function (res) {//成功后的回调
        console.log("geocoder: \n" + JSON.stringify(res));
        var result = {
          latitude: res.result.location.lat,
          longitude: res.result.location.lng
        }
        if (Util.checkIsFunction(getGeocoderCallback)) {
          getGeocoderCallback(result);
        }
      },
      fail: function (error) {
        console.error(error);
      }
    })
  },

  /**
   * 逆地址解析
   * @param location
   * @param getReGeocoderCallback
   */
  reGeocoderLocation: function (location, getReGeocoderCallback) {
    qqmapsdk.reverseGeocoder({
      location: location,
      success(res) {
        console.log("regeocoder: \n" + JSON.stringify(res));
        if (Util.checkIsFunction(getReGeocoderCallback)) {
          getReGeocoderCallback(res.result);
        }
      },
      fail(res) {
        console.error(res);
      },
    })
  },

  /**
   * 地图区域改变
   */
  changeRegion: function (e)  {
    console.log("changeRegion: \n" + JSON.stringify(e));
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      var that = this;
      this.data.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: function (res) {
          console.log("getCenterLocation: \n" + JSON.stringify(res));
        },
        fail: function (e) {
          console.log(e)
        }
      })
    }
  }
})