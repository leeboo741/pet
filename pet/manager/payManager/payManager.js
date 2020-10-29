const LoginUtil = require('../../utils/loginUtils');
const Config = require('../../utils/config');
const Utils = require('../../utils/util');
const loginUtils = require('../../utils/loginUtils');

/**
 * 支付代支付订单
 * @param {String} orderNo 
 * @param {String} customerNo 
 * @param {Function} paySuccessCallback 
 * @param {Function} payFailCallback 
 */
function payOtherOrder(orderNo, customerNo,paySuccessCallback, payFailCallback ) {
  wx.showLoading({
    title: '支付中...',
  })
  wx.request({
    url: Config.URL_Service + Config.URL_OtherPay,
    data: {
      orderNo: orderNo,
      customerNo: customerNo,
      appType: LoginUtil.getAppType(),
    },
    success(res) {
      wx.hideLoading();
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
 * 订单支付
 * @param {String} orderNo 订单编号
 * @param {Function} paySuccessCallback 支付成功 
 * @param {Function} payFailCallback 支付失败
 */
function payOrder(orderNo,customerNo, paySuccessCallback, payFailCallback) {
  wx.showLoading({
    title: '支付中...',
  })
  wx.request({
    url: Config.URL_Service + Config.URL_Payment,
    data: {
      orderNo: orderNo,
      customerNo: customerNo,
      appType: LoginUtil.getAppType(),
    },
    success(res) {
      wx.hideLoading();
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

/**
 * 完成支付操作
 * @param {*} orderNo 
 * @param {*} paySuccessCallback 
 * @param {*} payFailCallback 
 */
function completePay(orderNo, paySuccessCallback, payFailCallback) {
  wx.request({
    url: Config.URL_Service + Config.URL_CompletePay,
    data: {
      orderNo: orderNo,
      customerNo: loginUtils.getCustomerNo()
    },
    success(res) {
      if (Utils.checkIsFunction(paySuccessCallback)) {
        paySuccessCallback(res.data);
      }
    },
    fail(res) {
      if (Utils.checkIsFunction(payFailCallback)) {
        payFailCallback(res);
      }
    }
  })
}

/**
 * 审核付款凭证
 * @param {string} orderNo 订单编号
 * @param {boolean} result 是否审核通过
 * @param {string} feedback 反馈
 * @param {function} successCallback 成功回调
 * @param {function} failCallback 失败回调
 */
function verifyPaymentVoucher(orderNo, result, feedback, successCallback, failCallback) {
  wx.request({
    url: Config.URL_Service + Config.URL_Verify_PaymentVoucher,
    data: {
      orderNo: orderNo,
      result: result,
      feedback: feedback
    },
    success(res) {
      if (Utils.checkIsFunction(successCallback)) {
        successCallback(res.data)
      }
    },
    fail(res) {
      if (Utils.checkIsFunction(failCallback)) {
        failCallback(res);
      }
    }
  })
}

module.exports = {
  payOtherOrder,
  payOrder,
  payRecharge,
  payPremium,
  completePay,
  verifyPaymentVoucher,
}