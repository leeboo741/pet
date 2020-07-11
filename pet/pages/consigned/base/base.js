/**
 * ******** 托运页面 ********
 * ===============================================================================
 * 购买托运服务
 * ===============================================================================
 */
//获取应用实例
const app = getApp()
var util = require("../../../utils/util.js");
const config = require("../../../utils/config.js");
const loginUtil = require("../../../utils/loginUtils.js");
const pagePath = require("../../../utils/pagePath.js");
const ShareUtil = require("../../../utils/shareUtils.js");
const AddressUtil = require("../../../utils/addressUtil.js");

var QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;

const CheckAbleStation_Type_Receipt = 0;
const CheckAbleStation_Type_Send = 1;

Page({
  data: {
    userInfo: null,
    bannerData: [
      { 
        imgPath: 'https://img.taochonghui.com/weapp/banner01.jpg'
      },
    ], // banner 数据
    storePhone:null, // 商家电话
    rate: 0, // 保价费率

    totalPrice: null, // 总计金额

    beginCity: null, // 始发城市 
    endCity: null, // 目的城市

    date: null, // 发货日期
    startDate: null, // 选择开始日期
    endDate: null, // 选择结束日期
    week: null, // 发货星期

    petCount: 0, // 发货数量

    petWeight: 0, // 宠物重量
    petMaxWeight: null, // 宠物最大重量限制

    petType: null, // 选中宠物类别
    petClassify: null, // 选中宠物类型
    selectPetTypeIndex: 0, // 选中的宠物类别 Index
    // selectPetClassifyIndex: 0, // 选中的宠物类型 Index
    petTypes: [], // 宠物类别列表
    // petClassifys: [], // 宠物类型列表

    petAge: null, // 宠物年龄
    petAgeList: [
      "2个月 - 6个月",  "半岁 - 1岁",  "1岁 - 3岁", "3岁 - 6岁", "6岁 - 9岁", "9岁以上"
    ],

    transportTypes: [
      {
        transportName: "专车", // 运输方式名称
        transportId: 1, // 运输方式id
        // transportDescription: "主人陪同坐专车", // 运输方式说明
        disable: true, // 是否禁用
      },
      {
        transportName: "铁路", // 运输方式名称
        transportId: 2, // 运输方式id
        // transportDescription: "主人陪同坐火车", // 运输方式说明
        disable: true, // 是否禁用
      },
      {
        transportName: "单飞", // 运输方式名称
        transportId: 3, // 运输方式id
        // transportDescription: "主人陪同坐飞机", // 运输方式说明
        disable: true, // 是否禁用
      },
      {
        transportName: "随机", // 运输方式名称
        transportId: 4, // 运输方式id
        // transportDescription: "主人跟随一起乘坐飞机", // 运输方式说明
        disable: true, // 是否禁用
      },
      {
        transportName: "大巴", // 运输方式名称
        transportId: 5, // 运输方式id
        // transportDescription: "主人陪同坐大巴", // 运输方式说明
        disable: true, // 是否禁用
      },
    ], // 运输方式
    selectedTransportObj: null, // 选中运输方式Index

    addServerAirBox: {
      name: "购买宠物箱", // 增值服务名称
      selected: false, // 是否选中
      alert: "自备航空箱需符合航空公司要求的适用规则！", // 提示
      ableUse: false, // 是否可用
      contract: "《航空箱说明》"
    },
    addServerReceivePet: {
      name: "上门接宠",
      selected: false, // 是否选中
      receiveDistrictList: null, // 上门接宠区县列表
      receiveDistrict: null, // 上门接宠区县
      address: null, // 地址
      haveAbleStation: false, // 是否有可用站点
      contract: "《接宠超免费范围另行付费》",
      latitude: null,
      longitude: null,
    },
    addServerSendPet: {
      name: "送宠到家",
      selected: false,
      sendDistrictList: null, // 送宠到家区县列表
      sendDistrict: null, // 送宠到家区县
      address: null, // 地址
      haveAbleStation: false, // 是否有可用站点
      contract: "《送宠路费由当地网点另收》",
      latitude: null,
      longitude: null,
    },
    addServerInsuredPrice: {
      name: "声明价值",
      selected: false,
      rate: 0, // 费率
      price: 1000, // 保价金额
      // alert: "最低估价1000元，最高估价6000元", // 
      contract: "《须知》"
    },
    addServerPetCan: {
      ableUse: false,
      name: "免费旅行餐", // 名称
      selected: false, // 是否选中
      alert: "免费旅行餐由比瑞吉公司赠送。非必要选择。产品质量由比瑞吉公司把关，与斑马速运无关！",
      contract: "《旅行餐说明》"
    },
    addGuarantee: {
      name: "中介担保", // 增值服务名称
      selected: false, // 是否选中
      alert: "", // 提示
      contract: "《担保注意事项》"
    },
    addServerWater: {
      ableUse: true,
      name: "饮水器",
      selected: false,
      alert: "",
      contract: "",
    },

    countInputFocus: false,
    classifyInputFocus: false,
    weightInpuFocus: false,
  },

  /* ============================= 页面生命周期 Start ============================== */

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {

    qqmapsdk = new QQMapWX({
      key: config.Key_QQ_Map
    });
    // 初始化 发货日期 数据
    let tempDateObj = util.dateLater(new Date(),0);
    let endDateObj = util.dateLater(new Date(), 365);
    this.setData({
      date: tempDateObj.time,
      week: tempDateObj.week,
      startDate: tempDateObj.time,
      endDate: endDateObj.time,
    })
    this.requestPetType();
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
      userInfo: loginUtil.getUserInfo()
    })
    if (app.globalData.selectClassifyName != null) {
      this.setData({
        petClassify: app.globalData.selectClassifyName
      })
      app.globalData.selectClassifyName = null;
    }

    // 接受 城市选择页面 返回数据
    if (app.globalData.trainBeginCity != null && app.globalData.trainBeginCity != this.data.beginCity) {
      // 重置运输方式
      for (let i = 0; i < this.data.transportTypes.length; i++){
        this.data.transportTypes[i].disable = true;
      }
      // 重置 上门接宠 市区选择器
      this.data.addServerReceivePet.receiveDistrictList = AddressUtil.getDistrictByCity(app.globalData.trainBeginCity);
      this.data.addServerReceivePet.receiveDistrict = this.data.addServerReceivePet.receiveDistrictList[0];
      // 重置 上门接宠
      this.data.addServerReceivePet.latitude = null;
      this.data.addServerReceivePet.longitude = null;
      this.data.addServerReceivePet.address = null;
      this.data.addServerReceivePet.selected = false;
      this.data.addServerReceivePet.haveAbleStation = true;
      // 重置 送宠到家 市区选择器
      this.data.addServerSendPet.sendDistrictList = null;
      this.data.addServerSendPet.sendDistrict = null;
      // 重置 送宠到家 地址 并且关闭 送宠到家
      this.data.addServerSendPet.latitude = null;
      this.data.addServerSendPet.longitude = null;
      this.data.addServerSendPet.address = null;
      this.data.addServerSendPet.selected = false;
      this.data.addServerSendPet.haveAbleStation = false;

      this.setData({
        beginCity: app.globalData.trainBeginCity, // 设置始发城市
        addServerReceivePet: this.data.addServerReceivePet, // 设置 上门接宠
        endCity: null, // 清空目的城市
        addServerSendPet: this.data.addServerSendPet, // 重置 送宠到家
        selectedTransportObj: null, // 清空 选中的 运输方式
        petMaxWeight: null,
        transportTypes: this.data.transportTypes, // 重置 运输方式列表 
      })
      // 查询店铺电话
      this.requestStroePhoneByCityName(app.globalData.trainBeginCity);
      // 查询保价费率
      this.requestInsurePriceRate(app.globalData.trainBeginCity);
      // this.checkAbleStation(app.globalData.trainBeginCity, CheckAbleStation_Type_Receipt);
      app.globalData.trainBeginCity = null;
    } else if (this.data.beginCity == null) {
      let that = this;
      this.requestLocation(
        function getCurrentLocationCallback(location) {
          that.reGeocoderLocation(location,
            function regeoCallback(result) {
              let beginCity = result.address_component.city;
              let district = result.address_component.district;
              let detailAddress = result.formatted_addresses.recommend;
              that.requestStartCityData(
                function getStartCityListCallback(citys) {
                  for (let i = 0; i < citys.length; i++) {
                    let tempCity = citys[i].cityName;
                    if (beginCity == tempCity) {
                      that.data.addServerReceivePet.receiveDistrictList = AddressUtil.getDistrictByCity(beginCity);
                      that.data.addServerReceivePet.receiveDistrict = district;
                      that.data.addServerReceivePet.address = detailAddress;
                      that.data.addServerReceivePet.latitude = location.latitude;
                      that.data.addServerReceivePet.longitude = location.longitude;
                      that.data.addServerReceivePet.haveAbleStation = true;
                      that.setData({
                        beginCity: beginCity,
                        addServerReceivePet: that.data.addServerReceivePet
                      })
                      // 查询店铺电话
                      that.requestStroePhoneByCityName(beginCity);
                      // 查询保价费率
                      that.requestInsurePriceRate(beginCity);
                      break;
                    }
                  }
                }
              )
             
            }
          )
        }
      )
    }


    if (app.globalData.trainEndCity != null && app.globalData.trainEndCity != this.data.endCity) {
      // 重置 送宠到家 市区选择器
      this.data.addServerSendPet.sendDistrictList = AddressUtil.getDistrictByCity(app.globalData.trainEndCity);
      this.data.addServerSendPet.sendDistrict = this.data.addServerSendPet.sendDistrictList[0];
      // 重置 送宠到家
      this.data.addServerSendPet.longitude = null;
      this.data.addServerSendPet.latitude = null;
      this.data.addServerSendPet.address = null;
      this.data.addServerSendPet.selected = false;
      this.data.addServerSendPet.haveAbleStation = true;
      this.setData({
        addServerSendPet: this.data.addServerSendPet, // 重置 送宠到家
        endCity: app.globalData.trainEndCity, // 设置 目的城市
        selectedTransportObj: null, // 清空 选中的 运输方式
        petMaxWeight: null,
      })
      // 查询可用的运输方式列表
      this.checkAbleTransportType();
      // 查询是否有可用站点
      // this.checkAbleStation(app.globalData.trainEndCity, CheckAbleStation_Type_Send);
      app.globalData.trainEndCity = null;
    }

    if (app.globalData.receiveLocation != null) {
      this.data.addServerReceivePet.receiveDistrict = app.globalData.receiveLocation.district;
      this.data.addServerReceivePet.latitude = app.globalData.receiveLocation.latitude;
      this.data.addServerReceivePet.longitude = app.globalData.receiveLocation.longitude;
      this.data.addServerReceivePet.address = app.globalData.receiveLocation.detailAddress;
      this.setData({
        addServerReceivePet: this.data.addServerReceivePet
      })
      app.globalData.receiveLocation = null;
      this.predictPrice();
    }

    if (app.globalData.sendLocation != null) {
      this.data.addServerSendPet.sendDistrict = app.globalData.sendLocation.district;
      this.data.addServerSendPet.latitude = app.globalData.sendLocation.latitude;
      this.data.addServerSendPet.longitude = app.globalData.sendLocation.longitude;
      this.data.addServerSendPet.address = app.globalData.sendLocation.detailAddress;
      this.setData({
        addServerSendPet: this.data.addServerSendPet
      })
      app.globalData.sendLocation = null;
      this.predictPrice();
    }
  },

  /**
   * 请求始发城市数据
   * @param getStartCityDataCallback
   */
  requestStartCityData: function (getStartCityDataCallback) {
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_StartCity,
      success(res) {
        if (util.checkIsFunction(getStartCityDataCallback)) {
          getStartCityDataCallback(res.data.data.bodys);
        }
      },
      fail(res) {
        wx.showToast({
          title: '获取始发城市列表失败',
          icon: 'none'
        })
      },
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
        if (util.checkIsFunction(getReGeocoderCallback)) {
          getReGeocoderCallback(res.result);
        }
      },
      fail(res) {
        console.error(res);
      },
    })
  },

  /**
   * 请求当前位置
   * @param getCurrentLocationCallback
   */
  requestLocation: function (getCurrentLocationCallback) {
    let that = this;
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        console.log("------------ 定位成功 ------------");
        console.log(res);
        // 将经纬度交给 globalData 保管
        const latitude = res.latitude;
        const longitude = res.longitude;
        if (util.checkIsFunction(getCurrentLocationCallback)) {
          getCurrentLocationCallback({
            latitude: latitude,
            longitude: longitude
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '定位失败',
          icon: 'none'
        })
      },
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
    app.globalData.trainBeginCity = null;
    app.globalData.trainEndCity = null;
    console.log("/base/base 销毁")
  },

  /* ============================= 页面生命周期 End ============================== */

  /* ============================= 页面事件 Start ============================== */

  /**
   * 点击 航空箱 说明
   */
  tapAirBoxContract: function () {
    console.log("点击 航空箱 说明");
    wx.navigateTo({
      url: pagePath.Path_Contract_Airbox,
    })
  },

  /**
   * 点击 接宠 说明
   */
  tapReceivePetContract: function () {
    console.log("点击 接宠 说明");
    wx.navigateTo({
      url: pagePath.Path_Contract_Receive,
    })
  },

  /**
   * 点击 送宠 说明
   */
  tapSendPetContract: function () {
    console.log("点击 送宠 说明");
    wx.navigateTo({
      url: pagePath.Path_Contract_Send,
    })
  },

  /**
   * 点击 保价 说明
   */
  tapInsuredContract: function () {
    console.log("点击 保价 说明");
    wx.navigateTo({
      url: pagePath.Path_Contract_Insured,
    })
  },

  /**
   * 点击 旅行餐 说明
   */
  tapPetCanContract: function () {
    console.log("点击 旅行餐 说明");
    wx.navigateTo({
      url: pagePath.Path_Contract_petCan,
    })
  },

  /**
   * 点击 中介 说明
   */
  tapGuaranteeContract: function (e) {
    console.log("点击 中介说明");
    wx.navigateTo({
      url: pagePath.Path_Contract_Guarantee,
    })
  },

  /**
   * 上门接宠区域选择
   */
  bindReceivePickerChange: function (e) {
    this.data.addServerReceivePet.receiveDistrict = this.data.addServerReceivePet.receiveDistrictList[e.detail.value];
    this.setData({
      addServerReceivePet: this.data.addServerReceivePet
    })
  },

  /**
   * 送宠到家区域选择
   */
  bindSendPickerChange: function (e) {
    this.data.addServerSendPet.sendDistrict = this.data.addServerSendPet.sendDistrictList[e.detail.value];
    this.setData({
      addServerSendPet: this.data.addServerSendPet
    }) 
  },

  /**
   * 点击领取免费罐头
   */
  tapAddServerPetCan: function () {
    this.data.addServerPetCan.selected = !this.data.addServerPetCan.selected;
    this.setData({
      addServerPetCan: this.data.addServerPetCan
    })
  },

  /**
   * 点击中介担保
   */
  tapAddServerGuarantee: function(){
    this.data.addGuarantee.selected = !this.data.addGuarantee.selected;
    this.setData({
      addGuarantee: this.data.addGuarantee
    })
  },

  /**
   * 点击购买航空箱
   */
  tapAddServerAirBox: function () {
    this.data.addServerAirBox.selected = !this.data.addServerAirBox.selected;
    this.setData({
      addServerAirBox: this.data.addServerAirBox
    })
    this.predictPrice();
  },

  /**
   * 点击选择上门接宠
   */
  tapAddServerReceivePet: function () {
    if (this.data.beginCity == null) {
      wx.showToast({
        title: '请先选择始发城市',
        icon: 'none'
      })
      return;
    }
    this.data.addServerReceivePet.selected = !this.data.addServerReceivePet.selected;
    this.predictPrice();
    this.setData({
      addServerReceivePet: this.data.addServerReceivePet
    })
  },

  /**
   * 送宠到家
   */
  tapAddServerSendPet: function () {
    if (this.data.endCity == null) {
      wx.showToast({
        title: '请先选择目的城市',
        icon: 'none'
      })
      return;
    }
    this.data.addServerSendPet.selected = !this.data.addServerSendPet.selected;
    if (!this.data.addServerSendPet.selected) {
      // 取消选中 置空 送宠地址 并且重新请求 价格数据
      this.predictPrice();
    }
    this.setData({
      addServerSendPet: this.data.addServerSendPet
    })
  },

  /**
   * 保价
   */
  tapAddServerInsuredPrice: function () {
    // 现在要必选
    return;
    if (this.data.beginCity == null) {
      wx.showToast({
        title: '请先选择始发城市',
        icon: 'none'
      })
      return;
    }
    this.data.addServerInsuredPrice.selected = !this.data.addServerInsuredPrice.selected;
    if (!this.data.addServerInsuredPrice.selected) {
      // 取消选中 归零保价金额 并且重新请求 价格数据
      this.data.addServerInsuredPrice.price = 0;
      this.predictPrice();
    }
    this.setData({
      addServerInsuredPrice: this.data.addServerInsuredPrice
    })
  },

  /**
   * 点击运输方式
   */
  tapTransportTypeAction: function(e){
    let tempObj = this.data.transportTypes[e.currentTarget.dataset.index];
    if (tempObj.disable) {
      wx.showToast({
        title: '当前始发和目的城市不支持该运输方式！',
        icon: 'none'
      })
      return;
    }
    if (this.data.beginCity == null || this.data.endCity == null) {
      wx.showToast({
        title: '请先选择始发城市和目的城市',
        icon: 'none'
      })
    } else {
      this.setData({
        selectedTransportObj: tempObj
      })
      this.predictPrice();
      this.checkMaxWeight();
      this.checkPetCageAble();
    }
  },

  /**
   * 日期选择
   */
  bindTimeChange: function(e) {
    let tempDate = e.detail.value;
    tempDate = new Date(tempDate);
    tempDate = util.dateLater(tempDate,0);
    this.setData({
      date: tempDate.time,
      week: tempDate.week,
    })
  },

  /**
   * 点击选择始发城市
   */
  bindBeginCityView: function () {
    wx.navigateTo({
      url: pagePath.Path_Order_City + '?cityType=begin',
    })
  },

  /**
   * 点击选择目的城市
   */
  bindEndCityView: function () {
    if (this.data.beginCity == null) {
      wx.showToast({
        title: '请先选择始发城市',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: pagePath.Path_Order_City + '?cityType=end&start=' + this.data.beginCity,
      })
    }

  },

  /**
   * 选择宠物类型
   */
  selectPetType: function (e) {
    if (e.detail.value == this.data.selectPetTypeIndex) {
      return;
    }
    this.setData({
      selectPetTypeIndex: e.detail.value,
      petType: this.data.petTypes[e.detail.value]
    })
    // this.requestPetClassify(this.data.petType);
  },

  /**
   * 选择宠物种类
   */
  // selectPetClassify: function (e) {
  //   if (e.detail.value == this.data.selectPetClassifyIndex) {
  //     return;
  //   }
  //   this.setData({
  //     selectPetClassifyIndex: e.detail.value,
  //     petClassify: this.data.petClassifys[e.detail.value]
  //   })
  //   this.predictPrice();
  // },

  /**
   * 点击宠物种类
   */
  // tapPetClassify: function () {
  //   if (util.checkEmpty(this.data.petType)) {
  //     wx.showToast({
  //       title: '请先选择宠物类型',
  //       icon: 'none'
  //     })
  //     return;
  //   }
  //   if (util.checkEmpty(this.data.petClassifys)) {
  //     wx.showToast({
  //       title: '暂无宠物种类数据',
  //       icon: 'none'
  //     })
  //     return;
  //   }
  // },

  /**
   * 输入数量
   */
  countInput: function (e) {
    let tempInput = e.detail.value;
    if (tempInput == null || tempInput.length <= 0) {
      tempInput = 0;
    }
    tempInput = parseInt(tempInput);
    this.setData({
      petCount: tempInput
    })
  },

  /**
   * 数量获取焦点
   */
  countFocus: function () {
    this.setData({
      countInputFocus: true
    })
  },

  /**
   * 数量失去焦点
   */
  countOutFocus: function () {
    this.setData({
      countInputFocus: false
    })
    this.predictPrice();
  },

  /**
   * 输入重量
   */
  weightInput: function (e) {
    let tempInput = e.detail.value;
    if (tempInput == null || tempInput.length <= 0) {
      tempInput = 0;
    }
    tempInput = parseInt(tempInput);
    this.setData({
      petWeight: tempInput
    })

    this.checkPetWeight();
  },

  /**
   * 重量获取焦点
   */
  weightFocus: function() {
    this.setData({
      weightInpuFocus: true
    })
  },

  /**
   * 重量失去焦点
   */
  weightOutFocus: function () {
    this.setData({
      weightInpuFocus: false
    })
    this.predictPrice();
  },

  /**
   * 选择接宠具体位置
   */
  selectReceiveDetailAddress: function () {
    wx.navigateTo({
      url: pagePath.Path_Map + "?city=" + this.data.beginCity + "&district=" + this.data.addServerReceivePet.receiveDistrict + "&address=" + this.data.addServerReceivePet.address + "&type=receive",
    })
  },

  /**
   * 选择送宠具体位置
   */
  selectSendDetailAddress: function (e) {
    wx.navigateTo({
      url: pagePath.Path_Map + "?city=" + this.data.endCity + "&district=" + this.data.addServerSendPet.sendDistrict + "&address=" + this.data.addServerSendPet.address + "&type=send",
    })
  },

  /**
   * 保价金额输入
   */
  inputInsuredPrice: function (e) {
    let tempInput = e.detail.value;
    if (tempInput == null || tempInput.length <= 0) {
      tempInput = 0;
    }
    tempInput = parseInt(tempInput);
    this.data.addServerInsuredPrice.price = tempInput
    this.setData({
      addServerInsuredPrice: this.data.addServerInsuredPrice
    })
  },

  /**
   * 保价金额失去焦点
   */
  insuredPriceOutFocus: function () {
    let tempInput = this.data.addServerInsuredPrice.price;
    if (!(tempInput < 6000 && tempInput > 1000)) {
      if (tempInput < 1000) {
        wx.showToast({
          title: '最低1000元',
        })
        tempInput = 1000;
      }
      if (tempInput > 6000) {
        wx.showToast({
          title: '最高6000元',
        })
        tempInput = 6000;
      }
      this.data.addServerInsuredPrice.price = tempInput
      this.setData({
        addServerInsuredPrice: this.data.addServerInsuredPrice
      })
      return;
    }
    this.predictPrice();
  },

  /**
   * 点击拨打客服电话
   */
  tapServicePhoneAction: function(){
    let tempPhone = config.Service_Phone;
    if (this.data.beginCity != null && this.data.storePhone != null) {
      tempPhone = this.data.storePhone;
    }
    wx.makePhoneCall({
      phoneNumber: tempPhone,
    })
  },

  /**
   * 点击预定
   */
  tapTakeOrderAction: function(){
    this.subscribeMessage();
    if (this.data.beginCity == null) {
      wx.showToast({
        title: '请选择始发城市',
        icon: 'none'
      })
      return;
    }
    if (this.data.endCity == null) {
      wx.showToast({
        title: '请选择目的城市',
        icon: 'none'
      })
      return;
    }
    if (this.data.petCount == 0) {
      wx.showToast({
        title: '请填写宠物数量',
        icon: 'none'
      })
      return;
    }
    if (this.data.petWeight == 0) {
      wx.showToast({
        title: '请填写宠物重量',
        icon: 'none'
      })
      return;
    }
    if (this.data.petType == null) {
      wx.showToast({
        title: '请选择宠物类别',
        icon: 'none'
      })
      return;
    }
    if (this.data.petClassify == null) {
      wx.showToast({
        title: '请输入宠物品种',
        icon: 'none'
      })
      return;
    }
    if (this.data.petAge == null) {
      wx.showToast({
        title: '请输入宠物年龄',
        icon: 'none'
      })
      return;
    }
    if (this.data.selectedTransportObj == null) {
      wx.showToast({
        title: '请选择运输方式',
        icon: 'none'
      })
      return;
    }
    if (this.data.addServerReceivePet.selected) {
      if (this.data.addServerReceivePet.address == null
        || this.data.addServerReceivePet.address.length <= 0) {
        wx.showToast({
          title: '请选择接宠地址',
          icon: 'none'
        })
        return;
      }
    }
    if (this.data.addServerSendPet.selected) {
      if (this.data.addServerSendPet.address == null
        || this.data.addServerSendPet.address.length <= 0) {
        wx.showToast({
          title: '请选择送宠地址',
          icon: 'none'
        })
        return;
      }
    }
    // if (this.data.addServerInsuredPrice.selected) {
    //   if (this.data.addServerInsuredPrice.price == 0) {
    //     wx.showToast({
    //       title: '请输入保价金额',
    //       icon: 'none'
    //     })
    //     return;
    //   }
    // }
    let tempUrl = pagePath.Path_Order_Pay 
                  + '?start=' + this.data.beginCity
                  + '&end=' + this.data.endCity
                  + '&count=' + this.data.petCount
                  + '&type=' + this.data.petType
                  + '&classify=' + this.data.petClassify
                  + '&age=' + this.data.petAge
                  + '&weight=' + this.data.petWeight
                  + '&transport=' + this.data.selectedTransportObj.transportId
                  + '&leavedate=' + this.data.date;
    if (this.data.addServerPetCan.selected) {
      tempUrl = tempUrl + "&petcan=1";
    }
    if (this.data.addGuarantee.selected) {
      tempUrl = tempUrl + "&guarantee=1";
    }
    if (this.data.addServerAirBox.selected) {
      tempUrl = tempUrl + "&airbox=1";
    }
    if (this.data.addServerReceivePet.selected) {
      tempUrl = tempUrl + "&receiveaddress=" + this.data.beginCity + this.data.addServerReceivePet.receiveDistrict + this.data.addServerReceivePet.address + "&receivelatitude=" + this.data.addServerReceivePet.latitude + "&receivelongitude=" + this.data.addServerReceivePet.longitude;
    }
    if (this.data.addServerSendPet.selected) {
      tempUrl = tempUrl + "&sendaddress=" + this.data.endCity + this.data.addServerSendPet.sendDistrict + this.data.addServerSendPet.address + "&sendlatitude=" + this.data.addServerSendPet.latitude + "&sendlongitude=" + this.data.addServerSendPet.longitude;
    }
    if (this.data.addServerInsuredPrice.selected) {
      tempUrl = tempUrl + "&insuredprice=" + this.data.addServerInsuredPrice.price;
    }

    wx.navigateTo({
      url: tempUrl
    })
  },

  /**
   * 计算预估金额
   */
  predictPrice: function () {
    if (this.data.beginCity == null) {
      this.setData({
        totalPrice: null
      })
      wx.hideLoading();
      return;
    }
    if (this.data.endCity == null) {
      this.setData({
        totalPrice: null
      })
      wx.hideLoading();
      return;
    }
    if (this.data.petCount == 0) {
      this.setData({
        totalPrice: null
      })
      wx.hideLoading();
      return;
    }
    if (this.data.petWeight == 0) {
      this.setData({
        totalPrice: null
      })
      wx.hideLoading();
      return;
    }
    if (this.data.selectedTransportObj == null) {
      this.setData({
        totalPrice: null
      })
      wx.hideLoading();
      return;
    }
    if (this.data.petClassify == null) {
      this.setData({
        totalPrice: null
      })
      wx.hideLoading();
      return;
    }
    if (this.data.petType == null) {
      this.setData({
        totalPrice: null
      })
      wx.hideLoading();
      return;
    }
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestPredictPrice();
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '暂未登录',
          content: '登录后才能获取预估价格',
          success(res){
            if (res.confirm) {
              loginUtil.login();
            }
          }
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return ShareUtil.getOnShareAppMessageForShareOpenId();
  }, 

  /* ============================= 页面事件 End ============================== */

  /* ============================= 网络请求 Start ============================== */

  /**
   * 查询保价费率
   */
  requestInsurePriceRate: function (cityName) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_InsureRate,
      data: {
        "startCity": cityName
      },
      success(res) {
        wx.hideLoading();
        console.log("查询保价费率 success => \n" + JSON.stringify(res))
        if (res.data.data != null) {
          that.data.addServerInsuredPrice.rate = res.data.data.rate * 100;
        } else {
          that.data.addServerInsuredPrice.rate = 0;
          that.data.addServerInsuredPrice.selected = false;
          that.data.addServerInsuredPrice.price = 0;
        }
        that.setData({
          addServerInsuredPrice: that.data.addServerInsuredPrice
        })
      },
      fail(res) {
        wx.hideLoading();
        console.log("查询保价费率 fail => \n" + JSON.stringify(res))
        wx.showToast({
          title: '查询保价费率失败',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("查询保价费率 complete => \n" + JSON.stringify(res))
      },
    })
  },

  /**
   * 查询预估金额
   */
  requestPredictPrice: function () {
    wx.showLoading({
      title: '请稍等...'
    })
    let tempData = {
      "customerNo": loginUtil.getCustomerNo(),
      "startCity": this.data.beginCity,
      "endCity": this.data.endCity,
      "transportType": this.data.selectedTransportObj.transportId,
      "weight": this.data.petWeight,
      "num": this.data.petCount,
      "leaveDate": this.data.date,
      "petClassify": this.data.petClassify,
      "petAge": this.data.petAge,
      "petType": this.data.petType,
      "receiverName" : "",
      "receiverPhone": "",
      "senderName": "",
      "senderPhone": "",
      "remarks": "",
    };
    tempData.sendAddress = "";
    if (this.data.addServerSendPet.selected) {
      if (this.data.addServerSendPet.address == null
        || this.data.addServerSendPet.address.length <= 0) {
        wx.showToast({
          title: '请输入送宠地址',
          icon: 'none'
        })
        return;
      } else {
        tempData.sendAddress = this.data.endCity + this.data.addServerSendPet.sendDistrict + this.data.addServerSendPet.address;
      }
    }
    tempData.receiptAddress = "";
    if (this.data.addServerReceivePet.selected) {
      if (this.data.addServerReceivePet.address == null 
        || this.data.addServerReceivePet.address.length <= 0) {
        wx.showToast({
          title: '请输入接宠地址',
          icon: 'none'
        })
        return;
      } else {
        tempData.receiptAddress = this.data.beginCity + this.data.addServerReceivePet.receiveDistrict + this.data.addServerReceivePet.address;
      }
    }
    tempData.buyPetCage = "0";
    if (this.data.addServerAirBox.selected) {
      tempData.buyPetCage = "1"
    }
    tempData.giveFood = "0";
    if (this.data.addServerPetCan.selected) {
      tempData.giveFood = "1";
    }
    tempData.guarantee = "0";
    if (this.data.addGuarantee.selected) {
      tempData.guarantee = "1";
    }
    tempData.petAmount = 0;
    // if (this.data.addServerInsuredPrice.selected) {
    //   if (this.data.addServerInsuredPrice.price == 0) {
    //     wx.showToast({
    //       title: '请输入保价金额',
    //       icon: 'none'
    //     })
    //     return;
    //   } else {
    //     tempData.petAmount = this.data.addServerInsuredPrice.price;
    //   }
    // }
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_PredictPrice,
      data: tempData,
      method: "POST",
      success(res) {
        wx.hideLoading();
        console.log("获取预估价格 success => \n" + JSON.stringify(res));
        if (res.data.code == config.RES_CODE_SUCCESS) {
          that.setData({
            totalPrice: res.data.data
          })
        } else {
          let msg = res.data.message;
          if (msg == null) {
            msg = "系统异常"
          }
          wx.showToast({
            title: msg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.hideLoading();
        console.log("获取预估价格 fail => \n" + JSON.stringify(res));
        wx.showToast({
          title: '获取预估价格失败',
          icon: 'none'
        })
      },
    })
  },

  /**
   * 查询最大重量
   */

  /**
   * 查询可用的运输方式
   */
  checkAbleTransportType: function () {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
      icon: 'none'
    })
    wx.request({
      url: config.URL_Service + config.URL_AbleTransportType,
      data: {
        "startCity" : this.data.beginCity,
        "endCity" : this.data.endCity,
      },
      success(res) {
        wx.hideLoading();
        console.log("获取可用运输方式 success => \n" + JSON.stringify(res));
        let ableList = res.data.data;
        for (let i = 0; i < that.data.transportTypes.length; i++) {
          that.data.transportTypes[i].disable = true;
        }
        for (let i = 0; i < ableList.length; i++) {
          let index = ableList[i];
          that.data.transportTypes[index-1].disable = false;
        }
        that.setData({
          transportTypes: that.data.transportTypes
        })
      },
      fail(res) {
        wx.hideLoading();
        console.log("获取可用运输方式 fail => \n" + JSON.stringify(res));
        wx.showToast({
          title: '获取可用运输方式失败',
          icon: 'none'
        })
      },
      complete(res) {
      },
    })
  },

  /**
   * 请求宠物类型
   */
  requestPetType: function () {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    let urlstr = config.URL_Service + config.URL_PetType;
    // 向服务器请求登陆，返回 本微信 在服务器状态，注册|未注册，
    wx.request({
      url: urlstr, // 服务器地址
      success: res => {
        wx.hideLoading();
        console.log("success => " + JSON.stringify(res));
        if (res.data.code == config.RES_CODE_SUCCESS) {
          if (util.checkEmpty(res.data.data)) {
            wx.showToast({
              title: '没有查到宠物类型数据',
              icon: 'none'
            })
            return;
          }
          that.setData({
            petTypes: res.data.data,
            // petClassifys: null,
            selectPetTypeIndex: 0,
            // selectPetClassifyIndex: 0,
            petType: res.data.data[0],
            petClassify: null
          })
          // that.requestPetClassify(that.data.petType);
        }
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '查询宠物类型失败',
          icon: 'none',
        })
      },
      complete(res) {
      },
    })
  },

  /**
   * 输入宠物品种
   */
  petClassifyInput: function (e) {
    let tempClassify = e.detail.value;
    if (util.checkEmpty(tempClassify)) {
      tempClassify = null;
    }
    this.setData({
      petClassify: tempClassify
    })
  },

  /**
   * 品种获取焦点
   */
  petClassifyFocus: function() {
    this.setData({
      classifyInputFocus: true
    })
    wx.navigateTo({
      url: pagePath.Path_Order_ClassifySelect,
    })
  },

  /**
   * 品种失去焦点
   */
  petClassifyOutFocus: function () {
    this.setData({
      classifyInputFocus: false
    })
  },

  /**
   * 输入宠物年龄
   */
  petAgeInput: function (e) {
    let tempAge = e.detail.value;
    if (util.checkEmpty(tempAge)) {
      tempAge = null;
    }
    this.setData({
      petAge : tempAge
    })
  },

  /**
   * 选择宠物年龄
   */
  selectPetAge: function(e) {
    this.setData({
      petAge: this.data.petAgeList[e.detail.value]
    })
  },

  /**
   * 查询宠物箱是否可用
   */
  checkPetCageAble: function(){
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_MaxWeight,
      data: {
        startCity: this.data.beginCity,
        endCity: this.data.endCity,
        transportType: this.data.selectedTransportObj.transportId,
      },
      success(res) {
        console.log("查询宠物箱是否可用 success:\n" + JSON.stringify(res));
        if (res.data.data == null || res.data.data == false) {
          that.data.addServerAirBox.ableUse = false;
          that.data.addServerAirBox.selected = false;
          that.setData({
            addServerAirBox: that.data.addServerAirBox,
          })
        } else {
          that.data.addServerAirBox.ableUse = true;
          that.setData({
            addServerAirBox: that.data.addServerAirBox,
          })
        }
      },
      fail(res) {
        console.log("查询宠物箱 fail:\n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: "none"
        })
      },
      complete(res) {
        console.log("查询宠物箱 complete:\n" + JSON.stringify(res));
      }
    })
  },

  /**
   * 查询最大重量限制
   */
  checkMaxWeight: function () {
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_AblePetCage,
      data: {
        startCity: this.data.beginCity,
        endCity: this.data.endCity,
        transportType: this.data.selectedTransportObj.transportId,
      },
      success(res) {
        console.log("查询宠物箱 success:\n" + JSON.stringify(res));
        if (res.data.data != null) {
          that.data.petMaxWeight = res.data.data;
          that.setData({
            petMaxWeight: that.data.petMaxWeight,
          })
          that.checkPetWeight();
        }
      },
      fail(res) {
        console.log("查询宠物箱 fail:\n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: "none"
        })
      },
      complete(res) {
        console.log("查询宠物箱 complete:\n" + JSON.stringify(res));
      }
    })
  },

  /**
   * 查询送宠|接宠可用站点
   * @param cityName 城市名称
   * @param type 查询类型 0 接宠 1 送宠
   */
  checkAbleStation: function (cityName, type) {
    let urlStr = config.URL_Service + config.URL_AbleStation_Receipt;
    if (type == CheckAbleStation_Type_Send) {
      urlStr = config.URL_Service + config.URL_AbleStation_Send;
    }
    let that = this;
    wx.request({
      url: urlStr,
      data: {
        "cityName": cityName 
      },
      success(res) {
        console.log("查询送宠|接宠可用站点 success => \n" + JSON.stringify(res));
        if (res.data.data == null || res.data.data.length <= 0) {
          if (type == CheckAbleStation_Type_Receipt) {
            that.data.addServerReceivePet.haveAbleStation = false;
            that.data.addServerReceivePet.selected = false;
          } else {
            that.data.addServerSendPet.haveAbleStation = false;
            that.data.addServerSendPet.selected = false;
          }
        } else {
          if (type == CheckAbleStation_Type_Receipt) {
            that.data.addServerReceivePet.haveAbleStation = true;
          } else {
            that.data.addServerSendPet.haveAbleStation = true;
          }
        }
        if (type == CheckAbleStation_Type_Receipt) {
          that.setData({
            addServerReceivePet: that.data.addServerReceivePet
          })
        } else {
          that.setData({
            addServerSendPet: that.data.addServerSendPet
          })
        }
      },
      fail(res) {
        console.log("查询送宠|接宠可用站点 fail => \n" + JSON.stringify(res));

        if (type == CheckAbleStation_Type_Receipt) {
          wx.showToast({
            title: '查询接宠可用站点失败',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '查询送宠可用站点失败',
            icon: 'none'
          })
        }
      },
      complete(res) {

      }
    })
  },

  /**
   * 请求商家电话
   */
  requestStroePhoneByCityName: function(cityName) {
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_GetStorePhoneByCityName,
      data: {
        cityName: cityName
      },
      success(res){
        console.log("获取商家电话 城市（" + cityName + "） success => \n" + JSON.stringify(res));
        that.setData({
          storePhone: res.data.data
        })
      },
      fail(res) {
        console.log("获取商家电话 城市（" + cityName + "） fail => \n" + JSON.stringify(res));
        wx.showToast({
          title: '网络原因，获取客服电话失败',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("获取商家电话 城市（" + cityName + "） complete => \n" + JSON.stringify(res));
      },
    })
  },

  /**
   * 请求Banner数据
   */
  requestBanner: function () {},

  /* ============================= 网络请求 End ============================== */

  /**
   * 检查重量
   */
  checkPetWeight: function(){
    if (this.data.petMaxWeight != null) {
      if (this.data.petWeight > this.data.petMaxWeight) {
        let that = this;
        wx.showModal({
          title: '超出' + this.data.selectedTransportObj.transportName + '托运重量限制',
          content: this.data.beginCity + '——' +this.data.endCity + this.data.selectedTransportObj.transportName + '最大托运重量为' + this.data.petMaxWeight + 'kg',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              that.data.addServerAirBox.selected = false;
              that.data.selectedTransportObj = null;
              that.setData({
                addServerAirBox: that.data.addServerAirBox,
                selectedTransportObj: that.data.selectedTransportObj,
                petMaxWeight: null,
              })
              that.predictPrice();
            }
          }
        })
      }
    }
  },

  subscribeMessage: function(sendMessageCallback){
    let that = this;
    //需要订阅的消息模板，在微信公众平台手动配置获取模板ID
    let message = [
      "i_TmjhoPeu5x7L1OVrZapCcJo0rZKmXN9xjQCE7hBAc",
      "6uwTclmrk9vYOT2AsWGLqOP5y0ZJsVsYW-stdcEkOSU",
      "0i3nHNkfOI1FwsuTSMfhAUnmbBzwB0c01R2Ef0Z7TcE"
    ]
    //如果总是拒绝（subscriptionsSetting，2.10.1库才支持）
    if(this.checkVersion('2.10.1')){
      wx.getSetting({
        withSubscriptions: true,//是否同时获取用户订阅消息的订阅状态，默认不获取
        success: (res)=> {
          console.log(res)
          if (res.subscriptionsSetting && res.subscriptionsSetting.itemSettings &&
              res.subscriptionsSetting.itemSettings[message] == "reject"){
            //打开设置去设置
            this.openConfirm('需要打开微信消息推送权限，是否去设置打开？')
          }else {
            this.sendSubscribeMessage(message, null);
          }
        }
      })
    }else if(this.checkVersion('2.4.4')){
      this.recursionSend(message, 0);
    }
  },

  recursionSend: function (message, index) {
    let that = this;
    if (message.length - 1 >= index) {
      this.sendSubscribeMessage(message[index], function completeCallback(res) {
        index = index + 1;
        that.recursionSend(message, index);
      })
    }
  },

  sendSubscribeMessage: function (message, completeCallback) {
    if (message == null && typeof message == 'undefined') {
      return;
    }
    let sendMessage = [];
    let str = typeof message;
    if (typeof message == 'string') {
      sendMessage.push(message);
    } else if (typeof message == 'object') {
      sendMessage = message;
    } else {
      return;
    }
    wx.requestSubscribeMessage({
      tmplIds: sendMessage,
      success: (res)=> {
      },
      fail: (res)=> { 
        console.info(res) 
      },
      complete: (res)=> {
        if (util.checkIsFunction(completeCallback)) {
          completeCallback(res);
        }
      }
    })
  },

  //打开设置
  openConfirm: function(message) {
    wx.showModal({
      content: message,
      confirmText: "确认",
      cancelText: "取消",
      success: (res) => {
          //点击“确认”时打开设置页面
          if (res.confirm) {
              wx.openSetting({
                  success: (res) => {
                      console.log(res.authSetting)
                  },
                  fail: (error) => {
                      console.log(error)
                  }
              })
          } else {
              console.log('用户点击取消')
          }
      }
    });
  },
  //基础库版本比较
  checkVersion(v) {
    const version = wx.getSystemInfoSync().SDKVersion
    if (this.compareVersion(version, v) >= 0) {
        return true
    } else {
        return false
    }
  },

  compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)
  
    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }
  
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])
  
      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
  
    return 0
  },
});
