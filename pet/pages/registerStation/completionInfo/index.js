const { URL_Service, URL_Upload } = require("../../../utils/config")
const userManager = require("../../../manager/userManager/userManager")
const util = require("../../../utils/util")
const loginUtils = require("../../../utils/loginUtils")
const pagePath = require("../../../utils/pagePath");
const shareUtils = require("../../../utils/shareUtils");

// pages/registerStation/completionInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    businessName: "", //商家姓名
    startTime: '', //开始营业时间
    endTime: "", //结束时间
    region: "", //地区
    detailAddress: '', //详细地址

    uploadUrl: URL_Service + URL_Upload,
    headImagePath: null, // 头像地址
  },

  /**
   * 商家姓名
   */
  inputName: function(e) {
    this.setData({
      businessName: e.detail.value
    })
  },

  /**
   * 开始营业时间
   */
  selectStartTime: function(e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  /**
   * 结束营业时间
   */
  selectEndTime: function(e) {
    this.setData({
      endTime: e.detail.value
    })
  },


  /**
   * 所在地区
   */
  selectRegion: function(e) {
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 详细地址
   */
  inputDetailAddress: function(e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },

  /**
   * 上传完成
   * @param {*} e 
   */
  uploadComplete: function(e) {
    this.setData({
      headImagePath: e.detail.uploadReturnDataList[0].fileAddress
    })
  },

  /**
   * 删除图片
   * @param {*} e 
   */
  deleteImage: function(e) {
    this.setData({
      headImagePath: e.detail.uploadReturnDataList[0].fileAddress
    })
  },

  /**
   * 点击提交商家信息
   * @param {*} e 
   */
  tapSubmit: function(e) {
    let param = this.getSubmitData();
    if (param == null) return;
    wx.showLoading({
      title: '请稍等...',
    })
    userManager.completionInfo(param, function(success, data) {
      if (success) {
        loginUtils.updateCustomer(function(isSuccess){
          wx.hideLoading({
            success: (res) => {},
          })
          if (isSuccess && loginUtils.getBusinessAuthType() < 3) {
            wx.navigateTo({
              url: pagePath.Path_Apply_Register_Station,
            })
          } else {
            wx.switchTab({
              url: pagePath.Path_Me_Index,
            })
          }
        })
      } else {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: data,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 组装提交信息
   */
  getSubmitData: function(){
    if (util.checkEmpty(this.data.businessName)) {
      wx.showToast({
        title: '请输入商家名称',
        icon: 'none'
      })
      return null;
    }
    if (util.checkEmpty(this.data.startTime)) {
      wx.showToast({
        title: '请选择开始营业时间',
        icon: 'none'
      })
      return null;
    }
    if (util.checkEmpty(this.data.endTime)) {
      wx.showToast({
        title: '请选择结束营业时间',
        icon: 'none'
      })
      return null;
    }
    if (util.checkEmpty(this.data.region)) {
      wx.showToast({
        title: '请选择所在区域',
        icon: 'none'
      })
      return null;
    }
    if (util.checkEmpty(this.data.detailAddress)) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return null;
    }
    if (util.checkEmpty(this.data.headImagePath)) {
      wx.showToast({
        title: '请上传头像',
        icon: 'none'
      })
      return null;
    }
    return {
      businessNo: loginUtils.getBusinessNo(),
      businessName: this.data.businessName,
      startHours: this.data.startTime,
      endHours: this.data.endTime,
      province: this.data.region[0],
      city: this.data.region[1],
      area: this.data.region[2],
      detailAddress: this.data.detailAddress,
      headImg: this.data.headImagePath
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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