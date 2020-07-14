const LoginUtil = require('../../utils/loginUtils');
const Config = require('../../utils/config');
const Utils = require('../../utils/util');

/**
 * 订单支付
 * @param {String} orderNo 订单编号
 * @param {Function} paySuccessCallback 支付成功 
 * @param {Function} payFailCallback 支付失败
 */
function payOrder(orderNo, paySuccessCallback, payFailCallback) {
  wx.showLoading({
    title: '支付中...',
  })
  wx.request({
    url: Config.URL_Service + Config.URL_Payment,
    data: {
      orderNo: orderNo,
      customerNo: LoginUtil.getCustomerNo(),
      appType: LoginUtil.getAppType(),
    },
    success(res) {
      wx.hideLoading();
      console.log("支付 success：\n" + JSON.stringify(res));
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: res.data.data.package,
        signType: res.data.data.signType,
        paySign: res.data.data.paySign,
        success(res){
          if (Utils.checkIsFunction(paySuccessCallback)) {
            paySuccessCallback(res);
          }
        },
        fail(res){
          if (Utils.checkIsFunction(payFailCallback)) {
            payFailCallback(res);
          }
        }
      })
    },
    fail(res) {
      wx.hideLoading();
      if (Utils.checkIsFunction(payFailCallback)) {
        payFailCallback(res);
      }
    }
  })
} 

/**
 * 充值支付
 * @param {String} rechargeAmount 充值金额
 * @param {Function} paySuccessCallback 支付成功 
 * @param {Function} payFailCallback 支付失败
 */
function payRecharge(rechargeAmount, paySuccessCallback, payFailCallback) {
  wx.showLoading({
    title: '支付中...',
  })
  wx.request({
    url: Config.URL_Service + Config.URL_Recharge,
    data: {
      customerNo: LoginUtil.getCustomerNo(),
      rechargeAmount: rechargeAmount,
      appType: LoginUtil.getAppType()
    },
    success(res) {
      wx.hideLoading();
      console.log("充值 success => \n" + JSON.stringify(res))
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: res.data.data.package,
        signType: res.data.data.signType,
        paySign: res.data.data.paySign,
        success(res){
          if (Utils.checkIsFunction(paySuccessCallback)) {
            paySuccessCallback(res);
          }
        },
        fail(res){
          if (Utils.checkIsFunction(payFailCallback)) {
            payFailCallback(res);
          }
        }
      })
    },
    fail(res) {
      wx.hideLoading();
      if (Utils.checkIsFunction(payFailCallback)) {
        payFailCallback(res);
      }
    }
  })
}

/**
 * 补价支付
 * @param {String} billNo 充值金额
 * @param {Function} paySuccessCallback 支付成功 
 * @param {Function} payFailCallback 支付失败
 */
function payPremium(billNo, paySuccessCallback, payFailCallback){
  wx.showLoading({
    title: '支付中...',
  })
  let that = this;
  wx.request({
    url: Config.URL_Service + Config.URL_PayPremium,
    data: {
      billNo: billNo,
      customerNo: LoginUtil.getCustomerNo(),
      appType: LoginUtil.getAppType()
    },
    success(res) {
      wx.hideLoading();
      console.log("支付补价 success: \n" + JSON.stringify(res));
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: res.data.data.package,
        signType: res.data.data.signType,
        paySign: res.data.data.paySign,
        success(res){
          if (Utils.checkIsFunction(paySuccessCallback)) {
            paySuccessCallback(res);
          }
        },
        fail(res){
          if (Utils.checkIsFunction(payFailCallback)) {
            payFailCallback(res);
          }
        }
      })
    },
    fail(res) {
      wx.hideLoading();
      if (Utils.checkIsFunction(payFailCallback)) {
        payFailCallback(res);
      }
    },
  })
}

module.exports = {
  payOrder,
  payRecharge,
  payPremium,
}