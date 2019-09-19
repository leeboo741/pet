// pages/approval/approval.js
const app = getApp();
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList:[
      "商家审批",
      "员工审批"
    ],
    stationApplyList:[],
    staffApplyList:[],
    currentTabIndex: 0,
    height: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height: app.globalData.pageHeight
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
   * 设置当前类型
   */
  setCurrentTabIndex: function (currentIndex) {
    this.setData({
      currentTabIndex: currentIndex
    })
    let that = this;
    if (this.data.currentTabIndex == 0) {
      if (util.checkEmpty(this.data.stationApplyList)) {
        loginUtil.checkLogin(function alreadyLoginCallback(state) {
          if (state) {
            that.requestUnAuditedStationList();
          }
        })
      }
    } else {
      if (util.checkEmpty(this.data.staffApplyList)) {
        loginUtil.checkLogin(function alreadyLoginCallback(state) {
          if (state) {
            that.requestUnauditedStaffList();
          }
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
   * 批准员工申请
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
    wx.request({
      url: config.URL_Service + config.URL_GetUnauditedStation,
      data: {
        phone: loginUtil.getPhone()
      },
      success(res) {
        console.log("获取待审核商户 success: \n" + JSON.stringify(res));
        if (res.data.code == 200) {
          that.setData({
            stationApplyList: res.data.data
          })
        } else {
          wx.showToast({
            title: '获取待审商户失败',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("获取待审核商户 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '获取待审商户失败',
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading();
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
    wx.request({
      url: config.URL_Service + config.URL_GetUnauditedStaff,
      data: {
        phone: loginUtil.getPhone()
      },
      success(res){
        console.log("获取待审核员工 success: \n" + JSON.stringify(res));
        if (res.data.code == 200) {
          that.setData({
            staffApplyList: res.data.data
          })
        } else {
          wx.showToast({
            title: '获取待审员工失败',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("获取待审核员工 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '获取待审员工失败',
          icon: 'none'
        })
      },
      complete(res){
        wx.hideLoading();
      }
    })
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
    wx.request({
      url: config.URL_Service + config.URL_RejectStationApply,
      data: tempStationApply,
      method: "PUT",
      success(res) {
        console.log("请求驳回商家 success: \n" + JSON.stringify(res));
        if (res.data.code == 200 && res.data.data > 0) {
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
      },
      fail(res) {
        console.log("请求驳回商家 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '网络波动，驳回失败',
          icon: "none"
        })
      },
      complete(res) {
        wx.hideLoading();
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
    wx.request({
      url: config.URL_Service + config.URL_ApprovalStationApply,
      data: tempStationApply,
      method: "PUT",
      success(res) {
        console.log("请求审核商家 success: \n" + JSON.stringify(res));
        if (res.data.code == 200 && res.data.data > 0) {
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
      },
      fail(res) {
        console.log("请求审核商家 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '网络波动，审核失败',
          icon: "none"
        })
      },
      complete(res) {
        wx.hideLoading();
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
    wx.request({
      url: config.URL_Service + config.URL_RejectStaffApply,
      data: tempStaffApply,
      method: "PUT",
      success(res) {
        console.log("请求驳回员工 success: \n" + JSON.stringify(res));
        if (res.data.code == 200 && res.data.data > 0) {
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
      },
      fail(res) {
        console.log("请求驳回员工 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '网络波动，驳回失败',
          icon: "none"
        })
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },

  /**
   * 请求审核员工申请
   */
  requestApprovalStaffApply: function (index) {
    const tempIndex = index;
    let tempStaffApply = this.data.staffApplyList[tempIndex];
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_ApprovalStaffApply,
      data: tempStaffApply,
      method: "PUT",
      success(res){
        console.log("请求审核员工 success: \n" + JSON.stringify(res));
        if (res.data.code == 200 && res.data.data > 0) {
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
      },
      fail(res) {
        console.log("请求审核员工 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '网络波动，审核失败',
          icon: "none"
        })
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },

})