// pages/orderDetail/workOrderDetail/uploadFile/index.js

const util = require("../../../../utils/util");
const { URL_Service, URL_UploadFile } = require("../../../../utils/config");
const app = getApp();
const notificationCenter = require("../../../../manager/notificationCenter");
const { WORKORDER_UPLOADFILE } = require("../../../../static/notificationName");
const shareUtils = require("../../../../utils/shareUtils");

const Node_Before_Out = "出港前";
const Node_After_Out = "出港后";
const Node_Arrived_Next = "到达下个站点";

/**
 * 获取 秒数 毫秒数
 * @param {number} count 秒数
 */
function getSec(count){
  if (!util.checkIsNumber(count)) {
    count = 1;
  }
  return count * 1000;
}
/**
 * 获取 分钟 毫秒数
 * @param {number} count 分钟数
 */
function getMinute(count) {
  if (!util.checkIsNumber(count)) {
    count = 1;
  }
  return count * 60 * getSec();
}
/**
 * 获取 小时 毫秒数
 * @param {number} count 小时数
 */
function getHour(count) {
  if (!util.checkIsNumber(count)) {
    count = 1;
  }
  return count * 60 * getMinute();
}

const maxHourCount = 24; // 最大小时数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null, // 订单
    dataSource: [], // 上传文件列表
    nodeList:[
      {
        index: 0,
        name: Node_Before_Out
      },
      {
        index: 1,
        name: Node_After_Out
      },
      {
        index: 2,
        name: Node_Arrived_Next
      },
    ], // 节点列表
    timeList:[], // 时间列表

    startUpload: false, // 是否开始上传

    uploadUrl: null, // 上传地址
  },

  /**
   * 初始化时间选择列表
   */
  initTimeList: function() {
    let timeList = [];
    for (let i = 0; i < maxHourCount; i ++) {
      let name = null;
      if (i == 0) {
        name = "立即显示";
      } else if (i >= 24) {
        let dayCount = parseInt(i / 24);
        let hourCount = i % 24;
        name = dayCount + " 天";
        if (hourCount == 0) {
          name = name + "后";
        } else {
          name = name + " " + j + " 小时后"; 
        }
      } else {
        name = i + " 小时后";
      }
      timeList.push({
        index: i,
        name: name,
        value: getHour(i)
      })
    }
    this.setData({
      timeList: timeList
    })
  },

  /**
   * 初始化节点
   */
  initItem: function(){
    let item = {
      node: this.data.nodeList[0],
      time: this.data.timeList[0],
      imagePathList: [],
      formData: {
        orderNo: this.data.order.orderNo,
        node: this.data.nodeList[0].name,
        delayTime: this.data.timeList[0].value,
        remarks: null,
      },
    }
    return item;
  },

  /**
   * 新增节点
   */
  tapAddItem: function(){
    let lastItem = null;
    if (!util.checkEmpty(this.data.dataSource)) {
      lastItem = this.data.dataSource[this.data.dataSource.length - 1];
    }
    if (lastItem != null && util.checkEmpty(lastItem.imagePathList)) {
      wx.showToast({
        title: '请先完成上一节点',
        icon: 'none'
      })
      return;
    }
    this.data.dataSource.push(this.initItem());
    this.setData({
      dataSource: this.data.dataSource
    })
  },

  /**
   * 是否上传完成
   */
  isUploadComplete: function() {
    let complete = true;
    this.data.dataSource.forEach(item => {
      if (item.complete == false) {
        complete = false
      }
    });
    return complete;
  },

  /**
   * 重置数据上传状态
   */
  resetUploadCompleteState: function() {
    this.data.dataSource.forEach(item => {
      item.complete = false;
    });
  },

  /**
   * 修改节点
   * @param {*} e 
   */
  changeNode: function(e) {
    let item = this.data.dataSource[e.currentTarget.dataset.index];
    item.node = this.data.nodeList[e.detail.value];
    item.formData.node = item.node.name;
    this.setData({
      dataSource: this.data.dataSource
    })
  },

  /**
   * 修改时间
   * @param {*} e 
   */
  changeTime: function(e) {
    let item = this.data.dataSource[e.currentTarget.dataset.index];
    item.time = this.data.timeList[e.detail.value];
    item.formData.delayTime = item.time.value;
    this.setData({
      dataSource: this.data.dataSource
    })
  },

  /**
   * 删除节点
   * @param {*} e 
   */
  tapDelete: function(e) {
    this.data.dataSource.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      dataSource: this.data.dataSource
    })
  },

  /**
   * 输入备注
   * @param {*} e 
   */
  inputRemarks: function(e) {
    let item = this.data.dataSource[e.currentTarget.dataset.index];
    item.formData.remarks = e.detail.value;
    this.setData({
      dataSource: this.data.dataSource
    })
  },

  /**
   * 图片上传结束
   * @param {*} e 
   */
  uploadComplete: function(e) {
    util.printLog("uploadComplete",e);
    let item = this.data.dataSource[e.currentTarget.dataset.index];
    item.imagePathList = e.detail.uploadReturnDataList;
    item.complete = true;
    if (this.isUploadComplete()) {
      this.setData({
        startUpload: false
      })
      notificationCenter.postNotification(WORKORDER_UPLOADFILE);
      wx.navigateBack();
    }
  },

  /**
   * 图片删除
   */
  deleteImage: function(e) {
    util.printLog("deleteImage",e);
    let item = this.data.dataSource[e.currentTarget.dataset.index];
    item.imagePathList = e.detail.imagePathList;
  },

  /**
   * 添加新图
   * @param {*} e 
   */
  addNewImage: function(e) {
    util.printLog("addNewImage",e);
    let item = this.data.dataSource[e.currentTarget.dataset.index];
    item.imagePathList = e.detail.imagePathList;
  },

  /**
   * 开始上传
   */
  tapStartUpload: function(){
    if (this.data.startUpload) {
      return;
    }
    let lastItem = null;
    if (!util.checkEmpty(this.data.dataSource)) {
      lastItem = this.data.dataSource[this.data.dataSource.length - 1];
    }
    if (lastItem != null && util.checkEmpty(lastItem.imagePathList)) {
      wx.showToast({
        title: '请完成节点信息',
        icon: 'none'
      })
      return;
    }
    this.setData({
      startUpload: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initTimeList();
    this.setData({
      uploadUrl: URL_Service + URL_UploadFile,
      order: app.globalData.workOrder
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