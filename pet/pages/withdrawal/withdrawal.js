/**
 * ******** 提现 ********
 * ==========================================================================
 * ==========================================================================
 */

const app = getApp();
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const pagePath = require("../../utils/pagePath.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    withdrawalAmount: null, // 提现金额
    balanceAmount: 0, // 系统余额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      balanceAmount: app.globalData.userInfo.balance
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
    console.log("/withdrawal/withdrawal 销毁")
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
   * 提现
   */
  tapWithdrawal: function() {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestWithdrawal();
      } else {
        wx.showModal({
          title: '暂未登录',
          content: '请先登录后使用该功能',
          success(res){
            if (res.confirm) {
              wx.navigateTo({
                url: pagePath.Path_Login,
              })
            }
          }
        })
      }
    })
  },

  /**
   * 请求提现
   */
  requestWithdrawal: function () {
    if (this.data.withdrawalAmount == null || this.data.withdrawalAmount == 0) {
      wx.showToast({
        title: '提现金额不能为零',
        icon: 'none'
      })
      return;
    }
    if (this.data.withdrawalAmount > this.data.balanceAmount) {
      wx.showToast({
        title: '余额不足',
        icon: 'none'
      })
      return;
    } 
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_Withdraw,
      data: {
        openId: loginUtil.getOpenId(),
        amount: this.data.withdrawalAmount
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST", // 请求方式
      success(res) {
        console.log("提现 success : \n" + JSON.stringify(res));
        wx.showModal({
          title: '提现申请已经提交',
          content: '请耐心等待...',
        })
      },
      fail(res) {
        console.log("提现 fail : \n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("提现 complete : \n" + JSON.stringify(res));
        wx.hideLoading();
      },
    })
  },

  /**
   * 金额输入
   */
  inputAmount: function(e) {
    this.data.withdrawalAmount = e.detail.value
  },
})