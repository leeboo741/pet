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
    console.log("/me/me 销毁")
  },

  /** ================================= 生命周期 End ==================================== */

  /** ================================= 页面事件 Start ==================================== */

  /**
   * 点击登陆|注册
   */
  tapLoginOrRegister: function(){
    let that = this;
    loginUtil.login(function loginCallback(state, msg){
      if (state == loginUtil.Login_Success) {
        wx.showToast({
          title: '登陆成功',
        })
        that.setData({
          userInfo: loginUtil.getUserInfo()
        })
        that.requestBillList(that.data.selectedBillType);
        that.startGetNewMessageInterval();
      } else if (state == loginUtil.Login_Fail) {
        wx.showModal({
          title: '登陆失败',
          content: msg,
          success(res) {
            if (res.confirm) {
              that.tapLoginOrRegister();
            }
          }
        })
      } else {
        wx.navigateTo({
          url: pagePath.Path_Register + '?backtype=0',
        })
      }
    })
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
    console.log("checkBillNo:\n" + this.data.checkBillNo);
  },

  /**
   * 查单输入
   */
  searchInputAction: function(e) {
    this.data.checkBillNo = e.detail.value;
    console.log("checkBillNo:\n" + this.data.checkBillNo);
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
              wx.navigateTo({
                url: pagePath.Path_Login,
              })
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
        that.data.checkBillNo = res.result;
        loginUtil.checkLogin(function alreadyLoginCallback(state) {
          if (state) {
            that.requestCheckOrderNoByOrderNo(that.data.checkBillNo);
          } else {
            wx.showModal({
              title: '暂未登录',
              content: '请先登录后使用该功能',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: pagePath.Path_Login,
                  })
                }
              }
            })
          }
        })
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
              wx.navigateTo({
                url: pagePath.Path_Login,
              })
            }
          }
        })
      }
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
                    wx.navigateTo({
                      url: pagePath.Path_Login,
                    })
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
   * 订单详情
   */
  tapOrderDetail: function (e) {
    console.log("详情：\n" + e.currentTarget.dataset.orderno)
    wx.navigateTo({
      url: pagePath.Path_Order_Detail + '?orderno=' + e.currentTarget.dataset.orderno + '&type=0',
    })
  },

  /**
   * 取消订单
   */
  tapCancelOrder: function (e) {
    console.log("取消：\n" + e.currentTarget.dataset.orderno)
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
                    wx.navigateTo({
                      url: pagePath.Path_Login,
                    })
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
    console.log("支付：\n" + e.currentTarget.dataset.orderno);
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestPay(e.currentTarget.dataset.orderno);
      } else {
        wx.showModal({
          title: '暂未登录',
          content: '请先登录后使用该功能',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: pagePath.Path_Login,
              })
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
    console.log("点击呼叫")
    wx.makePhoneCall({
      phoneNumber: config.Service_Phone,
    })
  },

  /**
   * 点击设置
   */
  tapSetting: function () {
    console.log("点击设置")
    wx.navigateTo({
      url: pagePath.Path_Me_Setting,
    })
  },

  /**
   * 点击站内信
   */
  tapMessage: function () {
    console.log("点击站内信")
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
   * 查单
   */
  gotoCheckBill: function(){
    this.setData({
      showCheckBillPopView : true
    })
    console.log("checkBillNo:\n" + this.data.checkBillNo);
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
    wx.request({
      url: config.URL_Service + config.URL_ConfirmOrder,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST", // 请求方式
      data: {
        orderNo: orderNo,
        openId: loginUtil.getOpenId()
      },
      success(res) {
        console.log ("确认收货 success: \n" + JSON.stringify(res));
        if (res.data.prompt == config.Prompt_Success) {
          wx.showToast({
            title: '收货成功',
          })
          that.data.unreceiveList.splice(orderIndex, 1);
          that.setData({
            unreceiveList: that.data.unreceiveList
          })
        }
      },
      fail(res) {
        console.log("确认收货 fail: \n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("确认收货 complete: \n" + JSON.stringify(res));
        wx.hideLoading();
      },

    })
  },

  /**
   * 查询余额
   */
  requestBalance: function(){
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_CheckBalance,
      data: {
        openId: loginUtil.getOpenId()
      },
      success(res){
        console.log("查询余额 success => \n" + JSON.stringify(res));
        that.data.userInfo.balance = res.data.data;
        app.globalData.userInfo.balance = res.data.data;
        that.setData({
          userInfo: that.data.userInfo
        })
      },
      fail(res) {
        console.log("查询余额 fail => \n" + JSON.stringify(res));
        wx.showToast({
          title: '查询余额失败',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("查询余额 complete => \n" + JSON.stringify(res));
      }
    })
  },

  /**
   * 支付
   */
  requestPay: function (orderNo) {
    wx.showLoading({
      title: '支付中...',
    })
    wx.request({
      url: config.URL_Service + config.URL_Payment,
      data: {
        orderNo: orderNo,
        openId: loginUtil.getOpenId()
      },
      success(res) {
        console.log("支付 success：\n" + JSON.stringify(res));
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          success(res){
            that.setData({
              selectedBillType: 1
            })
            that.requestBillList(that.data.selectedBillType);
          }
        })
      },
      fail(res) {
        console.log("支付 fail：\n" + JSON.stringify(res));
        wx.showToast({
          title: '网络原因,支付失败',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("支付 complete：\n" + JSON.stringify(res));
        wx.hideLoading();
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
    wx.request({
      url: config.URL_Service + config.URL_GetOrderNoByOrderNo,
      data: {
        openId: loginUtil.getOpenId(),
        orderNo: inputOrderNo
      },
      success(res) {
        console.log("查单 success：\n" + JSON.stringify(res));
        if (res.data.root != null && res.data.prompt == "Success") {
          that.hiddenPopMask();
          wx.navigateTo({
            url: pagePath.Path_Order_Detail + '?orderno=' + res.data.root + '&type=0',
          })

        } else {
          if (res.data.root != null) {
            wx.showToast({
              title: res.data.root,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '未能查到相应单据！',
              icon: "none"
            })
          }
        }
      },
      fail(res) {
        console.log("查单 fail：\n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("查单 complete：\n" + JSON.stringify(res));
        wx.hideLoading();
      },
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
    wx.request({
      url: config.URL_Service + config.URL_CancelOrder,
      data: {
        openId: loginUtil.getOpenId(),
        orderNo: orderNo
      },
      method: "PUT",
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log("取消订单 success：\n" + JSON.stringify(res));
        if (res.data.root != null && res.data.prompt == "Success") {
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
          if (res.data.root != null) {
            wx.showToast({
              title: res.data.root,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '取消订单失败！',
              icon: "none"
            })
          }
        }
      },
      fail(res) {
        console.log("取消订单 fail：\n" + JSON.stringify(res));
        wx.showToast({
          title: '取消订单失败',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("取消订单 complete：\n" + JSON.stringify(res));
        wx.hideLoading();
      },
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
    wx.request({
      url: config.URL_Service + config.URL_GetOrderListByOrderStatus,
      data: {
        "orderStatus": this.getSendBillType(tempType),
        "openId": loginUtil.getOpenId()
      },
      success(res){
        console.log("请求单据列表 success => \n" + JSON.stringify(res))
        if (tempType == 0) {
          that.setData({
            unpayList: res.data.root
          })
        } else if (tempType == 1) {
          that.setData({
            unsendList: res.data.root
          })
        } else if (tempType == 2) {
          that.setData({
            unreceiveList: res.data.root
          })
        } else {
          that.setData({
            completeList: res.data.root
          })
        }
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

  /**
   * 查询 更新站内信
   */
  requestNewMessage: function () {
    let lastGetMessageTime = this.getLastGetMessageTime();
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_Get_New_Message,
      data: {
        openId: loginUtil.getOpenId(),
        lastModifyTime: lastGetMessageTime
      },
      success(res) {
        console.log("获取最新站内信 success:\n" + JSON.stringify(res));
        if (res.data.code == 200 && res.data.data > 0) {
          that.setData({
            haveNewMessage: true
          })
          that.setLastGetMessageTime(util.formatTime(new Date()));
        }
      },
      fail(res) {
        console.log("获取最新站内信 fail:\n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("获取最新站内信 complete:\n" + JSON.stringify(res));
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