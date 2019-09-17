// pages/selectorStaff/selectorStaff.js

const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffList: [],
    orderNo: null,
    selected: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNo: options.orderno
    })
    this.requestStaffList();
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

  },

  /**
   * 请求员工列表
   */
  requestStaffList: function () {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_GetSubStaff + loginUtil.getOpenID(),
      success(res){
        console.log("请求下属员工 success: \n" + JSON.stringify(res));
        that.setData({
          staffList: res.data.data
        })
      },
      fail(res) {
        console.log("请求下属员工 fail: \n" + JSON.stringify(res));
      },
      complete(res){
        wx.hideLoading();
      }
    })
  },

  /**
   * 点击员工
   */
  tapStaff: function(e) {
    let tempStaff = this.data.staffList[e.currentTarget.dataset.index];
    if (tempStaff.selected) {
      tempStaff.selected = false;
    } else {
      tempStaff.selected = true;
    }
    this.setData({
      staffList: this.data.staffList
    })
  },

  /**
   * 确认分配
   */
  confirmAlloction: function() {
    let tempStaffNoList = [];
    for(let i = 0 ; i < this.data.staffList.length; i++) {
      let tempStaff = this.data.staffList[i];
      if (tempStaff.selected) {
        tempStaffNoList.push(tempStaff.staffNo);
      }
    }
    if (tempStaffNoList.length <= 0) {
      wx.showToast({
        title: '未选中任何分配人员',
        icon: "none"
      })
      return;
    }
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_AlloctionOrder,
      data: {
        openId: loginUtil.getOpenID(),
        orderNo: this.data.orderNo,
        staffNo: tempStaffNoList
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST", // 请求方式
      success(res){
        console.log("分配订单 success:\n" + JSON.stringify(res));
        if(res.data.code == 200 && res.data.data > 0) {
          wx.showModal({
            title: '分配成功',
            content: '订单：'+ that.data.orderNo + '成功分配给'+ res.data.data + '人',
            showCancel: false,
            success(res){
              if(res.confirm) {
                wx.navigateBack({})
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("分配订单 fail:\n" + JSON.stringify(res));
        wx.showToast({
          title: '请求失败，请稍后再试',
          icon:'none'
        })
      },
      complete(res){
        wx.hideLoading();
      }
    })
  }

})