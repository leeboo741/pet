
const config = require("../../utils/config");
const loginUtils = require("../../utils/loginUtils");
const util = require("../../utils/util");
const { RES_CODE_SUCCESS } = require("../../utils/config");

/**
 * 站点提现
 * @param {number} amount 
 * @param {function(boolean, object)} callback 
 */
function stationWithdraw(amount, callback) {
  wx.request({
    url: config.URL_Service + config.URL_Withdraw_Station,
    data: {
      customerNo: loginUtils.getCustomerNo(),
      amount: amount
    },
    header: {'content-type': 'application/x-www-form-urlencoded'},
    method: "POST", // 请求方式
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS && res.data.data > 0) {
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
 * 商家提现
 * @param {number} amount 
 * @param {function(boolean, object)} callback 
 */
function businessWithdraw(amount, callback) {
  wx.request({
    url: config.URL_Service + config.URL_Withdraw_Business,
    data: {
      businessNo: loginUtils.getBusinessNo(),
      amount: amount
    },
    header: {'content-type': 'application/x-www-form-urlencoded'},
    method: "POST", // 请求方式
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS && res.data.data > 0) {
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
 * 站点提现流水
 * @param {number} offset 
 * @param {number} limit 
 * @param {function(boolean, object)} callback 
 */
function getStationWithdrawFlow(offset, limit, callback) {
  wx.request({
    url: config.URL_Service + config.URL_WithdrawFlow_Station,
    data: {
      stationNo: loginUtils.getStationNo(),
      offset: offset,
      limit: limit
    },
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS) {
        if (util.checkIsFunction(callback)) {
          callback(true, res.data.data);
        }
      } else {
        if (util.checkIsFunction(callback)) {
          callback(false, res)
        }
      }
    },
    fail(res) {
      if (util.checkIsFunction(callback)) {
        callback(false, res)
      }
    }
  })
}

/**
 * 商家提现流水
 * @param {number} offset 
 * @param {number} limit 
 * @param {function(boolean, object)} callback 
 */
function getBusinessWithdrawFlow(offset, limit, callback) {
  wx.request({
    url: config.URL_Service + config.URL_WithdrawFlow_Business,
    data: {
      businessNo: loginUtils.getBusinessNo(),
      offset: offset,
      limit: limit
    },
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS) {
        if (util.checkIsFunction(callback)) {
          callback(true, res.data.data);
        }
      } else {
        if (util.checkIsFunction(callback)) {
          callback(false, res)
        }
      }
    },
    fail(res) {
      if (util.checkIsFunction(callback)) {
        callback(false, res)
      }
    }
  })
}

module.exports = {
  stationWithdraw,
  businessWithdraw,
  getStationWithdrawFlow,
  getBusinessWithdrawFlow,
}