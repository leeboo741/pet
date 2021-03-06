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

const bill_type_unpay = "待付款";
const bill_type_sendout = "待发货";
const bill_type_receiving = "待收货";
const bill_type_complete = "已完成";

const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const util = require("../../utils/util.js");
const pagePath = require("../../utils/pagePath.js");
const ShareUtil = require("../../utils/shareUtils.js");
const PayManager = require('../../manager/payManager/payManager');
const commonOrderManager = require("../../manager/orderManager/commonOrderManager.js");
const userManager = require("../../manager/userManager/userManager.js");
const balanceManager = require("../../manager/balanceManager/balanceManager.js");
const orderManager = require("../../manager/orderManager/orderManager.js");
const messageManager = require("../../manager/messageManager/messageManager.js");

const NEW_MESSAGE_LOOP_TIME = 10000;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null, // 用户信息
    selectedBillType: 0, // 选中单据类型
    showCheckBillPopView: false, // 展示查单页面
    checkBillNo: null, // 查单单号
    unpayList:[], // 待支付
    unsendList: [], // 待发货
    unreceiveList: [], // 待收货
    completeList: [], // 已完成
    haveNewMessage:false, // 新消息列表
    getNewMessageIntervalID: null,
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
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.setData({
          userInfo: loginUtil.getUserInfo()
        })
        if (app.globalData.showToBeShip) {
          that.setData({
            selectedBillType: 1
          })
          app.globalData.showToBeShip = false;
        }
        that.requestBillList(that.data.selectedBillType);
        that.requestBalance();
        that.startGetNewMessageInterval();
      } else {
        that.setData({
          userInfo: null
        })
      }
    })
    // 如果 扫码订单号不为空
    if (app.ShareData.scanOrderNo != null) {
      // 展示待收货页面
      that.setData({
        selectedBillType: 2
      })
      // 查询是否登陆
      loginUtil.checkLogin(function alreadyLoginCallback(isLogin) {
        // 如果已经登录, 向服务器查询本人是否可以签收该单据 , 如果没有登录，提示登录
        if (isLogin) {
          that.requestCheckConfirm(app.ShareData.scanOrderNo, loginUtil.getCustomerNo(),
            function getResultCallback(data) {
              if (data == 0) {
                wx.showModal({
                  title: '不能签收该订单',
                  content: '您无权限签收该订单，请咨询工作人员',
                  showCancel: false
                })
                app.ShareData.scanOrderNo = null;
              } else {
                wx.showModal({
                  title: '确认签收',
                  content: '是否确认签收订单：' + app.ShareData.scanOrderNo,
                  confirmText: "签收",
                  cancelText: "暂不签收",
                  success(res) {
                    if (res.confirm) {
                      that.requestRecieve(app.ShareData.scanOrderNo, -1);
                    }
                    app.ShareData.scanOrderNo = null;
                  }
                })
              }
            }
          )
          // 如果可以签收 弹窗提示是否签收
          // 如果不能签收 弹窗提示不能签收
        } else {
          wx.showModal({
            title: '需要登陆',
            content: '请登录后再签收该订单',
            confirmText: "去登陆",
            cancelText:"暂不签收",
            success(res) {
              if (res.confirm) {
                loginUtil.login();
              }
              app.ShareData.scanOrderNo = null;
            }
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.closeGetNewMessageInterval();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /** ================================= 生命周期 End ==================================== */

  /** ================================= 页面事件 Start ==================================== */

  /**
   * 点击登陆|注册
   */
  tapLoginOrRegister: function(button){
    loginUtil.login();
  },
  
  /**
   * 联系商家
   */
  tapCallStore: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },

  /**
   * 隐藏弹出框
   */
  hiddenPopMask: function(){
    this.data.checkBillNo = null;
    this.setData({
      showCheckBillPopView: false
    })
  },

  /**
   * 点击弹出框蒙层
   */
  tapPopMask: function (e) {
    this.hiddenPopMask();
  },

  /**
   * 查单输入
   */
  searchInputAction: function(e) {
    this.data.checkBillNo = e.detail.value;
  },

  /**
   * 查单键盘确认
   */
  confirmSearchAction: function(e) {
    if (e.detail.value == null || e.detail.value.length <= 0) {
      wx.showToast({
        title: '请输入查询内容',
        icon: 'none'
      })
      return;
    }
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestCheckOrderNoByOrderNo(e.detail.value);
      } else {
        wx.showModal({
          title: '暂未登录',
          content: '请先登录后使用该功能',
          success(res) {
            if (res.confirm) {
              loginUtil.login();
            }
          }
        })
      }
    })
  },

  /**
   * 扫码
   */
  scanBillAction: function () {
    let that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res){
        let tempParams = util.getUrlParamDict(res.result);
        if (!util.checkEmpty(tempParams) && !util.checkEmpty(tempParams.type) && tempParams.type == 'scan') {
          that.data.checkBillNo = tempParams.orderno;
          if (that.data.checkBillNo != null) {
            loginUtil.checkLogin(function alreadyLoginCallback(state) {
              if (state) {
                that.requestCheckOrderNoByOrderNo(that.data.checkBillNo);
              } else {
                wx.showModal({
                  title: '暂未登录',
                  content: '请先登录后使用该功能',
                  success(res) {
                    if (res.confirm) {
                      loginUtil.login();
                    }
                  }
                })
              }
            })
          }
        } else {
          wx.showToast({
            title: '请扫描有效二维码',
            icon: 'none'
          })
        }
      },
    })
  },

  /**
   * 查单确认按钮
   */
  searchBillAction: function (e) {
    if (this.data.checkBillNo == null || this.data.checkBillNo.length <= 0) {
      wx.showToast({
        title: '请输入查询内容',
        icon: 'none'
      })
      return;
    }
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestCheckOrderNoByOrderNo(that.data.checkBillNo);
      } else {
        wx.showModal({
          title: '暂未登录',
          content: '请先登录后使用该功能',
          success(res) {
            if (res.confirm) {
              loginUtil.login();
            }
          }
        })
      }
    })
  },

  /**
   * 点击收款码
   */
  tapCollectionQRCode: function(e) {
    wx.navigateTo({
      url: pagePath.Path_Me_StationSetting,
    })
  },

  /**
   * 确认收货
   */
  tapReceive: function (e) {
    let that = this;
    wx.showModal({
      title: '确认收货',
      content: e.currentTarget.dataset.orderno + '是否确认收货',
      success(res){
        if (res.confirm) {
          loginUtil.checkLogin(function alreadyLoginCallback(state) {
            if (state) {
              that.requestRecieve(e.currentTarget.dataset.orderno, e.currentTarget.dataset.tapindex);
            } else {
              wx.showModal({
                title: '暂未登录',
                content: '请先登录后使用该功能',
                success(res) {
                  if (res.confirm) {
                    loginUtil.login();
                  }
                }
              })
            }
          })
        }
      }
    })
  },

  /**
   * 点击待付款更多
   */
  tapUnpayMore: function (e) {
    let itemList = ["订单详情", "修改订单", "取消订单"];
    let index = e.currentTarget.dataset.tapindex;
    let orderNo = e.currentTarget.dataset.orderno;
    let that = this;
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        if (res.tapIndex == 0) { // 订单详情
          that.tapOrderDetail(e, that.data.unpayList[index]);
        } else if (res.tapIndex == 1) { // 修改订单
          that.tapEditOrder(e, true);
        } else if (res.tapIndex == 2) { // 取消订单
          that.tapCancelOrder(e);
        }
      },
    })
  },

  /**
   * 点击待发货更多
   */
  tapUnsendMore: function(e) {
    let itemList = ["订单详情", "修改订单"];
    let index = e.currentTarget.dataset.tapindex;
    let orderNo = e.currentTarget.dataset.orderno;
    let that = this;
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        if (res.tapIndex == 0) { // 订单详情
          that.tapOrderDetail(e,that.data.unsendList[index]);
        } else if (res.tapIndex == 1) { // 修改订单
          that.tapEditOrder(e, true);
        }
      },
    })
  },

  /**
   * 点击待收货更多
   */
  tapUnreceiveMore: function (e) {
    let itemList = ["订单详情", "修改订单"];
    let index = e.currentTarget.dataset.tapindex;
    let orderNo = e.currentTarget.dataset.orderno;
    let that = this;
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        if (res.tapIndex == 0) { // 订单详情
          that.tapOrderDetail(e, that.data.unreceiveList[index]);
        } else if (res.tapIndex == 1) { // 修改订单
          that.tapEditOrder(e, false);
        }
      },
    })
  },

  /**
   * 点击已完成更多
   */
  tapCompleteMore: function (e) {
    // let itemList = ["订单详情", "评价"];
    let itemList = ["订单详情"];
    let index = e.currentTarget.dataset.tapindex;
    let orderNo = e.currentTarget.dataset.orderno;
    let tempOrder = this.data.completeList[index];
    let that = this;
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        if (res.tapIndex == 0) { // 订单详情
          that.tapOrderDetail(e, that.data.completeList[index]);
        }
        //  else if (res.tapIndex == 1) { // 修改订单
        //   // that.tapEditOrder(e, false);
        //   that.evaluateOrder(tempOrder)
        // }
      },
    })
  },

  /**
   * 评价订单
   */
  evaluateOrder: function (order) {
    wx.navigateTo({
      url: pagePath.Path_Order_Evaluate + "?orderno=" + order.orderNo,
    })
  },

  /**
   * 修改订单
   * @param e 订单信息
   * @param ableEdit 是否允许编辑
   */
  tapEditOrder: function (e, ableEdit) {
    wx.navigateTo({
      url: pagePath.Path_Order_Edit + '?orderno=' + e.currentTarget.dataset.orderno + '&able=' + ableEdit,
    })
  },

  /**
   * 订单详情
   */
  tapOrderDetail: function (e, order) {
    let showPrice = 0;
    if (this.data.userInfo.phone == order.senderPhone) {
      showPrice = 1;
    }
    wx.navigateTo({
      url: pagePath.Path_Order_Detail + '?orderno=' + e.currentTarget.dataset.orderno + '&type=0' + '&ablepremium=1' + "&ablecancelpremium=0" + "&showprice=" + showPrice,
    })
  },

  /**
   * 取消订单
   */
  tapCancelOrder: function (e) {
    let that = this;
    wx.showModal({
      title: '取消订单',
      content: '是否确认取消订单' + e.currentTarget.dataset.orderno,
      success(res){
        if(res.confirm){
          loginUtil.checkLogin(function alreadyLoginCallback(state) {
            if (state) {
              that.requestCancelOrder(e.currentTarget.dataset.orderno, e.currentTarget.dataset.tapindex);
            } else {
              wx.showModal({
                title: '暂未登录',
                content: '请先登录后使用该功能',
                success(res) {
                  if (res.confirm) {
                    loginUtil.login();
                  }
                }
              })
            }
          })
        }
      }
    })
  },

  /**
   * 支付订单
   */
  tapToPay: function (e) {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestPay(e.currentTarget.dataset.amount,e.currentTarget.dataset.orderno);
      } else {
        wx.showModal({
          title: '暂未登录',
          content: '请先登录后使用该功能',
          success(res) {
            if (res.confirm) {
              loginUtil.login();
            }
          }
        })
      }
    })
  },

  /**
   * 点击呼叫
   */
  tapCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: config.Service_Phone,
    })
  },

  /**
   * 点击设置
   */
  tapSetting: function () {
    // wx.navigateTo({
    //   url: pagePath.Path_Me_Setting,
    // })
    let that = this;
    wx.showActionSheet({
      itemList: ["退出登陆","更新用户信息"],
      success(res) {
        if(res.tapIndex == 0) {
          wx.clearStorage();
          that.setData({
            userInfo: loginUtil.getUserInfo()
          })
        } else if (res.tapIndex == 1) {
          loginUtil.checkLogin(function alreadyLoginCallback(isLogin) {
            if (isLogin) {
              loginUtil.updateCustomer(function updateCallback(isSuccess){
                if (isSuccess) {
                  
                  loginUtil.resetBalance(data);
                  that.setData({
                    userInfo: loginUtil.getUserInfo()
                  })
                }
              })
            } else {
              wx.showToast({
                title: '请先登录',
                icon:'none'
              })
            }
          })
        }
      }
    })
  },

  /**
   * 点击站内信
   */
  tapMessage: function () {
    this.setData({
      haveNewMessage: false
    })
    wx.navigateTo({
      url: pagePath.Path_Me_Message,
    })
  },

  /**
   * 单据类型选择
   */
  tapButtonTypeAction: function(e) {
    this.setData({
      selectedBillType: e.currentTarget.dataset.type
    })
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestBillList(that.data.selectedBillType);
      }
    })
  },

  /**
   * 进入充值页面
   */
  gotoRecharge: function() {
    wx.navigateTo({
      url: pagePath.Path_Me_Recharge
    })
  },

  /**
   * 查看余额流水
   */
  tapBalance: function() {
    wx.navigateTo({
      url: pagePath.Path_Me_Balance_Flow,
    })
  },

  /**
   * 查单
   */
  gotoCheckBill: function(){
    this.setData({
      showCheckBillPopView : true
    })
  },

  /**
   * 进入提现页面
   */
  gotoWithDrawal: function() {
    wx.navigateTo({
      url: pagePath.Path_Me_Withdrawal
    })
  },

  /**
   * 前往未付款订单
   */
  gotounpay: function() {
    wx.navigateTo({
      url: pagePath.Path_Order_Unpay,
    })
  },

  /**
   * 前往工单
   */
  gotoWorkbench: function () {
    wx.navigateTo({
      url: pagePath.Path_Order_Workbench,
    })
  },

  /**
   * 前往完结单据
   */
  gotoFinishOrder: function () {
    wx.navigateTo({
      url: pagePath.Path_Order_All,
    })
  },

  /**
   * 领券
   */
  getCoupon: function() {
    wx.navigateTo({
      url: pagePath.Path_Order_Coupon,
    })
  },

  /**
   * 收货
   */
  receiveOrder: function () {
    wx.navigateTo({
      url: pagePath.Path_Order_UnConfirmOrder,
    })
  },

  /**
   * 申请入驻驿站
   */
  applyStation: function () {
    wx.navigateTo({
      url: pagePath.Path_Apply_Index
    })
  },

  /**
   * 点击审批
   */
  gotoApproval: function () {
    wx.navigateTo({
      url: pagePath.Path_Me_Approval,
    })
  },

  tapStaffManager: function() {
    wx.navigateTo({
      url: pagePath.Path_Me_StaffManager,
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
    return ShareUtil.getOnShareAppMessageForShareOpenId();
  },

  /** ================================= 页面事件 End ==================================== */

  /** ================================= 网络请求 Start ==================================== */

  /**
   * 收货请求
   */
  requestRecieve: function(orderNo, orderIndex) {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    commonOrderManager.checkUnpayPremiumCount(orderNo, function(success, data) {
      wx.hideLoading();
      if (success) {
        if (data > 0) {
          wx.showModal({
            title: '无法确认收货!',
            content: '还有未支付补价单,不能进行收货操作!',
            confirmText: '前往补价',
            cancelText: '暂不收货',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: pagePath.Path_Order_Detail + '?orderno=' + orderNo + '&type=0' + '&ablepremium=1' + "&ablecancelpremium=0" + "&showprice=" + showPrice,
                })
              }
            }
          })
        } else {
          wx.showLoading({
            title: '请稍等...',
          })
          commonOrderManager.confirmOrderReceiving(orderNo, null, function(success, data) {
            wx.hideLoading();
            if (success) {
              wx.showToast({
                title: '收货成功',
              })
              if (orderIndex >=  0) {
                that.data.unreceiveList.splice(orderIndex, 1);
                that.setData({
                  unreceiveList: that.data.unreceiveList
                })
              }
              userManager.checkHaveNewGiftBagOnPetMall(function(success, data) {
                if (success) {
                  if (data) {
                    wx.showModal({
                      title: '您有大礼包待领取',
                      content: '您有一个商城大礼包待领取,是否前往领取?',
                      confirmText: '前往领取',
                      cancelText: '下次再说',
                      success(res) {
                        if (res.confirm) {
                          wx.navigateToMiniProgram({
                            appId: config.MINI_PROGRAME_APPID_PETMALL,
                            path: "pages/index/index?source=mini_app_transport&target=getnewgiftbag",
                            envVersion: config.ENV_CURRENT,
                          })
                        }
                      }
                    })
                  }
                }
              })
            } else {
              wx.showToast({
                title: '收货失败',
                icon: "none"
              })
            }
          })
        }
      } else {
        wx.showToast({
          title: '查询补价单失败!',
          icon:'none'
        })
      }
    })
  },

  /**
   * 查询余额
   */
  requestBalance: function(){
    let that = this;
    balanceManager.getBalance(function(success, data) {
      if (success) {
        loginUtil.resetBalance(data);
        that.setData({
          userInfo: loginUtil.getUserInfo()
        })
      } else {
        wx.showToast({
          title: '查询余额失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 支付
   */
  requestPay: function (amount,orderNo) {

    wx.navigateTo({
      url: pagePath.Path_Order_Pay_SubPay + "?amount=" + amount + "&orderno=" + orderNo + "&customerno=" + loginUtil.getCustomerNo(),
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
          that.hiddenPopMask();
          wx.navigateTo({
            url: pagePath.Path_Order_Detail + '?orderno=' + data + '&type=0' + "&ablecancelpremium=0" + "&showprice=0",
          })
        } else {
          wx.showToast({
            title: '没有查到相应单据',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: '查询失败',
          icon: "none"
        })
      }
    })
  },

  /**
   * 取消订单
   */
  requestCancelOrder: function (orderNo, orderIndex) {
    wx.showLoading({
      title: '取消订单中...',
    })
    const tempType = this.data.selectedBillType;
    const tempIndex = orderIndex;
    let that = this;
    orderManager.cancelOrder(orderNo, function(success, data){
      wx.hideLoading({
        success: (res) => {},
      })
      if (success) {
        if (tempType == 0) {
          that.data.unpayList.splice(tempIndex, 1);
          that.setData({
            unpayList: that.data.unpayList
          })
        } else if (tempType == 1) {
          that.data.unsendList.splice(tempIndex, 1)
          that.setData({
            unsendList: that.data.unsendList
          })
        } else if (tempType == 2) {
          that.data.unreceiveList.splice(tempIndex, 1)
          that.setData({
            unreceiveList: that.data.unreceiveList
          })
        } else {
          that.data.completeList.splice(tempIndex, 1)
          that.setData({
            completeList: that.data.completeList
          })
        }
        wx.showToast({
          title: '取消订单成功！'
        })
      } else {
        wx.showToast({
          title: '取消订单失败！',
          icon: "none"
        })
      }
    })
  },

  /**
   * 请求单据
   */
  requestBillList: function (billType) {
    wx.showLoading({
      title: '请稍等...',
    })
    const tempType = billType;
    let that = this;
    orderManager.getCustomerOrderList(this.getSendBillType(tempType), function(success, data){
      wx.hideLoading({
        success: (res) => {},
      })
      if (success) {
        if (tempType == 0) {
          that.setData({
            unpayList: data
          })
        } else if (tempType == 1) {
          that.setData({
            unsendList: data
          })
        } else if (tempType == 2) {
          that.setData({
            unreceiveList: data
          })
        } else {
          that.setData({
            completeList: data
          })
        }
      } else {
        wx.showToast({
          title: '获取订单列表失败',
          icon: "none"
        })
      }
    })
  },

  /**
   * 查询 更新站内信
   */
  requestNewMessage: function () {
    let that = this;
    messageManager.getNewMessage(function(success, data){
      if (success) {
        that.setData({
          haveNewMessage: data > 0
        })
      } else {
        wx.showToast({
          title: '获取最新站内信失败',
          icon: "none"
        })
      }
    })
  },

  /**
   * 查询是否可以收货
   */
  requestCheckConfirm: function (orderNo, customerNo, getResultCallback) {
    orderManager.checkOrderConfirmReceiveAble(orderNo, customerNo, function(success, data){
      if (success) {
        if (getResultCallback != null && typeof getResultCallback == 'function') {
          getResultCallback(data)
        }
      } else {
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        })
      }
    })
  },

  /** ================================= 网络请求 Start ==================================== */

  /** ================================= 数据 Start ==================================== */

  /**
   * 获取最后更新时间
   */
  getLastGetMessageTime: function() {
    try{
      let lastTime = wx.getStorageSync(config.Key_LastGetMessageTime);
      return lastTime;
    }catch (e){
      return config.Value_Default_LastGetMessageTime;
    }
  },

  /**
   * 存储最后更新时间
   */
  setLastGetMessageTime: function(time) {
    try {
      wx.setStorageSync(config.Key_LastGetMessageTime, time);
    } catch (e) {

    }
  },

  /**
   * 开启新信息定时器
   */
  startGetNewMessageInterval: function () {
    let that = this;
    this.data.getNewMessageIntervalID = setInterval(function(){
      that.requestNewMessage();
    }, NEW_MESSAGE_LOOP_TIME);
  },

  /**
   * 关闭新信息定时器
   */
  closeGetNewMessageInterval: function() {
    clearInterval(this.data.getNewMessageIntervalID);
    this.data.getNewMessageIntervalID = null;
  },

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