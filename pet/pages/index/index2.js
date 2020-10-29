// pages/index/index2.js

const app = getApp();
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const pagePath = require("../../utils/pagePath.js");
const ShareUtil = require("../../utils/shareUtils.js");
const orderManager = require("../../manager/orderManager/orderManager.js");

const BUSINESS_ACTION_TYPE_NAVIGATE = 0;
const BUSINESS_ACTION_TYPE_SWITCH = 1;
const BUSINESS_ACTION_TYPE_MINIPROGRAME = 2;
const BUSINESS_ACTION_TYPE_OTHER = 3;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [
      {
        bannerImageUrl: "https://img.taochonghui.com/weapp/banner01.jpg", // 图片地址
        bannerTargetUrl: "", // 内容地址
      },
    ], // banner数据列表
    businessList: [
      {
        icon: '../../resource/index_business_transport.png',
        name: '下单说明',
        target: pagePath.Path_Contract_OrderExplain,
        actionType: BUSINESS_ACTION_TYPE_NAVIGATE,
      },
      {
        icon: '../../resource/index_business_send_express.png',
        name: '寄宠物',
        target: pagePath.Path_Order_Index,
        actionType: BUSINESS_ACTION_TYPE_NAVIGATE,
      },
      {
        icon: '../../resource/index_business_abroad.png',
        name: '宠物商城',
        target: "pages/index/index?source=mini_app_transport&target=mall",
        data: config.MINI_PROGRAME_APPID_PETMALL,
        actionType: BUSINESS_ACTION_TYPE_MINIPROGRAME,
      },
      {
        icon: '../../resource/index_business_order_list.png',
        name: '我的订单',
        target: pagePath.Path_Me_Index,
        actionType: BUSINESS_ACTION_TYPE_SWITCH,
      },
      {
        icon: '../../resource/index_business_station.png',
        name: '附近网点',
        target: pagePath.Path_Station_Map,
        actionType: BUSINESS_ACTION_TYPE_NAVIGATE,
      },
      {
        icon: '../../resource/index_business_check_order.png',
        name: '商城积分',
        target: "pages/index/index?source=mini_app_transport&target=pointexchange",
        data: config.MINI_PROGRAME_APPID_PETMALL,
        actionType: BUSINESS_ACTION_TYPE_MINIPROGRAME,
      },
    ]
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (loginUtil.updateAppVersion()) {
      loginUtil.deleteUserInfo();
    }
    loginUtil.checkLogin(function alreadyLoginCallback(isLogin){
      if (isLogin) {
        loginUtil.updateCustomer()
      }
    })
    ShareUtil.getAppOpenData(options,
      function getResultCallback(type, data) {
        if (type == 'none') {
          loginUtil.checkLogin(function alreadyLoginCallback(state) {
            if (state) {
              loginUtil.getNewUserInfo()
            }
          })
        } else if (type == 'share') {

        } else if (type == 'scan') {
          wx.showLoading({
            title: '请稍等...',
          })
          loginUtil.checkLogin(function alreadyLoginCallback(isLogin) {
            if (isLogin && loginUtil.getStaffNo() != null) {
              wx.navigateTo({
                url: '/pages/orderDetail/workOrderDetail/index' + "?orderno=" + app.ShareData.scanOrderNo,
              })
            } else {
              wx.switchTab({
                url: pagePath.Path_Me_Index,
              })
            }
          })
        } else if (type == "rqimg") {
          loginUtil.checkLogin(function alreadyLoginCallback(state) {
            wx.hideLoading();
            if (state) {
              
            } else {
              loginUtil.login();
            }
          })
        } else if (type == 'sharetopay') {
          
        }
      }
    )
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
    if (app.ShareData.businessNo != null) {
      loginUtil.checkLogin(function alreadyLoginCallback(state) {
        wx.hideLoading();
        if (state) {
          // wx.navigateTo({
          //   url: pagePath.Path_Station_Detail + "?stationno=" + app.ShareData.businessNo,
          // })
        }
      })
    } 

    if (app.ShareData.payOrderNo != null) {
      wx.showModal({
        title: "有代支付订单",
        content: "订单:" + app.ShareData.payOrderNo + " 请查看详情",
        confirmColor: "#EE2C2C",
        confirmText: "查看详情",
        cancelText: "返回首页",
        success(res) {
          if (res.confirm) {
            loginUtil.checkLogin(function alreadyLoginCallback(state) {
              if (state) {
                wx.navigateTo({
                  url: pagePath.Path_Order_Detail + "?orderno=" + app.ShareData.payOrderNo + "&showpaybutton=1&showPrice=1",
                })
              } else {
                loginUtil.login();
              }
            })
          } else {
            app.ShareData.payOrderNo = null;
            app.ShareData.payAmount = null;
            app.ShareData.payCustomerNo = null;
            app.ShareData.shareQRCodePath = null;
            app.ShareData.shareOtherPayType = null;
          }
        }
      })
      
    }
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
    } else if (e.currentTarget.dataset.actiontype == BUSINESS_ACTION_TYPE_MINIPROGRAME) {
      wx.navigateToMiniProgram({
        appId: e.currentTarget.dataset.data,
        path: e.currentTarget.dataset.target,
        envVersion: config.ENV_CURRENT,
      })
    } else {

    }
  },

  /**
   * 查找订单
   */
  confirmSearch: function (e) {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state){
      if (state) {
        that.requestCheckOrderNoByOrderNo(e.detail.value)
      } else {
        wx.showModal({
          title: '暂未登录',
          content: '请登录后使用该功能',
          success (res) {
            if (res.confirm) {
              loginUtil.login();
            }
          }
        })
      }
    })
  },

  /**
   * 查单
   */
  requestCheckOrderNoByOrderNo: function (inputOrderNo) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    orderManager.getOrderByOrderNo(inputOrderNo, function(success, data){
      wx.hideLoading({
        success: (res) => {},
      })
      if (success) {
        if (data != null) {
          wx.navigateTo({
            url: pagePath.Path_Order_Detail + '?orderno=' + data + '&type=0' + "&showprice=0",
          })
        } else {
          wx.showToast({
            title: '未能查到相应单据',
            icon:'none'
          })
        }
      } else {
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        })
      }
    })
  },
})