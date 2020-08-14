const config = require("../../utils/config");
const util = require("../../utils/util");
const loginUtils = require("../../utils/loginUtils");

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
      console.log("未支付补价单数量 sucess: \n" + JSON.stringify(res));
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
        callback(false, null);
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
        callback(false, null);
      }
    }
  })
}

module.exports = {
  checkUnpayPremiumCount, // 检查 未支付 补价单数量
  confirmOrderReceiving, // 确认收货
}