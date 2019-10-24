// pages/selectorStaff/selectorStaff.js

const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const app = getApp();
const util = require("../../utils/util.js");
const ShareUtil = require("../../utils/shareUtils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffList: [],
    allocationStaffList: null, // 已分配 员工
    orderNo: null,
    selected: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tempAllocationStaffList = options.stafflist;
    if (util.checkEmpty(tempAllocationStaffList)) {
      tempAllocationStaffList = null;
    } else {
      tempAllocationStaffList = JSON.parse(tempAllocationStaffList);
    }
    this.setData({
      orderNo: options.orderno,
      allocationStaffList: tempAllocationStaffList,
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
    return ShareUtil.getOnShareAppMessageForShareOpenId();
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
      url: config.URL_Service + config.URL_GetSubStaff + loginUtil.getOpenId(),
      success(res){
        console.log("请求下属员工 success: \n" + JSON.stringify(res));
        that.setData({
          staffList: res.data.data
        })
        that.initStaffSelected();
      },
      fail(res) {
        console.log("请求下属员工 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: "none"
        })
      },
      complete(res){
        wx.hideLoading();
      }
    })
  },

  /**
   * 初始化员工选中信息
   */
  initStaffSelected: function () {
    if (util.checkEmpty(this.data.allocationStaffList) || util.checkEmpty(this.data.staffList)) {
      return;
    }
    for (let i = 0; i < this.data.staffList.length ; i++) {
      let tempStaff = this.data.staffList[i];
      for (let j = 0; j < this.data.allocationStaffList.length; j++) {
        let tempAllocationStaff = this.data.allocationStaffList[j].staff;
        if (tempStaff.staffNo == tempAllocationStaff.staffNo) {
          tempStaff.selected = true;
        }
      }
    }
    this.setData({
      staffList: this.data.staffList
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
        openId: loginUtil.getOpenId(),
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
                var pages = getCurrentPages();
                if (pages.length > 1) { //说明有上一页存在
                  //上一个页面实例对象
                  var prePage = pages[pages.length - 2];
                  //关键在这里，调用上一页的函数
                  prePage.startRefresh()
                }
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