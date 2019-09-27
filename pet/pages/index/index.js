// pages/index/index.js

/**
 * ******** 首页 ********
 * ==============================================================================================
 * ==============================================================================================
 */

const app = getApp();
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [
      {
        bannerImageUrl: "http://47.99.244.168:6060/static/images/pet1.png", // 图片地址
        bannerTargetUrl: "http://huji820.oicp.net:25875/fd1ca163-c267-4e66-a059-669523202cf0.html", // 内容地址
      },
      {
        bannerImageUrl: "http://47.99.244.168:6060/static/images/pet2.png",
        bannerTargetUrl: "http://huji820.oicp.net:25875/3375f542-11fe-44d3-8900-0d1a94cc6f62.html",
      },
      {
        bannerImageUrl: "http://47.99.244.168:6060/static/images/pet3.png", // 图片地址
        bannerTargetUrl: "http://huji820.oicp.net:25875/fd1ca163-c267-4e66-a059-669523202cf0.html", // 内容地址
      }
    ], // banner数据列表
    gridList:[
      {
        name:"宠物运输",
        imagePath:"../../resource/pet_transport.png",
        targetUrl:"../consigned/base/base",
      },
      {
        name: "宠物寄养",
        imagePath: "../../resource/pet_foster.png",
        targetUrl: "",
      },
      {
        name: "宠物美容",
        imagePath: "../../resource/pet_cosmetology.png",
        targetUrl: "",
      },
      {
        name: "宠物医疗",
        imagePath: "../../resource/pet_medical.png",
        targetUrl: "",
      },
      {
        name: "宠物买卖",
        imagePath: "../../resource/pet_ trade.png",
        targetUrl: "",
      },
      {
        name: "宠物用品",
        imagePath: "../../resource/pet_articles.png",
        targetUrl: "",
      },
      {
        name: "宠物婚介",
        imagePath: "../../resource/pet_matchmaking.png",
        targetUrl: "",
      },
      {
        name: "积分商城",
        imagePath: "../../resource/pet_point.png",
        targetUrl: "",
      },
      {
        name: "宠物领养",
        imagePath: "../../resource/pet_adopt.png",
        targetUrl: "",
      },
      {
        name: "宠物殡葬",
        imagePath: "../../resource/pet_end.png",
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
   * 生命周期函数--监听页面加载
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
   * 点击
   */
  tapGrid: function (e) {
    wx.navigateTo({
      url: this.data.gridList[e.currentTarget.dataset.index].targetUrl,
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