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
    selectedBillType: 0, // 选中单据类型
    unpayList:[
      {
        shjda:{
          shjmch: "测试商家"
        }, // 商家
        express: "江西舒宠快运", // 快递
        orderDate: "2019-06-01 11:12:32", // 下单时间
        orderNo: "1905061231112311", // 单号
        amount: 100000, // 金额
        startCity: '南昌', // 始发城市
        endCity: "北京", // 收货城市
        petBreed: "哈士奇", // 宠物品种
        petType: "狗", // 宠物类型
        transportType: "空运单飞", // 运输类型
        state: "待支付", // 状态
        count: 1, // 数量
        weight: 10, // 重量
        airbox: null, // 是否购买航空箱
        receivePetAddress: null, // 上门接宠地址
        sendPetAddress: null, // 送宠到家地址
        insuredPrice: 0, // 保价金额
        petCan: null, // 是否领取免费罐头
        sendCustomerName: '李三', // 寄件人名称
        receiveCustomerName: '张思', // 收件人名称
        sendCustomerPhone: '16678542215', // 寄件人电话
        receiveCustomerPhone: '18542214571', // 收件人电话
        remark: "ceshiceshi", // 订单备注
      },
    ], // 待支付
    unsendList: [
      {
        shjda: {
          shjmch: "测试商家"
        }, // 商家
        express: "江西舒宠快运", // 快递
        orderDate: "2019-06-01 11:12:32", // 下单时间
        orderNo: "1905061231112311", // 单号
        amount: 100000, // 金额
        startCity: '南昌', // 始发城市
        endCity: "北京", // 收货城市
        petBreed: "哈士奇", // 宠物品种
        petType: "狗", // 宠物类型
        transportType: "空运单飞", // 运输类型
        state: "待发货", // 状态
        count: 1, // 数量
        weight: 10, // 重量
        airbox: null, // 是否购买航空箱
        receivePetAddress: null, // 上门接宠地址
        sendPetAddress: null, // 送宠到家地址
        insuredPrice: 0, // 保价金额
        petCan: null, // 是否领取免费罐头
        sendCustomerName: '李三', // 寄件人名称
        receiveCustomerName: '张思', // 收件人名称
        sendCustomerPhone: '16678542215', // 寄件人电话
        receiveCustomerPhone: '18542214571', // 收件人电话
        remark: "ceshiceshi", // 订单备注
      },
    ], // 待发货
    unreceiveList: [
      {
        shjda: {
          shjmch: "测试商家"
        }, // 商家
        express: "江西舒宠快运", // 快递
        orderDate: "2019-06-01 11:12:32", // 下单时间
        orderNo: "1905061231112311", // 单号
        amount: 100000, // 金额
        startCity: '南昌', // 始发城市
        endCity: "北京", // 收货城市
        petBreed: "哈士奇", // 宠物品种
        petType: "狗", // 宠物类型
        transportType: "空运单飞", // 运输类型
        state: "待收货", // 状态
        count: 1, // 数量
        weight: 10, // 重量
        airbox: null, // 是否购买航空箱
        receivePetAddress: null, // 上门接宠地址
        sendPetAddress: null, // 送宠到家地址
        insuredPrice: 0, // 保价金额
        petCan: null, // 是否领取免费罐头
        sendCustomerName: '李三', // 寄件人名称
        receiveCustomerName: '张思', // 收件人名称
        sendCustomerPhone: '16678542215', // 寄件人电话
        receiveCustomerPhone: '18542214571', // 收件人电话
        remark: "ceshiceshi", // 订单备注
      },
    ], // 待收货
    completeList: [
      {
        shjda: {
          shjmch: "测试商家"
        }, // 商家
        express: "江西舒宠快运", // 快递
        orderDate: "2019-06-01 11:12:32", // 下单时间
        orderNo: "1905061231112311", // 单号
        amount: 100000, // 金额
        startCity: '南昌', // 始发城市
        endCity: "北京", // 收货城市
        petBreed: "哈士奇", // 宠物品种
        petType: "狗", // 宠物类型
        transportType: "空运单飞", // 运输类型
        state: "已完成", // 状态
        count: 1, // 数量
        weight: 10, // 重量
        airbox: null, // 是否购买航空箱
        receivePetAddress: null, // 上门接宠地址
        sendPetAddress: null, // 送宠到家地址
        insuredPrice: 0, // 保价金额
        petCan: null, // 是否领取免费罐头
        sendCustomerName: '李三', // 寄件人名称
        receiveCustomerName: '张思', // 收件人名称
        sendCustomerPhone: '16678542215', // 寄件人电话
        receiveCustomerPhone: '18542214571', // 收件人电话
        remark: "ceshiceshi", // 订单备注
      },
    ], // 已完成
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
   * 投诉
   */
  tapComplain: function (e) {
    console.log("投诉：\n" + e.currentTarget.dataset.orderno)
  },

  /**
   * 订单详情
   */
  tapOrderDetail: function (e) {
    console.log("详情：\n" + e.currentTarget.dataset.orderno)
    wx.navigateTo({
      url: '../orderDetail/orderDetail',
    })
  },

  /**
   * 取消订单
   */
  tapCancelOrder: function (e) {
    console.log("取消：\n" + e.currentTarget.dataset.orderno)
  },

  /**
   * 支付订单
   */
  tapToPay: function (e) {
    console.log("支付：\n" + e.currentTarget.dataset.orderno)
  },

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
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
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
  requestBillList: function (billType) {
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