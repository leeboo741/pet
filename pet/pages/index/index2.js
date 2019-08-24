// pages/index/index2.js

const app = getApp();
const config = require("../../utils/config.js");

const BUSINESS_ACTION_TYPE_NAVIGATE = 0;
const BUSINESS_ACTION_TYPE_SWITCH = 1;
const BUSINESS_ACTION_TYPE_OTHER = 2;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImagePath: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566542059794&di=da0f9ed8f0d7b37c0367dd55f1c8f7eb&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn20115%2F10%2Fw510h300%2F20181213%2F405a-hqackac1347548.jpg',
    businessList: [
      {
        icon: '../../resource/index_business_transport.png',
        name: '查运费',
        target: '../consigned/base/base',
        actionType: BUSINESS_ACTION_TYPE_NAVIGATE,
      },
      {
        icon: '../../resource/index_business_send_express.png',
        name: '寄宠物',
        target: '../consigned/base/base',
        actionType: BUSINESS_ACTION_TYPE_NAVIGATE,
      },
      {
        icon: '../../resource/index_business_abroad.png',
        name: '宠物出国',
        target: '../consigned/base/base',
        actionType: BUSINESS_ACTION_TYPE_NAVIGATE,
      },
      {
        icon: '../../resource/index_business_order_list.png',
        name: '我的订单',
        target: '../me/me',
        actionType: BUSINESS_ACTION_TYPE_SWITCH,
      },
      {
        icon: '../../resource/index_business_station.png',
        name: '附近网点',
        target: '../station/station',
        actionType: BUSINESS_ACTION_TYPE_SWITCH,
      },
      {
        icon: '../../resource/index_business_check_order.png',
        name: '订单跟踪',
        target: '../me/me',
        actionType: BUSINESS_ACTION_TYPE_SWITCH,
      },
    ]
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

  },

  /**
   * 点击业务
   */
  tapBusiness: function (e) {
    if (e.currentTarget.dataset.actiontype == BUSINESS_ACTION_TYPE_NAVIGATE) {
      wx.navigateTo({
        url: e.currentTarget.dataset.target,
      })
    } else if (e.currentTarget.dataset.actiontype == BUSINESS_ACTION_TYPE_SWITCH) {
      wx.switchTab({
        url: e.currentTarget.dataset.target,
      })
    } else {

    }
  },

  /**
   * 查找订单
   */
  confirmSearch: function (e) {
    this.requestCheckOrderNoByOrderNo(e.detail.value)
  },

  /**
   * 查单
   */
  requestCheckOrderNoByOrderNo: function (inputOrderNo) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_GetOrderNoByOrderNo,
      data: {
        openId: app.globalData.userInfo.openid,
        orderNo: inputOrderNo
      },
      success(res) {
        console.log("查单 success：\n" + JSON.stringify(res));
        if (res.data.root != null && res.data.prompt == "Success") {
          that.hiddenPopMask();
          wx.navigateTo({
            url: '../orderDetail/orderDetail?orderno=' + res.data.root,
          })

        } else {
          if (res.data.root != null) {
            wx.showToast({
              title: res.data.root,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '未能查到相应单据！',
              icon: "none"
            })
          }
        }
      },
      fail(res) {
        console.log("查单 fail：\n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("查单 complete：\n" + JSON.stringify(res));
        wx.hideLoading();
      },
    })
  },
})