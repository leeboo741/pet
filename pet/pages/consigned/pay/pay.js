/**
 * ******** 邮寄信息页面 ********
 * ===================================================================================================================================
 * 在这个页面完成 输入寄宠人信息，收宠人信息
 * 预订之后直接付款===================================================================================================================================
 */

const app = getApp();
const config = require("../../../utils/config.js");
const loginUtil = require("../../../utils/loginUtils.js");
const pagePath = require("../../../utils/pagePath.js");
const ShareUtil = require("../../../utils/shareUtils.js");
const Util = require("../../../utils/util.js");
const PayManager = require("../../../manager/payManager/payManager");

const Pay_Price_Type_Customer = 0; // 价格类型 - 预估价格
const Pay_Price_Type_Business = 1; // 价格类型 - 合作价格
const Pay_Price_Type_Other = 2; // 价格类型 - 自定义价

Page({

  /**
   * 页面的初始数据
   */
  data: {

    userInfo: null,

    storePhone: null, // 获取商家电话

    predictPrice: null, // 预估金额
    confirmCondition: false, // 确认条件
    confirmClause: false, // 确认条款

    sendName: '', // 寄件人名称
    receiveName: '', // 收件人名称
    sendPhone: '', // 寄件人电话
    receivePhone: '', // 收件人电话

    recommenderName: '', //  推荐人名称
    recommenderPhone: '', // 推荐人电话

    payPriceTypeList: [
      {
        name: '预估价格',
        typeId: Pay_Price_Type_Customer,
      },
      {
        name: '合作价格',
        typeId: Pay_Price_Type_Business,
      },
      {
        name: '自定义价格',
        typeId: Pay_Price_Type_Other,
      },
    ], // 付款价格类型列表
    payPriceType: null, // 付款价格类型
    otherPrice:null, // 自定义价格

    remark: "", // 订单备注

    startCity: null, // 始发城市
    endCity: null, // 目的城市
    leaveDate: null, // 发货日期
    transport: null, // 运输方式
    petWeight: 0, // 重量
    petCount: 0, // 数量
    petType: null, // 宠物类型
    petClassify: null, // 宠物种类
    petAge: null, // 宠物年龄

    airbox: null, // 购买航空箱
    receiveAddress: null, // 接宠地址
    receiveLatitude: null, // 接宠纬度
    receiveLongitude: null, // 接宠经度
    sendAddress: null, // 送宠地址
    sendLatitude: null, // 送宠纬度
    sendLongitude: null, // 送宠经度
    insuredPrice: null, // 保价金额
    petCan: null, // 免费营养罐头
    guarantee: null, // 中介担保

    orderNo: null, // 订单编号
  },

  /* ============================= 页面生命周期 Start ============================== */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: loginUtil.getUserInfo(),
      startCity: options.start,
      endCity: options.end,
      petCount: parseInt(options.count),
      petType: options.type,
      petClassify: options.classify,
      petWeight: parseFloat(options.weight),
      transport: options.transport,
      leaveDate: options.leavedate,
      petAge: options.age,
      payPriceType: this.data.payPriceTypeList[0],
    })
    if (options.petcan != null) {
      this.setData({
        petCan: options.petcan
      })
    }
    if (options.guarantee != null) {
      this.setData({
        guarantee: options.guarantee
      })
    }
    if (options.airbox != null) {
      this.setData({
        airbox: options.airbox
      })
    }
    if (options.receiveaddress != null) {
      this.setData({
        receiveAddress: options.receiveaddress,
        receiveLatitude: options.receivelatitude,
        receiveLongitude: options.receivelongitude
      })
    }
    if (options.sendaddress != null) {
      this.setData({
        sendAddress: options.sendaddress,
        sendLatitude: options.sendlatitude,
        sendLongitude: options.sendlongitude
      })
    }
    if (options.insuredprice != null) {
      this.setData({
        insuredPrice: parseFloat(options.insuredprice)
      })
    }
    this.predictPrice();
    this.requestStroePhoneByCityName(this.data.startCity)
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
    console.log("/pay/pay 销毁")
  },

  /* ============================= 页面生命周期 End ============================== */

  /* ============================= 页面事件 Start ============================== */
  /**
   * 输入推荐人名称
   */
  inputRecommenderName: function(e) {
    this.data.recommenderName = e.detail.value;
  },
  /**
   * 输入推荐人电话
   */
  inputRecommenderPhone: function(e) {
    this.data.recommenderPhone = e.detail.value;
  },
  /**
   * 输入自定义价格
   */
  inputCustomPrice: function(e) {
    this.data.otherPrice = e.detail.value;
  },
  /**
   * 支付价格类型选择
   */
  selectedPriceTypeAction: function(e){
    let priceType = this.data.payPriceTypeList[e.currentTarget.dataset.index];
    if (priceType.typeId === this.data.payPriceType.typeId) {
      return;
    }
    if (priceType.typeId != Pay_Price_Type_Other) {
      this.setData({
        otherPrice: null
      })
    }
    this.setData({
      payPriceType: priceType
    })
  },
  /**
   * 订单备注输入
   */
  remarkInput: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 寄宠人姓名
   */
  inputSendName: function (e) {
    this.setData({
      sendName: e.detail.value,
    })
  },

  /**
   * 寄宠人电话
   */
  phoneNumberInput: function (e) {
    this.setData({
      sendPhone: e.detail.value,
    })
  },

  /**
   * 收宠人姓名
   */
  inputReceiveName: function (e) {
    this.setData({
      receiveName: e.detail.value,
    })
  },

  /**
   * 收宠人电话
   */
  inputReceivePhone: function (e) {
    this.setData({
      receivePhone: e.detail.value,
    })
  },

  /**
   * 下单
   */
  order: function () {
    if (this.data.sendName == null || this.data.sendName.length <= 0) {
      wx.showToast({
        title: '请输入寄宠人名称',
        icon: 'none'
      })
      return;
    }

    if (this.data.receiveName == null || this.data.receiveName.length <= 0) {
      wx.showToast({
        title: '请输入收宠人名称',
        icon: 'none'
      })
      return;
    }

    if (this.data.sendPhone == null || this.data.sendPhone.length <=0 || !Util.isPhoneAvailable(this.data.sendPhone)) {
      wx.showToast({
        title: '请输入正确的寄宠人手机号',
        icon: 'none'
      })
      return;
    }

    if (this.data.receivePhone == null || this.data.receivePhone.length <= 0 || !Util.isPhoneAvailable(this.data.receivePhone)) {
      wx.showToast({
        title: '请输入正确的收宠人手机号',
        icon: 'none'
      })
      return;
    }

    if (!this.data.confirmCondition) {
      wx.showToast({
        title: '请确认宠物是否符合条件！',
        icon: 'none'
      })
      return;
    }

    if (!this.data.confirmClause) {
      wx.showToast({
        title: '请查看并同意交易条款后下单！',
        icon: 'none'
      })
      return;
    }
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      
      if (state) {
        that.requestOrder(); 
      } else {
        wx.showModal({
          title: '暂未登录',
          content: '请先登录后下单',
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
   * 确认条件
   */
  tapCondition: function () {
    this.setData({
      confirmCondition: !this.data.confirmCondition
    })
  },

  /**
   * 确认条款
   */
  // tapClause: function() {
  //   this.setData({
  //     confirmClause: !this.data.confirmClause
  //   })
  // },

  /**
   * 查看条款
   */
  checkClauseDetail: function () {
    wx.navigateTo({
      url: pagePath.Path_Order_Text,
    })
  },

  /**
   * 拨打电话
   */
  tapServicePhoneAction: function () {
    let tempPhone = config.Service_Phone;
    if (this.data.storePhone != null) {
      tempPhone = this.data.storePhone;
    }
    wx.makePhoneCall({
      phoneNumber: tempPhone,
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

  /* ============================= 页面事件 End ============================== */

  /* ============================= 网络请求 Start ============================== */

  /**
   * 下单
   */
  requestOrder: function () {
    wx.showLoading({
      title: '提交订单中...',
    })
    let tempOrderObj = {
      "customerNo": loginUtil.getCustomerNo(),

      "startCity": this.data.startCity,
      "endCity": this.data.endCity,
      "leaveDate": this.data.leaveDate,
      "transportType": this.data.transport,
      "weight": this.data.petWeight,
      "num": this.data.petCount,
      "petClassify": this.data.petClassify,
      "petType": this.data.petType,
      "petAge": this.data.petAge,

      "receiverName": this.data.receiveName,
      "receiverPhone": this.data.receivePhone,
      "senderName": this.data.sendName,
      "senderPhone": this.data.sendPhone,

      "remarks": this.data.remark,

      "payAmountType" : this.data.payPriceType.typeId,
      "recommendName" : this.data.recommenderName,
      "recommendPhone" : this.data.recommenderPhone,
    }

    if (!Util.checkEmpty(this.data.otherPrice)) {
      tempOrderObj.customPrice = this.data.otherPrice;
    }

    tempOrderObj.shareOpenId = "";
    if (!Util.checkEmpty(app.ShareData.openId)) {
      tempOrderObj.shareOpenId = app.ShareData.openId;
    }

    tempOrderObj.buyPetCage = "0";
    if (this.data.airbox != null) {
      tempOrderObj.buyPetCage = this.data.airbox;
    }

    tempOrderObj.giveFood = "0";
    if (this.data.petCan != null) {
      tempOrderObj.giveFood = this.data.petCan;
    }

    tempOrderObj.guarantee = "0";
    if (this.data.guarantee != null) {
      tempOrderObj.guarantee = this.data.guarantee;
    }

    tempOrderObj.receiptAddress = "";
    tempOrderObj.receiptLongitude = "";
    tempOrderObj.receiptLatitude = "";
    if (this.data.receiveAddress != null) {
      tempOrderObj.receiptAddress = this.data.receiveAddress;
      tempOrderObj.receiptLongitude = this.data.receiveLongitude;
      tempOrderObj.receiptLatitude = this.data.receiveLatitude;
    }

    tempOrderObj.sendAddress = "";
    tempOrderObj.sendLatitude = "";
    tempOrderObj.sendLongitude = "";
    if (this.data.sendAddress != null) {
      tempOrderObj.sendAddress = this.data.sendAddress;
      tempOrderObj.sendLongitude = this.data.sendLongitude;
      tempOrderObj.sendLatitude = this.data.sendLatitude;
    } 

    tempOrderObj.petAmount = 0;
    if (this.data.insuredPrice != null) {
      tempOrderObj.petAmount = this.data.insuredPrice;
    }

    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_Order,
      method: "POST",
      data: tempOrderObj,
      success(res) {
        console.log("提交订单 success => \n" + JSON.stringify(res));
        wx.hideLoading();
        if (res.data.code == config.RES_CODE_SUCCESS) {
          that.setData({
            orderNo: res.data.data
          })
          let tempOrderNo = res.data.data;
          wx.showModal({
            title: '订单:' + res.data.data + '提交成功',
            content: '是否立即支付',
            cancelText: '稍后支付',
            confirmText: '立即付款',
            success(res) {
              if (res.confirm) {
                console.log('用户点击立即付款')
                loginUtil.checkLogin(function alreadyLoginCallback(state) {
                  if (state) {
                    that.requestPay(tempOrderNo);
                  } else {
                    wx.showModal({
                      title: '暂未登录',
                      content: '请先登录后付款',
                      success(res) {
                        if (res.confirm) {
                          loginUtil.login();
                        }
                      }
                    })
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击稍后支付')
                wx.switchTab({
                  url: pagePath.Path_Home,
                })
              }
            }
          })
        } else {
          if (res.data.message != null) {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: "提交订单失败，请稍后再试",
              icon: 'none'
            })
          }
        }
      },
      fail(res) {
        wx.hideLoading();
        console.log("提交订单 fail => \n" + JSON.stringify(res));
        wx.showToast({
          title: '提交订单失败，请稍后再试',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("提交订单 complete => \n" + JSON.stringify(res));
      },
    })
  },

  /**
   * 支付
   */
  requestPay: function(orderNo){
    let price = 0;
    if (this.data.payPriceType.typeId === Pay_Price_Type_Customer) {
      price = this.data.predictPrice.retailOrderAmount;
    } else if (this.data.payPriceType.typeId === Pay_Price_Type_Business) {
      price = this.data.predictPrice.joinOrderAmount;
    } else {
      price = this.data.otherPrice;
    }
    wx.navigateTo({
      url: pagePath.Path_Order_Pay_SubPay + "?amount=" + price + "&orderno=" + orderNo + "&customerno=" + loginUtil.getCustomerNo(),
    })
  },

  /**
   * 查询预估金额
   */
  requestPredictPrice: function () {
    wx.showLoading({
      title: '请稍等...',
    })
    let tempData = {
      "customerNo": loginUtil.getCustomerNo(),
      "startCity": this.data.startCity,
      "endCity": this.data.endCity,
      "transportType": this.data.transport,
      "weight": this.data.petWeight,
      "num": this.data.petCount,

      "leaveDate": this.data.leaveDate,
      "petClassify": this.data.petClassify,
      "petAge": this.data.petAge,
      "petType": this.data.petType,
      "receiverName": "",
      "receiverPhone": "",
      "senderName": "",
      "senderPhone": "",
      "remarks": "",
    };

    if (this.data.sendAddress != null) {
      tempData.sendAddress = this.data.sendAddress;
    }

    if (this.data.receiveAddress != null) {
      tempData.receiptAddress = this.data.receiveAddress;
    }

    if (this.data.airbox != null) {
      tempData.buyPetCage = this.data.airbox
    }

    if (this.data.insuredPrice != null) {
      tempData.petAmount = this.data.insuredPrice;
    }

    if (this.data.petCan != null) {
      tempData.giveFood = this.data.petCan;
    }

    if (this.data.guarantee != null) {
      tempData.guarantee = this.data.guarantee;
    }

    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_PredictPrice,
      data: tempData,
      method: "POST",
      success(res) {
        wx.hideLoading();
        console.log("获取预估价格 success => \n" + JSON.stringify(res));
        if (res.data.code == config.RES_CODE_SUCCESS) {
          that.setData({
            predictPrice: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.hideLoading();
        console.log("获取预估价格 fail => \n" + JSON.stringify(res));
        wx.showToast({
          title: '获取预估价格失败',
          icon: 'none'
        })
      },
      complete(res) {
      },
    })
  },

  /**
   * 请求商家电话
   */
  requestStroePhoneByCityName: function (cityName) {
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_GetStorePhoneByCityName,
      data: {
        cityName: cityName
      },
      success(res) {
        console.log("获取商家电话 城市（" + cityName + "） success => \n" + JSON.stringify(res));
        that.setData({
          storePhone: res.data.data
        })
      },
      fail(res) {
        console.log("获取商家电话 城市（" + cityName + "） fail => \n" + JSON.stringify(res));
        wx.showToast({
          title: '网络原因，获取客服电话失败',
          icon: 'none'
        })
      },
      complete(res) {
        console.log("获取商家电话 城市（" + cityName + "） complete => \n" + JSON.stringify(res));
      },
    })
  },

  /* ============================= 网络请求 End ============================== */

  /* ============================= 数据处理 Start ============================== */

  /**
   * 计算预估金额
   */
  predictPrice: function () {
    if (this.data.startCity== null) {
      return;
    }
    if (this.data.endCity == null) {
      return;
    }
    if (this.data.petCount == 0) {
      return;
    }
    if (this.data.petWeight == 0) {
      return;
    }
    if (this.data.transport == null) {
      return;
    }
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.requestPredictPrice();
      } else {
        wx.showModal({
          title: '暂未登录',
          content: '请先登录后才能获取预估价格',
          success(res) {
            if (res.confirm) {
              loginUtil.login();
            }
          }
        })
      }
    })
  },

  /* ============================= 数据处理 End ============================== */

})