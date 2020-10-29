const config = require("../../utils/config")
const loginUtils = require("../../utils/loginUtils");
const util = require("../../utils/util");
const { RES_CODE_SUCCESS } = require("../../utils/config");

/**
 * 查询是否有商城新客大礼包
 * @param {function(boolean, object)} callback 
 */
function checkHaveNewGiftBagOnPetMall(callback) {
  wx.request({
    url: config.URL_Service + config.URL_CheckHaveNewGiftBagOnPetMall,
    data: {
      customerNo: loginUtils.getCustomerNo()
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
        callback(false, res);
      }
    }
  })
}

/**
 * 完善商家信息
 * @param {object} param 商家信息
 * @param {function(boolean, object)} callback 回调
 */
function completionInfo(param, callback) {
  wx.request({
    url: config.URL_Service + config.URL_CompletionBusinessInfo,
    data: param,
    method: "POST",
    success(res) {
      util.printLog("completionInfo", res);
      if (res.data.code == RES_CODE_SUCCESS) {
       if (util.checkIsFunction(callback)) {
          callback(true);
       } 
      } else {
        if (util.checkIsFunction(callback)) {
          callback(false, "提交错误");
        }
      }
    },
    fail(res) {
      util.printLog("completionInfo", res);
      if (util.checkIsFunction(callback)) {
        callback(false, "提交失败")
      }
    }
  })
}

/**
 * 获取商家认证信息
 * @param {function(boolean, object)} callback 回调
 */
function getBusinessAuthInfo(callback) {
  wx.request({
    url: config.URL_Service + config.URL_GetBusinessAuthInfo(loginUtils.getBusinessNo()),
    method: "GET",
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS) {
        if (util.checkIsFunction(callback)) {
          callback(true, res.data.data);
        }
      } else {
        if (util.checkIsFunction(callback)) {
          callback(false, '获取认证信息错误');
        }
      }
    },
    fail(res) {
      if (util.checkIsFunction(callback)) {
        callback(false, '获取认证信息失败');
      }
    }
  })
}

/**
 * 认证商家
 * @param {object} param 请求参数
 * @param {function(boolean, object)} callback 回调
 */
function authBusiness(param, callback) {
  wx.request({
    url: config.URL_Service + config.URL_AuthBusiness,
    data: param,
    method: "POST",
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS){
        if (util.checkIsFunction(callback)) {
          callback(true, res.data.data);
        }
      } else {
        if (util.checkIsFunction(callback)) {
          callback(false, "认证错误");
        }
      }
    },
    fail(res) {
      if (util.checkIsFunction(callback)) {
        callback(false, "认证失败");
      }
    }
  })
}

module.exports={
  checkHaveNewGiftBagOnPetMall,
  completionInfo,
  getBusinessAuthInfo,
  authBusiness,
}