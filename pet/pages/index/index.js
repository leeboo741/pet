// pages/index/index.js

/**
 * ******** 首页 ********
 * ==============================================================================================
 * ==============================================================================================
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [
      {
        bannerImageUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562730702177&di=df76908f37b8c5aa57db5758118e6814&imgtype=0&src=http%3A%2F%2Fjkzx8.com%2Fuploads%2F160721%2F40-160H11146103M.jpg", // 图片地址
        bannerTargetUrl: "http://huji820.oicp.net:25875/fd1ca163-c267-4e66-a059-669523202cf0.html", // 内容地址
      },
      {
        bannerImageUrl: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1398342743,2402782757&fm=26&gp=0.jpg",
        bannerTargetUrl: "http://huji820.oicp.net:25875/3375f542-11fe-44d3-8900-0d1a94cc6f62.html",
      },
      {
        bannerImageUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562730817614&di=e2f390f9a6f1020b8dc44f3fe7adea49&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20151211%2Fmp47894751_1449804610035_1_th.jpeg",
        bannerTargetUrl: "http://huji820.oicp.net:25875/ab98c06e-dd20-4965-90e2-5c5df7046413.html",
      },
      {
        bannerImageUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562730835323&di=31af2d379250c450b38cf97ce0924f3b&imgtype=0&src=http%3A%2F%2Fs13.sinaimg.cn%2Fmw690%2F005CQsmEzy6W5vAuHxO8c%26690",
        bannerTargetUrl: "http://huji820.oicp.net:25875/4dbf6753-ea06-483c-a27a-489091dbe070.html",
      },
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