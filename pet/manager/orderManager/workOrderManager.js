const config = require("../../utils/config")
const loginUtils = require("../../utils/loginUtils")
const { RES_CODE_SUCCESS } = require("../../utils/config")
const util = require("../../utils/util")

/**
 * 删除订单
 * @param {string} orderNo 
 * @param {function(boolean, object)} callback 
 */
function deleteOrder(orderNo, callback) {
  wx.request({
    url: config.URL_Service + config.URL_DeleteOrder + '?orderNo=' + orderNo + '&customerNo=' + loginUtils.getCustomerNo(),
    method:'DELETE',
    header: {'content-type': 'application/x-www-form-urlencoded'},
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS && res.data.data == true) {
        if (util.checkIsFunction(callback)) {
          callback(true, res.data.data);
        }
      } else {
        if (util.checkIsFunction(callback)) {
          callback(false, res);
        }
      }
    },
    fail(res){
      if (util.checkIsFunction(callback)) {
        callback(false, null);
      }
    }
  })
}

module.exports={
  deleteOrder,
}