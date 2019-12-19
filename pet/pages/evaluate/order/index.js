// pages/evaluate/order/index.js

const Config = require("../../../utils/config.js");
const LoginUtil = require("../../../utils/loginUtils.js");
const Util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: null,
    starLevel: 5,
    content: null,
    imagePathList: null,
    backtimeout: null,

    uploadUrl: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNo: options.orderno,
      // uploadUrl: "http://192.168.3.111:6060/api/test/upload"
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
    if (Util.checkEmpty(this.data.backtimeout)) {
      clearTimeout(this.data.backtimeout);
      this.data.backtimeout = null;
    }
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
   * 点击星星
   */
  tapStar: function(e) {
    this.setData({
      starLevel: e.currentTarget.dataset.level
    })
  },

  /**
   * 输入评价内容
   */
  inputContent: function(e) {
    this.setData({
      content: e.detail.value
    })
  },

  /**
   * 点击提交
   */
  tapSubmit: function() {
    wx.showLoading({
      title: '提交中...',
    })
    let submitData = {
      star: this.data.starLevel,
      content: this.data.content,
      order: {
        orderNo: this.data.orderNo
      },
      evaluator: LoginUtil.getCustomerNo()
    }
    let that = this;
    console.log("提交评价：\n" + JSON.stringify(submitData));
    wx.request({
      url: Config.URL_Service + Config.URL_Order_Evalueate,
      data: submitData,
      method: "POST",
      success(res) {
        console.log("提交评价 success: \n" + JSON.stringify(res));
        wx.hideLoading();
        if (res.data.code == Config.RES_CODE_SUCCESS && res.data.data > 0) {
          wx.showToast({
            title: '提交成功',
            duration: 1500
          })
          that.data.backtimeout = setTimeout(
            function () {
              wx.navigateBack({
                
              })
            },
            1550
          )
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("提交评价 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: 'none'
        })
      },
    })
  },
})