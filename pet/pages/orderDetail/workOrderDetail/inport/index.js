const config = require("../../../../utils/config");
const { Order_State_ToPack, Order_State_ToInPort, Order_State_ToArrived } = require("../../../../utils/config");
const util = require("../../../../utils/util");
const workOrderManager = require("../../../../manager/orderManager/workOrderManager");
const notificationCenter = require("../../../../manager/notificationCenter");
const { WORKORDER_PACKING, WORKORDER_INPORT } = require("../../../../static/notificationName");
const shareUtils = require("../../../../utils/shareUtils");

// pages/orderDetail/workOrderDetail/inport/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null,

    // 上传
    uploadUrl: null,
    formData: null,

    imagePathList: [], // 图片

    inportDisable: false,
    inportLoading: false,
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
    wx.setNavigationBarTitle({
      title: this.getTitle(app.globalData.workOrder),
    })
    this.setData({
      uploadUrl: config.URL_Service + config.URL_UploadFile,
      order: app.globalData.workOrder,
      formData: formData,
      title: this.getTitle(app.globalData.workOrder)
    })  
  },

  /**
   * 获取标题
   * @param {object} order 订单
   */
  getTitle: function(order) {
    switch(order.orderStates[order.orderStates.length - 1].orderType) {
      case Order_State_ToPack :{
        return "揽件";
      }
      case Order_State_ToInPort :{
        return "入港";
      }
      case Order_State_ToArrived :{
        return "到达";
      }
      default:
        return "未知";
    }
  },

  /**
   * 入港操作
   */
  tapInport: function(){
    if (!this.data.inportLoading) {
      this.buttonLoading(true);
      let that = this;
      workOrderManager.inOrOutHarbour(this.getInportFileList(), this.data.formData.sn, this.data.formData.orderNo, this.data.formData.orderType, function(success, data) {
        that.buttonLoading(false);
        if (success) {
          if (that.data.formData.orderType == Order_State_ToPack) {
            notificationCenter.postNotification(WORKORDER_PACKING);
          } else {
            notificationCenter.postNotification(WORKORDER_INPORT);
          }
          wx.navigateBack();
        } else {
          let tempMsg = '';
          if (that.data.formData.orderType == Order_State_ToPack) {
            tempMsg = '揽件失败';
          } else {
            tempMsg = '入港失败';
          }
          wx.showToast({
            title: tempMsg,
            icon: 'none'
          })
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
      inportLoading: loading
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
    //   inportDisable: imageList==null||imageList.length <= 0
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  }
})