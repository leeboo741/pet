/**
 * ******** 托运页面 ********
 * ===================================================================================================================================
 * 购买托运服务===================================================================================================================================
 */
//获取应用实例
const app = getApp()
var util = require("../../../utils/util.js");

Page({
  data: {
    bannerData: [
      { 
        imgPath: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2313265963,3645707579&fm=26&gp=0.jpg'
      },
      { 
        imgPath: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=491368047,2525649626&fm=26&gp=0.jpg'
      }
    ], // banner 数据
    rate: 2, // 保价费率
    totalPrice: 0, // 总计金额
    beginCity: null, // 始发城市
    endCity: null, // 目的城市
    date: null, // 发货日期
    startDate: null, // 选择开始日期
    endDate: null, // 选择结束日期
    week: null, // 发货星期
    petCount: 0, // 发货数量
    petType: null, // 宠物类型
    petBreed: null, // 宠物品种
    petWeight: 0, // 宠物重量
    transportTypes: [
      {
        transportName: "专车", // 运输方式名称
        transportId: 1, // 运输方式id
        transportDescription: "主人陪同坐专车", // 运输方式说明
      },
      {
        transportName: "铁路", // 运输方式名称
        transportId: 2, // 运输方式id
        transportDescription: "主人陪同坐火车", // 运输方式说明
      },
      {
        transportName: "单飞", // 运输方式名称
        transportId: 3, // 运输方式id
        transportDescription: "主人陪同坐飞机", // 运输方式说明
      },
      {
        transportName: "随机", // 运输方式名称
        transportId: 4, // 运输方式id
        transportDescription: "主人陪同坐飞机", // 运输方式说明
      },
      {
        transportName: "大巴", // 运输方式名称
        transportId: 5, // 运输方式id
        transportDescription: "主人陪同坐大巴", // 运输方式说明
      },
    ], // 运输方式
    selectedTransportObj: null, // 选中运输方式Index
    valueAddedServices: [
      {
        valueAddedServicesName:"购买航空箱", // 增值服务名称
        valueAddedServicesId:0, // 增值服务Id
        valueAddedServicesPrice: 20, // 增值服务 价钱
        valueAddedServicesRate: 0, // 增值服务 费率
        valueAddedServicesInfo: {}, // 增值服务 附加信息
        selected: false, // 是否选中
      },
      {
        valueAddedServicesName: "上门接宠", // 增值服务名称
        valueAddedServicesId: 1, // 增值服务Id
        valueAddedServicesPrice: 20, // 增值服务 价钱
        valueAddedServicesRate: 0, // 增值服务 费率
        valueAddedServicesInfo: {}, // 增值服务 附加信息
        selected: false, // 是否选中

      },
      {
        valueAddedServicesName: "送宠到家", // 增值服务名称
        valueAddedServicesId: 2, // 增值服务Id
        valueAddedServicesPrice: 20, // 增值服务 价钱
        valueAddedServicesRate: 0, // 增值服务 费率
        valueAddedServicesInfo: {}, // 增值服务 附加信息
        selected: false, // 是否选中
      },
      {
        valueAddedServicesName: "保价", // 增值服务名称
        valueAddedServicesId: 3, // 增值服务Id
        valueAddedServicesPrice: 0, // 增值服务 价钱
        valueAddedServicesRate: 2, // 增值服务 费率
        valueAddedServicesInfo: {}, // 增值服务 附加信息
        selected: false, // 是否选中
      },
    ], // 增值服务
  },

  /* ============================= 页面生命周期 Start ============================== */

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {
    let tempDateObj = util.dateLater(new Date(),0);
    let endDateObj = util.dateLater(new Date(), 365);
    this.setData({
      date: tempDateObj.time,
      week: tempDateObj.week,
      startDate: tempDateObj.time,
      endDate: endDateObj.time,
      selectedTransportObj: this.data.transportTypes[0],
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
    if (app.globalData.trainBeginCity != null) {
      this.setData({
        beginCity: app.globalData.trainBeginCity
      })
    }
    if (app.globalData.trainEndCity != null) {
      this.setData({
        endCity: app.globalData.trainEndCity
      })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /* ============================= 页面生命周期 End ============================== */

  /* ============================= 页面事件 Start ============================== */

  /**
   * 点击增值服务
   */
  tapValueAddedServicesAction: function(e) {
    let valueAddedServiceObj = this.data.valueAddedServices[e.currentTarget.dataset.index];
    valueAddedServiceObj.selected = !valueAddedServiceObj.selected;
    this.setData({
      valueAddedServices: this.data.valueAddedServices
    })
  },

  /**
   * 点击运输方式
   */
  tapTransportTypeAction: function(e){
    this.setData({
      selectedTransportObj: this.data.transportTypes[e.currentTarget.dataset.index]
    })
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
      url: '../city/city?cityType=begin',
    })
  },
  /**
   * 点击选择目的城市
   */
  bindEndCityView: function () {
    wx.navigateTo({
      url: '../city/city?cityType=end',
    })
  },
  /**
   * 点击拨打客服电话
   */
  tapServicePhoneAction: function(){
    wx.makePhoneCall({
      phoneNumber: app.globalData.servicePhone,
    })
  },
  /**
   * 点击预定
   */
  tapTakeOrderAction: function(){

  },

  /* ============================= 页面事件 End ============================== */

  /* ============================= 网络请求 Start ============================== */

  /**
   * 请求Banner数据
   */
  requestBanner: function () {

  },
  /**
   * 查询价格
   */
  requestPrice: function() {

  },
  /**
   * 提交预定
   */
  requestOrder: function () {

  },

  /* ============================= 网络请求 End ============================== */
});