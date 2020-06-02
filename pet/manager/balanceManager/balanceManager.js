const UrlPath = require("../../utils/config.js");
const Utils = require("../../utils/util.js");
/**
 * 获取站点余额流水
 * @param stationNo
 * @param offset
 * @param limit
 * @param getFlowCallback
 * @param failCallback
 */
function getStationBalanceFlow(stationNo, offset, limit, getFlowCallback, failCallback) {
  wx.request({
    url: UrlPath.URL_Service + UrlPath.URL_BalanceFlow_Station(stationNo, offset, limit),
    success(res){
      if (Utils.checkIsFunction(getFlowCallback)) {
        getFlowCallback(res);
      }
    },
    fail(res) {
      if (Utils.checkIsFunction(failCallback)) {
        failCallback(res);
      }
    }
  })
}

/**
 * 获取商家余额流水
 * @param stationNo
 * @param offset
 * @param limit
 * @param getFlowCallback
 * @param failCallback
 */
function getBusinessBalanceFlow(businessNo, offset, limit, getFlowCallback, failCallback) {
  wx.request({
    url: UrlPath.URL_Service + UrlPath.URL_BalanceFlow_Business(businessNo, offset, limit),
    success(res) {
      if (Utils.checkIsFunction(getFlowCallback)) {
        getFlowCallback(res);
      }
    },
    fail(res) {
      if (Utils.checkIsFunction(failCallback)) {
        failCallback(res);
      }
    }
  })
}

module.exports={
  getStationBalanceFlow: getStationBalanceFlow,
  getBusinessBalanceFlow: getBusinessBalanceFlow
}