// pages/editOrder/editOrder.js

const app = getApp();
const Config = require("../../utils/config.js");
const LoginUtil = require("../../utils/loginUtils.js");
const ShareUtil = require("../../utils/shareUtils.js");
const Util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: null,
    editSenderName: null,
    editSenderPhone: null,
    editReceiverName: null,
    editReceiverPhone: null,
    timeOutID: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestOrderDetail(options.orderno)
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
    clearTimeout(this.data.timeOutID);
    this.data.timeOutID = null;
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
   * 请求订单详情
   */
  requestOrderDetail: function (orderNo) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: Config.URL_Service + Config.URL_OrderDetail,
      data: {
        "orderNo": orderNo,
        "openId": LoginUtil.getOpenId()
      },
      success(res) {
        console.log("获取订单详情 success：\n" + JSON.stringify(res));
        if (res.data.root != null && res.data.prompt == "Success") {
          that.setData({
            orderData: res.data.root
          })
        } else {

        }
      },
      fail(res) {
        console.log("获取订单详情 fail：\n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("获取订单详情 complete：\n" + JSON.stringify(res));
        wx.hideLoading();
      },

    })
  },

  /**
   * 请求编辑订单联系人
   */
  requestEditContact: function () {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    let tempData = {
      "orderNo": this.data.orderData.orderNo,
      "receiverName": this.data.orderData.receiverName,
      "receiverPhone": this.data.orderData.receiverPhone,
      "senderName": this.data.orderData.senderName,
      "senderPhone": this.data.orderData.senderPhone
    }

    if (!Util.checkEmpty(this.data.editSenderName)) {
      tempData.senderName = this.data.editSenderName;
    }

    if (!Util.checkEmpty(this.data.editSenderPhone)) {
      tempData.senderPhone = this.data.editSenderPhone;
    }

    if (!Util.checkEmpty(this.data.editReceiverName)) {
      tempData.receiverName = this.data.editReceiverName;
    }

    if (!Util.checkEmpty(this.data.editReceiverPhone)) {
      tempData.receiverPhone = this.data.editReceiverPhone;
    }
    
    wx.request({
      url: Config.URL_Service + Config.URL_EditOrderContacts,
      data: tempData,
      method: "PUT",
      success(res) {
        console.log("修改订单联系人 success: \n" + JSON.stringify(res));
        if (res.data.prompt == Config.Prompt_Success && res.data.root > 0) {
          wx.showToast({
            title: '更新成功',
            duration: 1000,
          })
          that.data.timeOutID = setTimeout(function () {
            wx.navigateBack({

            })
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("修改订单联系人 fail: \n" + JSON.stringify(res)); 
        wx.showToast({
          title: '更新失败！',
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },

  /**
   * 输入寄件人名称
   */
  inputSenderName: function(e) {
    this.data.editSenderName = e.detail.value;
  },

  /**
   * 输入寄件人电话
   */
  inputSenderPhone: function(e) {
    this.data.editSenderPhone = e.detail.value;
  },

  /**
   * 输入收件人名称
   */
  inputReceiverName: function (e) {
    this.data.editReceiverName = e.detail.value;
  },

  /**
   * 输入收件人电话
   */
  inputReceiverPhone: function (e) {
    this.data.editReceiverPhone = e.detail.value;
  },

  /**
   * 点击修改
   */
  tapEdit: function () {
    let isEdit = false;
    if (!Util.checkEmpty(this.data.editSenderName)) {
      isEdit = true;
    }
    if (!Util.checkEmpty(this.data.editSenderPhone)) {
      isEdit = true;
    }
    if (!Util.checkEmpty(this.data.editReceiverName)) {
      isEdit = true;
    }
    if (!Util.checkEmpty(this.data.editReceiverPhone)) {
      isEdit = true;
    }

    if (isEdit) {
      this.requestEditContact();
    }
  }
})