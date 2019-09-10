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
      userInfo: loginUtil.getUserInfo()
    })
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestBillList(that.data.selectedBillType);
        that.requestBalance();
      }
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
      } else if (state == loginUtil.Login_Fail) {
        wx.showModal({
          title: '登陆失败',
          content: msg,
          showCancel: false,
          success(res) {
            if (res.confirm) {
              that.tapLoginOrRegister();
            }
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/register/register?backtype=0',
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
                url: '/pages/login/login',
              })
            }
          }
        })
      }
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
                url: '/pages/login/login',
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
                url: '/pages/login/login',
              })
            }
          }
        })
      }
    })
  },

  /**
   * 订单详情
   */
  tapOrderDetail: function (e) {
    console.log("详情：\n" + e.currentTarget.dataset.orderno)
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderno='+e.currentTarget.dataset.orderno,
    })
  },

  /**
   * 取消订单
   */
  tapCancelOrder: function (e) {
    console.log("取消：\n" + e.currentTarget.dataset.orderno)
    let that = this;
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
                url: '/pages/login/login',
              })
            }
          }
        })
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
                url: '/pages/login/login',
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
      url: '/pages/setting/setting',
    })
  },

  /**
   * 点击站内信
   */
  tapMessage: function () {
    console.log("点击站内信")
    wx.navigateTo({
      url: '/pages/message/message',
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
      url: '../recharge/recharge'
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
   * 领券
   */
  getCoupon: function() {
    wx.navigateTo({
      url: '../consigned/coupon/coupon',
    })
  },

  /**
   * 收货
   */
  receiveOrder: function () {
    wx.navigateTo({
      url: '../unConfirmOrder/unConfirmOrder',
    })
  },

  /**
   * 申请入驻驿站
   */
  applyStation: function () {
    wx.navigateTo({
      url: '/pages/registerStation/registerStation',
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
        openId: loginUtil.getOpenID()
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
        openId: loginUtil.getOpenID()
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
        openId: loginUtil.getOpenID()
      },
      success(res) {
        console.log("支付 success：\n" + JSON.stringify(res));
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
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
        openId: loginUtil.getOpenID(),
        orderNo: inputOrderNo
      },
      success(res) {
        console.log("查单 success：\n" + JSON.stringify(res));
        if (res.data.root != null && res.data.prompt == "Success") {
          that.hiddenPopMask();
          wx.navigateTo({
            url: '../orderDetail/orderDetail?orderno=' + res.data.root,
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
        openId: loginUtil.getOpenID(),
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
        "openId": loginUtil.getOpenID()
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