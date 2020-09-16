// pages/stationSetting/index.js
// 
const loginUtils = require("../../utils/loginUtils");
const Config = require("../../utils/config");
const { RES_CODE_SUCCESS } = require("../../utils/config");
const util = require("../../utils/util");
const shareUtils = require("../../utils/shareUtils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodePath: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      qrcodePath: loginUtils.getStationInfo().collectionQRCode
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
  },

  tapSelectNewQRCode: function() {
    let that = this;
    wx.chooseImage({
      count: 1,
      success(res) {
        that.setData({
          qrcodePath: res.tempFilePaths[0]
        })
        that.uploadImageFile();
      },
    })
  },

  uploadImageFile: function() {
    console.log('上传图片');
    wx.showLoading({
      title: '上传中...',
    })
    wx.uploadFile({
      filePath: this.data.qrcodePath,
      name: 'multipartFiles',
      url: Config.URL_Service + Config.URL_UploadStationQRCode,
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        "stationNo": loginUtils.getStationNo(),
      },
      success(res) {
        console.log(res);
        if (typeof res.data == 'string') {
          res.data = JSON.parse(res.data);
        }
        if (res.data.code == RES_CODE_SUCCESS && !util.checkEmpty(res.data.data)) {
          loginUtils.updateCustomer(function callback(isSuccess) {
            wx.hideLoading();
            wx.showToast({
              title: '上传成功',
            })
          });
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '插入失败',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      },
      complete(res) {
      }
    })
  }
})