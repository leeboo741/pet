// pages/staffManager/staffManager.js

const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffList: [],
  },

  /**
   * 调整职位
   * @param {*} e 
   */
  tapChangeRole: function(e) {
    let index = e.currentTarget.dataset.index;
    let staff = this.data.staffList[index];
    wx.showActionSheet({
      itemList: ['客服','司机'],
      success(res) {
        if (res.tapIndex == 0) {
          // 客服 2
          console.log(staff.staffName, '调职成客服', config.Role_Staff_Service)
        } else if (res.tapIndex == 1) {
          // 司机 3
          console.log(staff.staffName, '调职成司机', config.Role_Staff_Diver)
        }
      }
    })
  },

  /**
   * 移除员工
   * @param {*} e 
   */
  tapRemove: function(e) {
    let index = e.currentTarget.dataset.index;
    let staff = this.data.staffList[index];
    console.log(staff.staffName, "移除");
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
      url: config.URL_Service + config.URL_GetSubStaff + loginUtil.getCustomerNo(),
      success(res) {
        wx.hideLoading();
        console.log("请求下属员工 success: \n" + JSON.stringify(res));
        that.setData({
          staffList: res.data.data
        })
      },
      fail(res) {
        wx.hideLoading();
        console.log("请求下属员工 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: "none"
        })
      },
      complete(res){
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  }
})