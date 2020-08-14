// pages/orderDetail/orderDetail.js
const app = getApp();
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const util = require("../../utils/util.js");
const ShareUtil = require("../../utils/shareUtils.js");
const PayManager = require("../../manager/payManager/payManager");
const PagePath = require("../../utils/pagePath");

var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
const commonOrderManager = require("../../manager/orderManager/commonOrderManager.js");
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: null,
    userInfo: null,
    userRole: null, // 用户角色
    remarksInput: null,
    type: 0,  // 0 自有单据 1 工作单据
    orderNo: null,
    ablePremium: false, // 是否允许补价
    ableCancelPremium: true, // 是否允许取消补价
    showConfirmButton: false, // 是否展示签收按钮
    showPrice: false, // 是否展示价格
    rebate: 0, // 是否分享返利进入 0 否 1 是
    showPayButton: false, // 是否允许支付

    otherPayCustomerNo: null,

    backTimeIntervial: null,

    conditionOneAgreement: false, // 条件1是否同意
    conditionTwoAgreement: false, // 条件2是否同意
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderNo = options.orderno;
    qqmapsdk = new QQMapWX({
      key: config.Key_QQ_Map
    });

    this.setData({
      type: options.type,
      userInfo: loginUtil.getUserInfo(),
      ablePremium: options.ablepremium==1? true: false,
      ableCancelPremium: options.ablecancelpremium==0? false: true,
      showPrice: options.showprice==0? false: true,
      rebate: options.rebate==null?0:options.rebate,
      showPayButton : (options.showpaybutton == null || options.showpaybutton == 0)?false: true,
    })
    this.requestOrderDetail(this.data.orderNo)
    let that = this;
    this.requestCheckConfirm(this.data.orderNo, loginUtil.getCustomerNo(),
      function getResultCallback(data) {
        console.log("是否可以确认签收 :\n" + JSON.stringify(data));
        if (data == 0) {
          
        } else {
          that.setData({
            showConfirmButton: true
          })
        }
      }
    )
  },

  /**
   * 收货请求
   */
  requestRecieve: function (orderNo) {
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
            showCancel: false,
            confirmText: '前往补价',
          })
        } else {
          wx.showLoading({
            title: '请稍等...',
          })
          commonOrderManager.confirmOrderReceiving(orderNo,null,function(success, data) {
            wx.hideLoading();
            if (success) {
              wx.showLoading({
                title: '请稍等...',
              })
              userManager.checkHaveNewGiftBagOnPetMall(function(success, data) {
                wx.hideLoading();
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
                        } else {
                          wx.navigateBack()
                        }
                      }
                    })
                  } else {
                    wx.navigateBack()
                  }
                } else {
                  wx.navigateBack()
                }
              })
            } else {
              wx.showToast({
                title: '签收失败',
                icon: 'none'
              })
            }
          })
        }
      } else {
        wx.showToast({
          title: '查询补价单失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 点击签收
   */
  tapConfirmOrder: function() {
    let that = this;
    wx.showModal({
      title: '确认签收',
      content: '确认签收订单：' + this.data.orderNo,
      confirmText: "确认签收",
      cancelText: "暂不签收",
      success(res) {
        if (res.confirm) {
          that.requestRecieve(that.data.orderNo);
        }
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
    if (app.globalData.agreeTrasportCondition != null) {
      this.setData({
        conditionTwoAgreement: app.globalData.agreeTrasportCondition
      })
      app.globalData.agreeTrasportCondition = null;
    }
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
    console.log("/orderdetail/orderdetail 销毁")
    clearTimeout(this.data.backTimeIntervial);
    this.data.backTimeIntervial = null;
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

  /**
   * 点击图片
   */
  tapImage: function (e) {
    let tempOrder = this.data.orderData.orderStates[e.currentTarget.dataset.stepindex];
    let tempOrderImageList = [];
    for (let i = 0; i < tempOrder.pictureList.length; i++) {
      let tempOrderImage = tempOrder.pictureList[i];
      tempOrderImageList.push(tempOrderImage.viewAddress);
    }
    let currrentUrl = e.currentTarget.dataset.imageurl;
    wx.previewImage({
      urls: tempOrderImageList,
      current: currrentUrl
    })
  },

  /**
   * 请求订单详情
   */
  requestOrderDetail: function(orderNo) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_OrderDetail,
      data: {
        "orderNo": orderNo,
        "customerNo": loginUtil.getCustomerNo()
      },
      success(res) {
        wx.hideLoading();
        console.log("获取订单详情 success：\n" + JSON.stringify(res));
        if (res.data.data != null && res.data.code == config.RES_CODE_SUCCESS) {
          that.setData({
            orderData: res.data.data
          })
        } else {

        }
      },
      fail(res) {
        wx.hideLoading();
        console.log("获取订单详情 fail：\n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: "none"
        })
      },
      complete(res) {
        console.log("获取订单详情 complete：\n" + JSON.stringify(res));
      },

    })
  },

  /**
   * 提交备注输入
   */
  requestPostOrderRemark: function (remark) {
    let that = this;
    wx.showLoading({
      title: '请稍等',
    })
    wx.request({
      url: config.URL_Service + config.URL_PostOrderRemark,
      data: {
        order: {
          orderNo: this.data.orderData.orderNo
        },
        staff: loginUtil.getStaffInfo(),
        remarks: remark
      },
      method: 'POST',
      success(res) {
        wx.hideLoading();
        console.log("新增备注 success:\n" + JSON.stringify(res));
        if (res.data.code == config.RES_CODE_SUCCESS && res.data.data > 0) {
          wx.showToast({
            title: '新增成功',
          })
          if (that.data.orderData.orderRemarksList == null) {
            that.data.orderData.orderRemarksList = [];
          }
          that.data.orderData.orderRemarksList.push({remarks: remark})
          that.setData({
            orderData: that.data.orderData,
            remarksInput: null
          })
        } else {

          wx.showToast({
            title: '新增备注失败',
            icon: 'none'
          })
        }
      }, 
      fail(res) {
        wx.hideLoading();
        console.log("新增备注 fail:\n" + JSON.stringify(res));
        wx.showToast({
          title: '网络波动，新增备注失败',
          icon:'none'
        })
      },
      complete(res){
      }
    })
  },

  /**
   * 查询是否可以收货
   */
  requestCheckConfirm: function (orderNo, customerNo, getResultCallback) {
    wx.request({
      url: config.URL_Service + config.URL_CheckConfirm,
      data: {
        orderNo: orderNo,
        customerNo: customerNo
      },
      success(res) {
        if (res.data.code == config.RES_CODE_SUCCESS) {
          if (getResultCallback != null && typeof getResultCallback == 'function') {
            getResultCallback(res.data.data)
          }
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '系统异常',
          icon: 'none'
        })
      },
    })
  },

  /**
   * 确认输入
   */
  confirmRemarkInput: function(){
    if (util.checkEmpty(this.data.remarksInput)) {
      return;
    }
    this.requestPostOrderRemark(this.data.remarksInput);
  },

  /**
   * 获取输入
   */
  inputRemark: function(e){
    this.data.remarksInput = e.detail.value
  },

  /**
   * 拨打电话
   */
  callPhone: function(e) {
    let phoneNumber = e.currentTarget.dataset.phone;
    if (util.checkEmpty(phoneNumber)) {
      return;
    }
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
    })
  },

  /**
   * 点击提货地址
   */
  tapTakeAddress: function(e) {
    wx.openLocation({
      latitude: this.data.orderData.orderTakeDetail.latitude,
      longitude: this.data.orderData.orderTakeDetail.longitude,
    })
  },

  /**
   * 导航
   */
  tapToNavigation: function (e) {
    let targetAddress = e.currentTarget.dataset.address;
    if (util.checkEmpty(targetAddress)) {
      return;
    }
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: targetAddress, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //根据地址解析在地图上标记解析地址位置
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
        wx.hideLoading();
      }
    })
  },

  /**
   *  点击 支付 补价 
   */
  tapPayPremium: function (e) {
    let billNo = e.currentTarget.dataset.billno;
    this.requestPayPremium(billNo);
  },

  /**
   * 点击 取消 补价
   */
  tapCancelPremium: function(e) {
    let billNo = e.currentTarget.dataset.billno;
    this.requestCancelPremium(billNo);
  },

  /**
   * 请求取消 补价
   */
  requestCancelPremium: function(billNo) {
    wx.showLoading({
      title: '取消中',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_CancelPremium,
      data: billNo,
      method:"PUT",
      success(res) {
        wx.hideLoading();
        console.log("取消补价单 success:\n" + JSON.stringify(res));
        if (res.data.code != config.RES_CODE_SUCCESS){
          wx.showToast({
            title: '取消补价单失败',
            icon: 'none'
          })
        } else {
          that.requestOrderDetail(that.data.orderNo)
        }
      },
      fail(res) {
        wx.hideLoading();
        console.log("取消补价单 fail:\n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 请求支付
   */
  requestPayPremium: function(billNo) {
    let that = this;
    PayManager.payPremium(billNo, function(res) {
      that.requestOrderDetail(that.data.orderNo)
    }, function() {
      wx.showToast({
        title: '支付失败,请稍后重试',
        icon: 'none'
      })
    })
  },

  /**
   * 点击支付
   */
  tapPayOrder: function() {
    if (!this.data.conditionOneAgreement) {
      wx.showToast({
        title: '请确认宠物是否符合条件！',
        icon: 'none'
      })
      return;
    }
    if(!this.data.conditionTwoAgreement) {
      wx.showToast({
        title: '请查看并同意交易条款后支付！',
        icon: 'none'
      })
      return;
    }
    wx.navigateTo({
      url: PagePath.Path_Order_Pay_SubPay + "?amount=" + app.ShareData.payAmount + "&orderno=" + app.ShareData.payOrderNo + "&customerno=" + loginUtil.getCustomerNo(),
    })
  },

  /**
   * 点击条款
   */
  tapCondition: function(e){
    if (e.currentTarget.dataset.index == '0') {
      this.setData({
        conditionOneAgreement: !this.data.conditionOneAgreement
      })
    } else if (e.currentTarget.dataset.index == "1") {
      wx.navigateTo({
        url: PagePath.Path_Order_Text,
      })
    }
  }
})