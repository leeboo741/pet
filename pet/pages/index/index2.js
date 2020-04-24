// pages/index/index2.js

const app = getApp();
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const pagePath = require("../../utils/pagePath.js");
const ShareUtil = require("../../utils/shareUtils.js");

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
      {
        bannerImageUrl: "https://img.taochonghui.com/weapp/banner02.jpg",
        bannerTargetUrl: "",
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
        data: 'wxca35493268376086',
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
        data: 'wxca35493268376086',
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
          wx.switchTab({
            url: pagePath.Path_Me_Index,
          })
        } else if (type == "rqimg") {
          loginUtil.checkLogin(function alreadyLoginCallback(state) {
            wx.hideLoading();
            if (state) {
              // wx.navigateTo({
              //   url: pagePath.Path_Station_Detail + "?stationno=" + app.ShareData.businessNo,
              // })
            } else {
              loginUtil.login();
            }
          })
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
      console.log('跳转小程序AppId:' + e.currentTarget.dataset.data + '/nPath:' + e.currentTarget.dataset.target);
      wx.navigateToMiniProgram({
        appId: e.currentTarget.dataset.data,
        path: e.currentTarget.dataset.target,
        envVersion: 'develop',
        success(res) {
          console.log('跳转小程序成功:' + JSON.stringify(res));
        },
        fail(res) {
          console.log('跳转小程序失败:' + JSON.stringify(res));
        }
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
    let openId = loginUtil.getOpenId();
    wx.request({
      url: config.URL_Service + config.URL_GetOrderNoByOrderNo,
      data: {
        openId: openId,
        orderNo: inputOrderNo
      },
      success(res) {
        console.log("查单 success：\n" + JSON.stringify(res));
        if (res.data.data != null && res.data.code == config.RES_CODE_SUCCESS) {
          wx.navigateTo({
            url: pagePath.Path_Order_Detail + '?orderno=' + res.data.data + '&type=0' + "&showprice=0",
          })

        } else {
          wx.showToast({
            title: '未能查到相应单据！',
            icon: "none"
          })
        }
      },
      fail(res) {
        console.log("查单 fail：\n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: "none"
        })
      },
      complete(res) {
        console.log("查单 complete：\n" + JSON.stringify(res));
      },
    })
  },
})