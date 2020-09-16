const config = require("../../utils/config");
const loginUtils = require("../../utils/loginUtils");
const { RES_CODE_SUCCESS } = require("../../utils/config");
const util = require("../../utils/util");

/**
 * 获取优惠券列表
 * @param {function(boolean, object)} callback 回调
 */
function getCouponList(callback) {
  wx.request({
    url: config.URL_Service + config.URL_GetCouponList,
    data: {
      openId: loginUtils.getOpenId()
    },
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

module.exports = {
  getCouponList, // 获取优惠券列表
}