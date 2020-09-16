const { RES_CODE_SUCCESS } = require("../../utils/config.js");
const util = require("../../utils/util.js");
const loginUtils = require("../../utils/loginUtils.js");
const config = require("../../utils/config.js");
/**
 * 获取站点余额流水
 * @param {string} stationNo 站点编号
 * @param {number} offset 偏移量
 * @param {number} limit 页长
 * @param {function(boolean, object)} callback 回調
 */
function getStationBalanceFlow(stationNo, offset, limit, callback) {
  wx.request({
    url: config.URL_Service + config.URL_BalanceFlow_Station(stationNo, offset, limit),
    success(res){
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

/**
 * 获取商家余额流水
 * @param {string} businessNo 站点编号
 * @param {number} offset 偏移量
 * @param {number} limit 页长
 * @param {function(boolean, object)} callback 回調
 */
function getBusinessBalanceFlow(businessNo, offset, limit, callback) {
  wx.request({
    url: config.URL_Service + config.URL_BalanceFlow_Business(businessNo, offset, limit),
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

/**
 * 获取余额
 * @param {function(boolean, object)} callback 回调
 */
function getBalance(callback) {
  wx.request({
    url: config.URL_Service + config.URL_CheckBalance,
    data: {
      customerNo: loginUtils.getCustomerNo()
    },
    success(res){
      console.log("查询余额 success => \n" + JSON.stringify(res));
      if (res.data.code == RES_CODE_SUCCESS){
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

module.exports={
  getStationBalanceFlow,
  getBusinessBalanceFlow,
  getBalance,
}