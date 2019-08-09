//app.js

App({
  onLaunch: function () {

  },
  globalData: {

    /** =========== 全局数据 =========== */
    servicePhone: "0791-012234221", // 客服电话
    version: "beta1.1.14", // 版本号

    /** =========== 用户数据 =========== */
    userInfo: {
      customerNo: null, // id
      nickName: null, // 昵称
      avatarUrl: null, // 头像
      gender: null, // 性别
      openid: null, // openId
      phone: null, // 手机号
    }, // 用户信息
  },

  /** =========== 网络请求 url =========== */
  url: {
    // url: "http://47.99.244.168:6060",
    // url: "http://192.168.3.233:5050",
    // url: "http://192.168.3.187:5050",
    url: "http://192.168.3.111:5050",
    /** ============== 用户 =================== */ 
    register: "/api/customer/", // 注册
    login: "/api/oAuth", // 登陆
    updateCustomer: "/api/customer/updateCustomer", // 更新用户

    /** ============== 订单 =================== */
    petType: "/api/petType", // 宠物类型
    petClassify: "/api/petClassify", // 宠物种类
    order: "/api/order/insertOrder", // 下单
    checkOrderListByOrderStatus:"/api/order/listOrderList", // 根据订单类型查询订单列表
    uploadFile: "/api/consign/orderState/uploadFile", // 上传文件
    orderDetail: "/api/order/orderDetail", // 订单详情
    payment: "/api/order/getOrderPayParam", // 请求支付
    inHarbour: "/api/consign/port/inPort", // 入港单
    outHarbour: "/api/consign/port/outPort", // 出港单

    /** ============== 城市 =================== */
    startCity: "/api/transport/listStartCity", // 始发城市
    endCity: "/api/transport/listEndCity", // 目标城市
    ableTransportType: "/api/transport/listTransportType", // 可用运输方式
    ableStation: "/api/consign/onDoorService/getEndCityStation", // 是否有可用站点
    ableAirBox: "/aip/consign/airBox/listStationAixBox", // 是否有可用站点

    /** ============== 价格 =================== */
    predictPrice: "/api/order/getOrderPrice", // 获取预估价格
    insureRate: "/api/consign/insure", // 查询保价费率

  },
  requestPromptValueName: {
    success: "Success",
    error: "Error",
    notExist: "NotExist"
  }
})