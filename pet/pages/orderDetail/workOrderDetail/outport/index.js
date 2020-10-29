
const { URL_UploadFile, URL_Service } = require("../../../../utils/config");
const notificationCenter = require("../../../../manager/notificationCenter");
const { WORKORDER_OUTPORT } = require("../../../../static/notificationName");
const workOrderManager = require("../../../../manager/orderManager/workOrderManager");
const util = require("../../../../utils/util");
const pagePath = require("../../../../utils/pagePath");
const commonOrderManager = require("../../../../manager/orderManager/commonOrderManager");
const loginUtils = require("../../../../utils/loginUtils");
const { PostTransportInfo } = require("../../../../manager/orderManager/workOrderManager");
const shareUtils = require("../../../../utils/shareUtils");

// pages/orderDetail/workOrderDetail/outport/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null, // 订单

    // 上传
    uploadUrl: null, // 上传地址
    formData: null, // 上传 表单数据

    imagePathList: [], // 图片

    outportDisable: false, // 按钮是否可用
    outportLoading: false, // 按钮是否loadin中

    // 物流
    transportNum: null, // 航班/车次号
    startCityCode: null, // 起始机场三字码
    endCityCode: null, // 目的机场三字码
    departureDate: null, // 出发时间
    expressNum: null, // 快递单号

    // 提货信息
    orderTaker:{
      contact: null, // 提货联系人
      phone: null, // 联系电话
      province: null, // 省
      city: null, // 城市
      region: null, // 区域
      detailAddress: null, // 详细地址
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let formData = {
      "orderNo": app.globalData.workOrder.orderNo,
      "sn": app.globalData.workOrder.orderStates[app.globalData.workOrder.orderStates.length - 1].sn,
      "orderType": app.globalData.workOrder.orderStates[app.globalData.workOrder.orderStates.length - 1].orderType
    };

    this.setData({
      uploadUrl: URL_Service + URL_UploadFile,
      order: app.globalData.workOrder,
      formData: formData,
      expressNum: app.globalData.workOrder.orderNo
    })
    
    this.getDefaultOrderTaker()
  },

  /**
   * 输入航班号/车次号
   * @param {*} e 
   */
  inputTransportNum: function(e) {
    this.data.transportNum = e.detail.value;
  },

  /**
   * 航班号/车次号输入 丢失焦点
   * @param {*} e 
   */
  inputTransportNumLoseFost: function(e) {
    this.setData({
      transportNum: e.detail.value.toUpperCase()
    })
    if (this.data.order.transport.transportType == 3 || this.data.order.transport.transportType == 4) {
      this.getDefaultOrderTaker();
    }
  },

  /**
   * 输入起始机场三字码
   * @param {*} e 
   */
  inputStartCityCode: function(e) {
    this.data.startCityCode = e.detail.value;
  },

  /**
   * 输入目的机场三字码
   * @param {*} e 
   */
  inputEndCityCode: function(e) {
    this.data.endCityCode = e.detail.value;
  },

  /**
   * 选择出发日期
   * @param {*} e 
   */
  changeDepartureDate: function(e) {
    this.setData({
      departureDate: e.detail.value
    })
  },

  /**
   * 输入快递单号
   * @param {*} e 
   */
  inputExpressNum: function(e) {
    this.data.expressNum = e.detail.value;
  },

  /**
   * 输入提货联系人名称
   * @param {*} e 
   */
  inputOrderTakerContact: function(e) {
    this.data.orderTaker.contact = e.detail.value;
  },

  /**
   * 输入提货联系电话
   * @param {*} e 
   */
  inputOrderTakerPhone: function(e) {
    this.data.orderTaker.phone = e.detail.value;
  },

  /**
   * 选择提货地址
   * @param {*} e 
   */
  selectedOrderTakerAddress: function(e) {
    wx.navigateTo({
      url: pagePath.Path_Map + "?city=" + this.data.order.transport.endCity + "&orderindex=0&type=ordertaker",
    })
  },

  /**
   * 入港操作
   */
  tapOutport: function(){
    if (!this.data.outportLoading) {
      this.buttonLoading(true);
      let that = this;
      this.requestUnpayPremiumCount(this.data.order.orderNo, function(count) {
        if (count > 0) { // 有未支付补价单
          wx.showModal({
            title: '还有未支付补价单',
            content: '完成补价后再执行该操作',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          })
        } else { // 无未支付补价单
          that.requestAddPostTransportInfo(function(){
            if (that.checkOrderTakerComplete()) { // 提货信息补充完全
              that.requestAddOrderTaker(function(){
                that.requestOutPort(function(){
                  that.buttonLoading(false);
                });
              })
            } else { // 提货信息未补充完全
              that.buttonLoading(false);
              wx.showModal({
                title: '提货信息未完成',
                content: "是否补全提货信息?不补全将不会提交当前提货信息",
                cancelText:'补全信息',
                confirmText: '直接出港',
                success(res) {
                  if (res.confirm) {
                    that.buttonLoading(true);
                    that.requestOutPort(function(){
                      that.buttonLoading(false);
                    });
                  }
                }
              })
            }
          });
        }
      })
    }
  },

  /**
   * 上传完成
   * @param {*} e 
   */
  uploadComplete: function(res) {
    util.printLog("uploadComplete", res);
    this.resetImagePathList(res.detail.uploadReturnDataList);
  },

  /**
   * 删除图片
   * @param {*} e 
   */
  deleteImage: function(res) {
    this.resetImagePathList(res.detail.imagePathList);
  },

  /**
   * 按钮是否loading
   * @param {boolean} loading 
   */
  buttonLoading: function(loading) {
    this.setData({
      outportLoading: loading
    })
  },

  /**
   * 重置图片列表
   * @param {*} imageList 
   */
  resetImagePathList: function(imageList){
    this.setData({
      imagePathList: imageList
    })
    // this.setData({
    //   outportDisable: imageList==null||imageList.length <= 0
    // })
  },

  /**
   * 获取上传的文件地址列表
   */
  getInportFileList: function() {
    let fileList = [];
    this.data.imagePathList.forEach(fileItem => {
      if (typeof fileItem == "object") {
        fileList.push(fileItem.viewAddress);
      } else if (typeof fileItem == 'string') {
        fileList.push(fileItem);
      }
    });
    return fileList;
  },

  /**
   * 获取默认提货配置
   */
  getDefaultOrderTaker: function() {
    let that = this;
    let orderNo = this.data.order.orderNo;
    let transportNum = util.checkEmpty(this.data.transportNum)?null:this.data.transportNum;
    this.requestDefaultOrderTaker(orderNo, transportNum, function(data) {
      if (data != null) {
        that.setData({
          orderTaker: data
        })
      }
    })
  },

  /**
   * 检查提货信息输入情况
   */
  checkOrderTakerComplete: function() {
    let complete = true;
    let that = this;
    Object.keys(that.data.orderTaker).forEach(keyItem => {
      if (that.checkOrderTakerProp(keyItem) && util.checkEmpty(that.data.orderTaker[keyItem])) {
        complete = false;
      }
    });
    return complete;
  },
  /**
   * 是否是要检查的提货信息属性名
   * @param {string} key 属性名
   */
  checkOrderTakerProp: function(key){
    switch (key) {
      case "contact":
      case "phone":
      case "province":
      case "city":
      case "region":
      case "detailAddress":
        return true;
      default:
        return false;
    }
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
    if (app.globalData.orderTakerLocation!=null) {
      let location = app.globalData.orderTakerLocation;
      this.data.orderTaker.province = location.province;
      this.data.orderTaker.city = location.city;
      this.data.orderTaker.region = location.district;
      this.data.orderTaker.detailAddress = location.detailAddress;
      this.setData({
        orderTaker: this.data.orderTaker
      })
      app.globalData.orderTakerLocation = null;
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
    return shareUtils.getOnShareAppMessageForShareOpenId();
  },

  /**
   * 获取默认提货配置
   * @param {string} orderNo 订单号
   * @param {string} code 航班/车次号
   * @param {function(boolean, object)} callback 回调
   */
  requestDefaultOrderTaker: function (orderNo, code, callback) {
    wx.showLoading({
      title: '请稍等...',
    })
    workOrderManager.getDefaultOrderTakerInfo(orderNo, code, function(success, data) {
      wx.hideLoading();
      if (success) {
        if (util.checkIsFunction(callback)) {
          if(!util.checkEmpty(data)) {
            callback(data[0]);
          } else {
            callback(null);
          }
        }
      } else {
        wx.showToast({
          title: '获取提货信息失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 获取未支付的补价单数量
   * @param {string} orderNo 订单编号
   * @param {function(object)} callback 回调
   */
  requestUnpayPremiumCount: function(orderNo, callback){
    let that = this;
    commonOrderManager.checkUnpayPremiumCount(orderNo, function(success, data){
      if (success) { 
        if (util.checkIsFunction(callback)) {
          callback(data);
        }
      } else {
        that.buttonLoading(false);
        wx.showToast({
          title: '查询未完成补价单失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 添加运输信息
   * @param {function} callback 回调
   */
  requestAddPostTransportInfo: function (callback) {
    let tempData = new PostTransportInfo(this.data.order.orderNo, this.data.order.transport.transportType);
    if (util.checkEmpty(this.data.expressNum)) {
      wx.showToast({
        title: '快递单号不能为空！',
        icon: 'none'
      })
      this.buttonLoading(false);
      return;
    } else {
      tempData.expressNum = this.data.expressNum;
    }
    if (util.checkEmpty(this.data.transportNum)) {
      wx.showToast({
        title: '航班/车次不能为空',
        icon: 'none'
      })
      this.buttonLoading(false);
      return;
    } else {
      tempData.transportNum = this.data.transportNum;
    }
    if (this.data.order.transport.transportType == 3 || this.data.order.transport.transportType == 4) {
      if (util.checkEmpty(this.data.startCityCode)) {
        wx.showToast({
          title: '始发三字码不能为空',
          icon:'none'
        })
        this.buttonLoading(false);
        return;
      } else {
        tempData.startCity = this.data.startCityCode;
      }
      if (util.checkEmpty(this.data.endCityCode)) {
        wx.showToast({
          title: '目的三字码不能为空',
          icon: 'none'
        })
        this.buttonLoading(false);
        return;
      } else {
        tempData.endCity = this.data.endCityCode;
      }
    } else {
      if (!util.checkEmpty(this.data.order.transport.startCity)) {
        tempData.startCity = this.data.order.transport.startCity;
      }
      if (!util.checkEmpty(this.data.order.transport.endCity)) {
        tempData.endCity = this.data.order.transport.endCity;
      }
    }
    if (util.checkEmpty(this.data.departureDate)) {
      wx.showToast({
        title: '出发时间不能为空',
        icon: 'none'
      })
      this.buttonLoading(false);
      return;
    } else {
      tempData.dateTime = this.data.departureDate;
    }
    let that = this;
    workOrderManager.addPostTransportInfo(tempData, function(success, data) {
      if (success) {
        if (util.checkIsFunction(callback)) {
          callback();
        }
      } else {
        that.buttonLoading(false);
        wx.showToast({
          title: '添加运输信息失败！',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 请求出港
   * @param {function} callback
   */
  requestOutPort: function(callback) {
    let that = this;
    workOrderManager.inOrOutHarbour(this.getInportFileList(), this.data.formData.sn, this.data.formData.orderNo, this.data.formData.orderType, function(success, data) {
      if (success) {
        notificationCenter.postNotification(WORKORDER_OUTPORT);
        wx.navigateBack();
      } else {
        that.buttonLoading(false);
        let tempMsg = '出港失败';
        wx.showToast({
          title: tempMsg,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 提交提货信息
   * @param {function} callback
   */
  requestAddOrderTaker: function(callback) {
    let tempData = this.data.orderTaker;
    tempData.order = {
      orderNo: this.data.order.orderNo
    };
    tempData.station = {
      stationNo: loginUtils.getStationNo()
    }
    if (this.data.order.transport.transportType == 3 || this.data.order.transport.transportType == 4) {
      tempData.code = this.data.transportNum;
    }
    let that = this;
    workOrderManager.addOrderTakerInfo(tempData, function(success, data) {
      if (success) {
        if (util.checkIsFunction(callback)) {
          callback();
        }
      } else {
        that.buttonLoading(false);
        wx.showToast({
          title: '添加提货信息失败！',
          icon: 'none'
        })
      }
    })
  },
})