// pages/approval/approval.js
const app = getApp();
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const util = require("../../utils/util.js");
const ShareUtil = require("../../utils/shareUtils.js");
const approvalManager = require("../../manager/approvalManager/approvalManager.js");

const Limit = 30;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList:[
      "商家审批",
      "员工审批",
      "提现审批"
    ],
    stationApplyList:[],
    staffApplyList:[],
    withdrawalApplyList:[],
    currentTabIndex: 0,
    naviHeight: 0,

    offset: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      naviHeight: app.globalData.naviHeight
    })
    this.setCurrentTabIndex(0);
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
    let that = this;
    switch(this.data.currentTabIndex) {
      case 0: {
        loginUtil.checkLogin(function alreadyLoginCallback(state) {
          if (state) {
            that.requestUnAuditedStationList();
          } else {
            wx.stopPullDownRefresh({
              success: (res) => {},
            })
          }
        })
      }
        break;
      case 1: {
        loginUtil.checkLogin(function alreadyLoginCallback(state) {
          if (state) {
            that.requestUnauditedStaffList();
          } else {
            wx.stopPullDownRefresh({
              success: (res) => {},
            })
          }
        })
      }
        break;
      case 2: {
        that.data.offset = 0;
        loginUtil.checkLogin(function alreadyLoginCallback(state) {
          if (state) {
            that.requestWithdrawalApplyList();
          } else {
            wx.stopPullDownRefresh({
              success: (res) => {},
            })
          }
        })
      }
        break;
    }
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
   * 设置当前类型
   */
  setCurrentTabIndex: function (currentIndex) {
    this.setData({
      currentTabIndex: currentIndex
    })
    let that = this;
    if (this.data.currentTabIndex == 0) {
      if (util.checkEmpty(this.data.stationApplyList)) {
        wx.startPullDownRefresh({
          success: (res) => {},
        })
      }
    } else if (this.data.currentTarget == 1){
      if (util.checkEmpty(this.data.staffApplyList)) {
        wx.startPullDownRefresh({
          success: (res) => {},
        })
      }
    } else {
      if (util.checkEmpty(this.data.withdrawalApplyList)) {
        wx.startPullDownRefresh({
          success: (res) => {},
        })
      }
    }
  },

  /**
   * 点击tab
   */
  handleTabChange: function (e) {
    this.setCurrentTabIndex(parseInt(e.detail.key))
  },

  /**
   * 驳回商家申请
   */
  tapRejectStationApply: function (e) {
    this.requestRejectStationApply(e.currentTarget.dataset.index);
  },

  /**
   * 批准商家申请
   */
  tapApprovalStationApply: function (e) {
    this.requestApprovalStationApply(e.currentTarget.dataset.index);
  },

  /**
   * 驳回员工申请
   */
  tapRejectStaffApply: function (e) {
    this.requestRejectStaffApply(e.currentTarget.dataset.index);
  },

  /**
   * 批准员工申请
   */
  tapApprovalStaffApply: function (e) {
    this.requestApprovalStaffApply(e.currentTarget.dataset.index);
  },

  /**
   * 查询待审核商户列表
   */
  requestUnAuditedStationList: function () {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    approvalManager.getUnauditedBusinessList(function(success, data) {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
      if (success) {
        that.setData({
          stationApplyList: data
        })
      } else {
        wx.showToast({
          title: '获取待审商户失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 查询待审核员工列表
   */
  requestUnauditedStaffList: function () {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    approvalManager.getUnauditedStaffList(function(success, data) {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
      if (success) {
        that.setData({
          staffApplyList: data
        })
      } else {
        wx.showToast({
          title: '获取待审员工失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 查询提现审核列表
   */
  requestWithdrawalApplyList: function() {
    
  },

  /**
   * 请求驳回商家申请
   */
  requestRejectStationApply: function (index) {
    const tempIndex = index;
    let tempStationApply = this.data.stationApplyList[tempIndex];
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    approvalManager.rejectBusinessApply(tempStationApply, function(success, data) {
      wx.hideLoading({
        success: (res) => {},
      })
      if (success) {
        wx.showToast({
          title: '驳回成功',
        })
        that.data.stationApplyList.splice(tempIndex, 1);
        that.setData({
          stationApplyList: that.data.stationApplyList
        })
      } else {
        wx.showToast({
          title: '驳回失败',
          icon: "none"
        })
      }
    })
  },

  /**
   * 请求审核商家申请
   */
  requestApprovalStationApply: function (index) {
    const tempIndex = index;
    let tempStationApply = this.data.stationApplyList[tempIndex];
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    approvalManager.approvalBusinessApply(tempStationApply, function(success, data) {
      wx.hideLoading({
        success: (res) => {},
      })
      if (success) {
        wx.showToast({
          title: '审核成功',
        })
        that.data.stationApplyList.splice(tempIndex, 1);
        that.setData({
          stationApplyList: that.data.stationApplyList
        })
      } else {
        wx.showToast({
          title: '审核失败',
          icon: "none"
        })
      }
    })
  },

  /**
   * 请求驳回员工申请
   */
  requestRejectStaffApply: function (index) {
    const tempIndex = index;
    let tempStaffApply = this.data.staffApplyList[tempIndex];
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    approvalManager.rejectStaffApply(tempStaffApply, function(success, data) {
      wx.hideLoading({
        success: (res) => {},
      })
      if (success) {
        wx.showToast({
          title: '驳回成功',
        })
        that.data.staffApplyList.splice(tempIndex, 1);
        that.setData({
          staffApplyList: that.data.staffApplyList
        })
      } else {
        wx.showToast({
          title: '驳回失败',
          icon: "none"
        })
      }
    })
  },

  /**
   * 选择员工角色
   * @param {*} index 
   */
  chooseStaffRole: function(getRoleCallback) {
    let role = null;
    wx.showActionSheet({
      itemList: ["客服人员", "司机"],
      success(res) {
        if (res.tapIndex == 0) {
          role = config.Role_Staff_Service;
        } else if (res.tapIndex == 1) {
          role = config.Role_Staff_Diver;
        } 
        if (util.checkIsFunction(getRoleCallback)) {
          getRoleCallback(role)
        }
      }
    })
  },

  /**
   * 请求审核员工申请
   */
  requestApprovalStaffApply: function (index) {
    const tempIndex = index;
    let that = this;
    let tempStaffApply = this.data.staffApplyList[tempIndex];
    this.chooseStaffRole(function getRoleCallback(role) {
      if (role == null) {
        wx.showToast({
          title: '请分配员工角色',
          icon: 'none'
        })
        return;
      } else {
        tempStaffApply.role = role;
        wx.showLoading({
          title: '请稍等...',
        })
        approvalManager.approvalStaffApply(tempStaffApply, function(success, data) {
          wx.hideLoading({
            success: (res) => {},
          })
          if (success) {
            wx.showToast({
              title: '审核成功',
            })
            that.data.staffApplyList.splice(tempIndex,1);
            that.setData({
              staffApplyList: that.data.staffApplyList
            })
          } else {
            wx.showToast({
              title: '审核失败',
              icon: "none"
            })
          }
        })
      }
    })
  },

})