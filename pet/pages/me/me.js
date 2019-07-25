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

const bill_type_unpay = "待支付";
const bill_type_sendout = "待发货";
const bill_type_receiving = "待收货";
const bill_type_complete = "已完成";

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
    this.requestBillList();
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
   * 点击呼叫
   */
  tapCall: function () {
    console.log("点击呼叫")
  },

  /**
   * 点击设置
   */
  tapSetting: function () {
    console.log("点击设置")
  },

  /**
   * 单据类型选择
   */
  tapButtonTypeAction: function(e) {
    this.setData({
      selectedBillType: e.currentTarget.dataset.type
    })
    this.requestBillList();
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

  /** ================================= 网络请求 Start ==================================== */

  /**
   * 请求单据
   */
  requestBillList: function () {
    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      url: app.url.url + app.url.checkOrderListByOrderStatus,
      data: {
        "orderStatus": this.getSendBillType(this.data.selectedBillType),
        "openId": app.globalData.userInfo.openId
      },
      success(res){
        console.log("请求单据列表 success => \n" + JSON.stringify(res))
      },
      fail(res) {
        console.log("请求单据列表 fail => \n" + JSON.stringify(res))
      },
      complete(res) {
        console.log("请求单据列表 complete => \n" + JSON.stringify(res))
        wx.hideLoading();
      },
    })
  },

  /** ================================= 网络请求 Start ==================================== */

  /** ================================= 数据 Start ==================================== */

  /**
   * 设置订单类型
   */
  getSendBillType: function (billType) {
    let sendBillType = null;
    if (billType == 0) {
      sendBillType = bill_type_unpay;
    } else if (billType == 1) {
      sendBillType = bill_type_sendout;
    } else if (billType == 2) {
      sendBillType = bill_type_receiving;
    } else {
      sendBillType = bill_type_complete;
    }
    return sendBillType;
  },

  /** ================================= 数据 End ==================================== */

})