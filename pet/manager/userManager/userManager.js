const config = require("../../utils/config")
const loginUtils = require("../../utils/loginUtils");
const util = require("../../utils/util");
const { RES_CODE_SUCCESS } = require("../../utils/config");

/**
 * 查询是否有商城新客大礼包
 * @param {boolean, object} callback 
 */
function checkHaveNewGiftBagOnPetMall(callback) {
  wx.request({
    url: config.URL_Service + config.URL_CheckHaveNewGiftBagOnPetMall,
    data: {
      customerNo: loginUtils.getCustomerNo()
    },
    success(res) {
      console.log(res);
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
      console.log(res);
      if (util.checkIsFunction(callback)) {
        callback(false, null);
      }
    }
  })
}

module.exports={
  checkHaveNewGiftBagOnPetMall
}