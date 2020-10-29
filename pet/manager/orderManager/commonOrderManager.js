const config = require("../../utils/config");
const util = require("../../utils/util");
const loginUtils = require("../../utils/loginUtils");
const { RES_CODE_SUCCESS } = require("../../utils/config");

/**
 * 检查 未支付 补价单数量
 * @param {string} orderNo 
 * @param {boolean, object} callback 
 */
function checkUnpayPremiumCount(orderNo, callback) {
  wx.request({
    url: config.URL_Service + config.URL_UnPayPremiumCount,
    data: {
      orderNo: orderNo
    },
    success(res) {
      if (res.data.code == config.RES_CODE_SUCCESS) {
        if (util.checkIsFunction(callback)) {
          callback(true, res.data.data);
        }
      } else {
        if (util.checkIsFunction(callback)) {
          callback(false, res);
        }
      }
    },
    fail(res) {
      if (util.checkIsFunction(callback)) {
        callback(false, res);
      }
    }
  })
}

/**
 * 确认收货
 * @param {string} orderNo 
 * @param {array} fileList 
 * @param {boolean, object} callback 
 */
function confirmOrderReceiving(orderNo, fileList, callback) {
  let data = {
    orderNo: orderNo,
    customerNo: loginUtils.getCustomerNo()
  };
  if (util.checkEmpty(fileList)) {
    data.fileList = fileList;
  }
  wx.request({
    url: config.URL_Service + config.URL_ConfirmOrder,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: "POST", // 请求方式
    data: data,
    success(res) {
      if (res.data.code == config.RES_CODE_SUCCESS) {
        if (util.checkIsFunction(callback)) {
          callback(true, res.data.data);
        }
      } else {
        if (util.checkIsFunction(callback)) {
          callback(false, res);
        }
      }
    },
    fail(res) {
      if (util.checkIsFunction(callback)) {
        callback(false, res);
      }
    }
  })
}

/**
 * 获取订单详情
 * @param {string} orderNo 订单编号
 * @param {function(boolean, object)} callback 回调
 */
function getOrderInfo(orderNo, callback) {
  wx.request({
    url: config.URL_Service + config.URL_OrderInfo(orderNo),
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS) {
        if (util.checkIsFunction(callback)) {
          callback(true, res.data.data);
        }
      } else {
        if (util.checkIsFunction(callback)) {
          callback(false, res);
        }
      }
    },
    fail(res) {
      if (util.checkIsFunction(callback)) {
        callback(false, res);
      }
    },
  })
}

/**
 * 订单详情
 * @param {string} orderNo 订单编号
 * @param {function(boolean, object)} callback 回调
 */
function getOrderDetail(orderNo, callback) {
  wx.request({
    url: config.URL_Service + config.URL_OrderDetail,
    data: {
      "orderNo": orderNo,
      "customerNo": loginUtils.getCustomerNo()
    },
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS) {
        if (util.checkIsFunction(callback)) {
          callback(true, res.data.data);
        }
      } else {
        if (util.checkIsFunction(callback)) {
          callback(false, res);
        }
      }
    },
    fail(res) {
      if (util.checkIsFunction(callback)) {
        callback(false, res);
      }
    }
  })
}

module.exports = {
  checkUnpayPremiumCount, // 检查 未支付 补价单数量
  confirmOrderReceiving, // 确认收货
  getOrderInfo, // 获取订单详情
  getOrderDetail, // 获取订单详情
}