// pages/map/map.js

var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
const config = require("../../utils/config.js");
const AddressUtil = require("../../utils/addressUtil.js");
const Util = require("../../utils/util.js");
const PagePath = require("../../utils/pagePath.js");
const app = getApp();

const Map_Id = "MyMap";

const Type_Enum = {
  Receive: "receive",
  Send: "send"
}
/**
 * 传进来 城市名称
 * 通过城市名称 获取区县列表
 * 默认 区县为 区县列表第一列数据
 * 定位
 * 反编译中心点位置
 * 给 province city district detailAddress address 赋值，
 * markers 添加 中心点标注 为 first 数据
 * qqmapSdk 获取 周边 宠物相关 poi点  添加进markers列表 (暂时不搜索poi)
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
 * qqmapSdk 获取 周边 宠物相关 poi点  添加进markers列表 (暂时不搜索poi)
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
    type: null, // 类型
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
    mapMarkers: [], // 地图标注点集合
    mapCtx: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      city: options.city,
      district: options.district,
      detailAddress: options.address,
      type: options.type
    })
    this.getDistrictListByCity();
    qqmapsdk = new QQMapWX({
      key: config.Key_QQ_Map
    });

    let that = this;
    this.geocoderAddress(this.data.city + this.data.district + this.data.detailAddress,
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
  // tapAddress: function(e) {
  //   wx.navigateTo({
  //     url: PagePath.Path_Map_AddressSearch + "?city=" + this.data.city + "&district+" + this.data.district,
  //   })
  // },

  /**
   * 点击地图
   */
  tapMap: function(e) {
    console.log("tapMap: \n" + JSON.stringify(e));
    this.setMapCenter(e.detail)
  },

  /**
   * 确认选择
   */
  confirmSelect: function () {
    let locationData = {
      latitude: this.data.mapCenterLocation.latitude,
      longitude: this.data.mapCenterLocation.longitude,
      province: this.data.province,
      city: this.data.city,
      district: this.data.district,
      detailAddress: this.data.detailAddress,
    }

    if (this.data.type == Type_Enum.Receive) {
      app.globalData.receiveLocation = locationData;
    } else if (this.data.type == Type_Enum.Send) {
      app.globalData.sendLocation = locationData;
    }

    wx.navigateBack({

    })
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
    let that = this;
    this.reGeocoderLocation(this.data.mapCenterLocation,
      function reGeocoderCallback(res) {
        if (res.address_component.city == that.data.city) {
          that.setData({
            address: res.address,
            province: res.address_component.province,
            city: res.address_component.city,
            district: res.address_component.district,
            detailAddress: res.formatted_addresses.recommend
          })
          let marker = that.createMarker(
            {
              latitude: res.location.lat,
              longitude: res.location.lng,
            },
            res.formatted_addresses.recommend
          )
          that.setData({
            mapMarkers: [marker]
          })
        } else {
          wx.showToast({
            title: '您已超出起始城市范围',
            icon: 'none'
          })
          that.setData({
            mapCenterLocation: {
              latitude: that.data.mapMarkers[0].latitude,
              longitude: that.data.mapMarkers[0].longitude
            }
          })
        }
        
      }
    )
  },

  /**
   * 创建一个marker
   * @param location 坐标
   * @param detailAddress 
   */
  createMarker: function (location, detailAddress) {
    let marker = null;
    marker = {
      id: 0,
      latitude: location.latitude,
      longitude: location.longitude,
      iconPath: "/resource/location_marker.png",
      width: "60rpx",
      height: "60rpx",
      label: {
        content: detailAddress,
        fontSize: 16,
        padding: 6,
        display: "ALWAYS",
        borderRadius: 3,
        bgColor: "#000000d2",
        color: "#fff",
        anchorX: 0,
        anchorY: 0
      }
    }
    return marker;
  },

  /**
   * 获取区县列表
   */
  getDistrictListByCity: function() {
    this.data.districtList = AddressUtil.getDistrictByCity(this.data.city);
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