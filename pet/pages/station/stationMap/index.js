// pages/station/stationMap/index.js

var qqmapsdk;
const app = getApp();
const Map_Id = "MyMap";
const Util = require("../../../utils/util.js");
const Config = require("../../../utils/config.js");
const ShareUtil = require("../../../utils/shareUtils.js");
var QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
const LoadFootItemState = require("../../../lee-components/leeLoadingFootItem/loadFootObj.js");

const Limit = 20;

const Default_Map_Scale = 4;
const Min_Map_Scale = 3;
const Max_Map_Scale = 20;
const Province_Scale = 6;
const Detail_Scale = 16;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentLocation: null, // 当前位置坐标
    mapScale: Default_Map_Scale, // 地图缩放等级
    mapCenterLocation: {}, // 地图中心坐标
    mapMarkers: [], // 地图标注点集合
    mapCtx: null, // 地图对象
    province: null, // 地图中心省份

    allStationList: [], // 所有网点列表
    pageIndex: 0, // 页码
    loadState: LoadFootItemState.Loading_State_Normal, // 加载状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: Config.Key_QQ_Map
    });
    let that = this;
    this.requestLocation(function getLocationCallback(res){
      // 将经纬度交给 globalData 保管
      const latitude = res.latitude;
      const longitude = res.longitude;
      that.data.currentLocation = {};
      that.data.currentLocation.latitude = latitude;
      that.data.currentLocation.longitude = longitude;
      that.setMapCenter(that.data.currentLocation);
      that.requestStation(that.data.currentLocation);
    });
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
    if (this.data.loadState == LoadFootItemState.Loading_State_End ||
      this.data.loadState == LoadFootItemState.Loading_State_Loading) {
      return;
    }
    this.setData({
      loadState: LoadFootItemState.Loading_State_Loading,
    })
    this.requestStation(this.data.currentLocation);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * ========================= Set ==========================
   */

  /**
   * 设置地图中心
   * @param location
   */
  setMapCenter: function (location) {
    // 设置地图中心
    this.setData({
      mapCenterLocation: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    })
    this.requestData(this.data.mapScale, this.data.mapCenterLocation);
  },

  /**
   * 设置地图缩放级别
   */
  setMapScale: function (scale) {
    if (this.data.mapScale == scale) return;
    if (scale < Min_Map_Scale) {
      scale = Min_Map_Scale;
    }
    if (scale > Max_Map_Scale) {
      scale = Max_Map_Scale;
    }
    this.setData({
      mapScale: scale
    })
    this.requestData(this.data.mapScale, this.data.mapCenterLocation);
  },

  /**
   * ======================= Create Markers ========================
   */

  /**
   * 组装marker列表
   */
  createMarkerListByBusinessList: function (businessList, showCityName, markerListCallback) {
    let that = this;
    let markerList = [];
    for (var index = 0; index < businessList.length; index++) {
      var businessObj = businessList[index];
      let businessLocation = {
        latitude: businessObj.latitude,
        longitude: businessObj.longitude
      }
      let businessName = showCityName ? "" : businessObj.businessName;
      markerList.push(that.createMarker(index, businessLocation, businessName, businessObj));
    }
    if (markerListCallback && typeof markerListCallback == 'function') {
      markerListCallback(markerList);
    }
  },

  /**
   * 创建一个marker
   * @param location 坐标
   * @param detailAddress 
   */
  createMarker: function (id, location, name, obj) {
    let marker = null;
    marker = {
      id: id,
      latitude: location.latitude,
      longitude: location.longitude,
      iconPath: "/resource/location_marker.png",
      width: "60rpx",
      height: "60rpx",
      businessObj:obj
    }
    if (name!=null&&name.length > 0) {
      marker.label = {
        content: name,
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
   * ======================= 定位和解析 =======================
   */

  /**
   * 请求当前位置
   */
  requestLocation: function (getLocationCallback) {
    wx.showLoading({
      title: '请稍等...',
    })
    if (this.data.currentLocation) {
      wx.hideLoading();
      if (getLocationCallback && typeof getLocationCallback == 'function') {
        getLocationCallback(this.data.currentLocation);
      }
    } else {
      let that = this;
      wx.getLocation({
        type: "gcj02",
        success: function (res) {
          wx.hideLoading();
          console.log("------------ 定位成功 ------------");
          console.log(res);
          if (getLocationCallback && typeof getLocationCallback == 'function') {
            getLocationCallback(res);
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '定位失败,请稍后再试',
            icon: 'none'
          })
          wx.hideLoading();
        },
      })
    }
  },

  /**
   * 地址解析 地址转坐标
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
   * 逆地址解析 坐标转地址
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
   * ======================= 列表事件 =========================
   */

  /**
   * 点击驿站
   */
  tapStationItem: function (e) {
    let tempStation = this.data.allStationList[e.currentTarget.dataset.index];
    this.setMapScale(Detail_Scale);
    this.setMapCenter({
      latitude: tempStation.latitude,
      longitude: tempStation.longitude
    })
  },

  /**
   * 点击驿站名称
   */
  tapStationName: function (e) {
    let tempStation = this.data.allStationList[e.currentTarget.dataset.index];
    console.log("点击驿站名称: " + tempStation.businessName + " | 驿站编号: " + tempStation.businessNo);
  },

  /**
   * 点击驿站地址
   */
  tapStationAddress: function (e) {
    let tempStation = this.data.allStationList[e.currentTarget.dataset.index];
    wx.openLocation({
      latitude: tempStation.latitude,
      longitude: tempStation.longitude
    })
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
   * ======================== 地图事件 =========================
   */

  /**
   * 点击标注
   */
  tapMarker: function (e) {
    let index = e.markerId;
    let businessObj = this.data.mapMarkers[index].businessObj;
    console.log('点击商家标注: ' + JSON.stringify(businessObj));
  },

  /**
   * 地图区域改变
   */
  changeRegion: function (e) {
    console.log("changeRegion: \n" + JSON.stringify(e));
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      var that = this;
      this.data.mapCtx.getScale({
        success(res) {
          console.log("当前Scale:" + res.scale)
          that.setMapScale(res.scale);
        }
      })
      // 获取地图中心点
      this.data.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: function (res) {
          console.log("getCenterLocation: \n" + JSON.stringify(res));
          that.setMapCenter(res);
        },
        fail: function (e) {
          console.log(e)
        }
      })
    }
  },

  /**
   * 点击地图
   */
  tapMap: function (e) {
    console.log("tapMap: \n" + JSON.stringify(e));
    this.setMapCenter(e.detail)
  },

  /**
   * ======================== 请求数据 ===========================
   */

  requestData: function(scale, location){
    let that = this;
    if (scale <= Province_Scale) {
      this.data.province = null;
      this.requestCityGroup(function getCityDataCallback(dataSource){
        that.createMarkerListByBusinessList(dataSource,true, function getMarkerListCallback(markers){
          that.setData({
            mapMarkers: markers
          })
        })
      })
    } else {
      // 根据经纬度坐标 解析地理信息
      this.reGeocoderLocation(location,
        function reGeocoderCallback(res) {
          // 如果解析出来的城市 和 当前城市相同，设置中心标注点
          // 如果不同，提醒超出范围
          if (res.address_component.province != that.data.province) {
            that.data.province = res.address_component.province;
            that.requestBusinessListByProvince(that.data.province, function getBusinessListCallback(dataSource){
              that.createMarkerListByBusinessList(dataSource, false, function createMarkersCallback(markers){
                that.setData({
                  mapMarkers: markers
                })
              })
            })
          } 
        }
      )
    }
  },

  /**
   * 获取商家城市分组
   * 
   * @param getCityGroupCallback
   */
  requestCityGroup: function(getCityGroupCallback) {
    wx.request({
      url: Config.URL_Service + Config.URL_GetBusinessCityGroup,
      success(res) {
        if (res.data.code == Config.RES_CODE_SUCCESS) {
          if (getCityGroupCallback && typeof getCityGroupCallback == 'function') {
            getCityGroupCallback(res.data.data);
          }
        } else {
          wx.showToast({
            title: '请求失败:' + res.data.code,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '请求失败',
          icon:'none'
        })
      }
    })
  },

  /**
   * 获取省份商铺信息
   */
  requestBusinessListByProvince: function(province, getBusinessByProvinceCallback){
    wx.request({
      url: Config.URL_Service + Config.URL_GetBusinessListByProvince + province,
      success(res) {
        if (res.data.code == Config.RES_CODE_SUCCESS) {
          if (getBusinessByProvinceCallback && typeof getBusinessByProvinceCallback == 'function') {
            getBusinessByProvinceCallback(res.data.data);
          }
        } else {
          wx.showToast({
            title: '请求失败:' + res.data.code,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 请求数据
   */
  requestStation: function (location) {
    let that = this;
    wx.request({
      url: Config.URL_Service + Config.URL_GetBusinessByPosition,
      data: {
        latitude: location.latitude,
        longitude: location.longitude,
        offset: this.data.pageIndex,
        limit: Limit
      },
      success(res) {
        console.log("获取周边商家列表 success: \n" + JSON.stringify(res));
        if (res.data.code != Config.RES_CODE_SUCCESS) {
          wx.showToast({
            title: '获取周边商家列表错误',
            icon: 'none'
          })
        } else {
          if (that.data.pageIndex == 0) {
            that.setData({
              allStationList: res.data.data,
              pageIndex: that.data.pageIndex + Limit,
              loadState: LoadFootItemState.Loading_State_Normal
            })
          } else {
            let tempData = that.data.allStationList.concat(res.data.data);
            that.data.pageIndex = that.data.pageIndex + Limit;
            if (res.data.data.length < Limit) {
              that.setData({
                allStationList: tempData,
                loadState: LoadFootItemState.Loading_State_End
              })
            } else {
              that.setData({
                allStationList: tempData,
                loadState: LoadFootItemState.Loading_State_Normal
              })
            }
          }
        }
      },
      fail(res) {
        console.log("获取周边商家列表 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '获取周边商家列表失败',
          icon: 'none'
        })
      },
    })
  },
})