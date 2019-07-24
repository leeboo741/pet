/**
 * ******** 个人中心页面 ********
 * ===================================================================================================================================
 * 个人信息
 * 余额
 * 充值
 * 常用
 * 单据
 * 设置
 * ===================================================================================================================================
 */

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null, // 用户信息
    selectedBillType: 0,
    billList: [
      {
        shjda: {
          shjmch: '测试商家' // 商家名称
        }, // 商家
        express: '江西舒宠快运', // 快递
        ontime: '11:11:11',
        orderNo:'19050611111111', // 单号
        amount:10000, // 价格
        orderDate: "2019-06-01", // 下单日期
        startCity: "南昌", // 始发城市
        endCity: "北京", // 收货城市
        petBreed: "哈士奇", // 宠物品种
        petType: "小母狗", // 宠物类型
        transportType: "空运单非", // 运输类型
        payState: "已支付", // 支付状态
      }
    ]
  },



  /** ================================= 生命周期 Start ==================================== */

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
    this.setData({
      userInfo: app.globalData.userInfo
    })
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

  /** ================================= 生命周期 End ==================================== */

  /** ================================= 页面事件 Start ==================================== */

  /**
   * 单据类型选择
   */
  tapButtonTypeAction: function(e) {
    this.setData({
      selectedBillType: e.currentTarget.dataset.type
    })
  },

  /**
   * 进入充值页面
   */
  gotoRecharge: function() {
    wx.navigateTo({
      url: '../recharge/recharge'
    })
  },

  /**
   * 查单
   */
  gotoCheckBill: function(){

  },

  /**
   * 进入提现页面
   */
  gotoWithDrawal: function() {
    wx.navigateTo({
      url: '../withdrawal/withdrawal'
    })
  },

  /**
   * 出港
   */
  gotoOutHarbour: function() {
    wx.navigateTo({
      url: '../consigned/outHarbour/outHarbour'
    })
  },

  /**
   * 入港
   */
  gotoInHarbour: function () {
    wx.navigateTo({
      url: '../consigned/inHarbour/inHarbour'
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

  /** ================================= 页面事件 End ==================================== */
})