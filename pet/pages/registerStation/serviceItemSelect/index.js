// pages/registerStation/serviceItemSelect/index.js
const app = getApp();
const Util = require("../../../utils/util.js");
const ShareUtil = require("../../../utils/shareUtils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceItemList: [
      {
        name: "洗澡美容",
      },
      {
        name: "寄养",
      },
      {
        name: "宠物用品",
      },
      {
        name: "医疗保健",
      },
      {
        name: "猫咖狗咖",
      },
      {
        name: "异宠小宠",
      },
      {
        name: "宠物摄影",
      },
      {
        name: "宠物游泳",
      },
      {
        name: "宠物公园",
      },
    ],
    current: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!Util.checkEmpty(app.globalData.selectServiceItem)) {
      for (let i = 0; i < this.data.serviceItemList.length; i++) {
        let tempService = this.data.serviceItemList[i];
        for (let j = 0; j < app.globalData.selectServiceItem.length; j++) {
          let tempSelectService = app.globalData.selectServiceItem[j];
          if (tempService.name == tempSelectService) {
            tempService.selected = true;
          }
        }
      }
      this.setData({
        serviceItemList: this.data.serviceItemList
      })
      app.globalData.selectServiceItem = null;
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

    return ShareUtil.getOnShareAppMessageForShareOpenId();
  },

  /**
   * 选中
   */
  tapService: function(e) {
    let tempService = this.data.serviceItemList[e.currentTarget.dataset.index];
    if (tempService.selected) {
      tempService.selected = false;
    } else {
      tempService.selected = true;
    }
    this.setData({
      serviceItemList: this.data.serviceItemList
    })
  },

  /**
   * 确定
   */
  confirm: function(e) {
    let tempServiceList = [];
    for (let i = 0; i < this.data.serviceItemList.length; i++) {
      let tempService = this.data.serviceItemList[i];
      if (tempService.selected) {
        tempServiceList.push(tempService.name);
      }
    }
    app.globalData.selectServiceItem = tempServiceList;
    wx.navigateBack({
      
    })
  }
})