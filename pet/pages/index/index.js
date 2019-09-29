// pages/index/index.js

/**
 * ******** 首页 ********
 * ==============================================================================================
 * ==============================================================================================
 */

const app = getApp();
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const util = require("../../utils/util.js");
const pagePath = require("../../utils/pagePath.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [
      {
        bannerImageUrl: "https://petimg.tyferp.com/weapp/banner01.jpg", // 图片地址
        bannerTargetUrl: "", // 内容地址
      },
      {
        bannerImageUrl: "https://petimg.tyferp.com/weapp/banner02.jpg",
        bannerTargetUrl: "",
      },
      {
        bannerImageUrl: "https://petimg.tyferp.com/weapp/banner03.jpg",
        bannerTargetUrl: "",
      }
    ], // banner数据列表
    gridList:[
      {
        name:"运输",
        imagePath:"../../resource/pet_yunshu.png",
        targetUrl: pagePath.Path_Order_Index,
      },
      {
        name: "集市",
        imagePath: "../../resource/pet_jishi.png",
        targetUrl: "",
      },
      {
        name: "用品",
        imagePath: "../../resource/pet_yongpin.png",
        targetUrl: "",
      },
      {
        name: "商城",
        imagePath: "../../resource/pet_shangcheng.png",
        targetUrl: "",
      },
      {
        name: "百科",
        imagePath: "../../resource/pet_baike.png",
        targetUrl: "",
      },
      {
        name: "婚介",
        imagePath: "../../resource/pet_hunjie.png",
        targetUrl: "",
      },
      {
        name: "训练",
        imagePath: "../../resource/pet_xunlian.png",
        targetUrl: "",
      },
      {
        name: "美容",
        imagePath: "../../resource/pet_meirong.png",
        targetUrl: "",
      },
      {
        name: "领养",
        imagePath: "../../resource/pet_lingyang.png",
        targetUrl: "",
      },
      {
        name: "酒店",
        imagePath: "../../resource/pet_jiudian.png",
        targetUrl: "",
      },
      {
        name: "旅游",
        imagePath: "../../resource/pet_lvyou.png",
        targetUrl: "",
      },
      {
        name: "殡葬",
        imagePath: "../../resource/pet_binzang.png",
        targetUrl: "",
      },
    ], // 按钮
    couponList:[
      {
        name: "限时最高满￥700减￥150",
        imagePath:null,
        title: "您有一份优惠券待领取"
      },
      {
        name: "全场通用打5折",
        imagePath: null,
        title: "您有一份优惠券待领取"
      },
      {
        name: "全场食品类买一送五",
        imagePath: null,
        title: "您有一份优惠券待领取"
      },
    ], // 优惠券
  },

  /* =========================== 生命周期管理 Start ================================ */

  /**
   * 生命周期函数--监听页面加载d
   */
  onLoad: function (options) {
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        loginUtil.login()
      }
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
    console.log("/index/index 销毁")
  },

  /* =========================== 生命周期管理 End ================================ */

  /* =========================== 页面事件 Start ================================ */

  /**
   * 点击大图
   */
  tapBigButton:function () {
    wx.navigateTo({
      url: pagePath.Path_Apply_Register_Station,
    })
  },

  /**
   * 点击
   */
  tapGrid: function (e) {
    let targetUrl = this.data.gridList[e.currentTarget.dataset.index].targetUrl
    if (util.checkEmpty(targetUrl)) {
      wx.showToast({
        title: '功能即将开放，敬请期待',
        icon: 'none'
      })
      return;
    }
    wx.navigateTo({
      url: targetUrl,
    })
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

  /* =========================== 页面事件 End ================================ */

})