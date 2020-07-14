const LoginUtil = require("../utils/loginUtils.js");
const PagePath = require("../utils/pagePath.js");
const app = getApp();
const Util = require("../utils/util.js");

/**
 * 分享 代支付
 * @param {*} orderNo 
 * @param {*} amount 
 * @param {*} qrcodePath 
 */
function shareToOtherPay(orderNo, amount, qrcodePath){
  let tempPath = PagePath.Path_Home + '?type=sharetopay' + '&orderno=' + orderNo + '&amount=' + amount + '&customerno=' + LoginUtil.getCustomerNo();
  return {
    title: "请你帮忙支付一下",
    path: tempPath,
    imageUrl: qrcodePath,
  }
}

/**
 * 分享 微信小程序
 */
function getOnShareAppMessageForShareOpenId(){
  let tempPath = PagePath.Path_Home + '?shareopenid=' + LoginUtil.getOpenId() + '&type=share';
  if (LoginUtil.getStationNo() != null) {
    tempPath = tempPath + "&stationno=" + LoginUtil.getStationNo();
  }
  if (LoginUtil.getBusinessNo() != null) {
    tempPath = tempPath + "&businessno=" + LoginUtil.getBusinessNo();
  }
  return {
    title: "淘宠惠宠物一站式服务中心",
    path: tempPath,
    success: function (res) {
      // 转发成功
      // 2018.10.10号之后不允许获知用户分享状态，所以，这个回调没用了
    },
    fail: function (res) {
      // 转发失败
      // 2018.10.10号之后不允许获知用户分享状态，所以，这个回调没用了
    }
  }
}

/**
 * 获取 分享 微信小程序 传递的 openId
 * @param options 页面load 时 参数
 */
function getOpenIdInShareMessage(options) {
  let shareOpenId = options.shareopenid;
  if (shareOpenId != null) {
    app.ShareData.openId = shareOpenId;
    console.log("ShareOpenId:\n" + app.ShareData.openId);
  }
}

/**
 * 通过连接进入，通过分享进入时获取分享信息
 * @param options 
 * @param getResultCallback
 */
function getAppOpenData(options, getResultCallback) {
  console.log("options :\n" + JSON.stringify(options));
  let type = options.type;
  if (type == null) {
    console.log("options type null");
    if (options.q != null) {
      let tempPath = Util.recoverySpecialChar(options.q);
      console.log("options tempPath :\n" + tempPath);
      let tempParams = Util.getUrlParamDict(tempPath);
      console.log("options tempParams :\n" + JSON.stringify(tempParams))
      if (tempParams.type == 'scan') {
        let scanOrderNo = tempParams.orderno;
        if (scanOrderNo != null) {
          app.ShareData.scanOrderNo = scanOrderNo;
          console.log("ScanOrderNo:\n" + app.ShareData.scanOrderNo);
          if (getResultCallback != null && typeof getResultCallback == 'function') {
            getResultCallback('scan', null);
          }
        }
      } else if (tempParams.type == "rqimg") {
        let businessNo = tempParams.businessno;
        if (businessNo != null) {
          app.ShareData.businessNo = businessNo;
          console.log("businessNo:\n" + app.ShareData.businessNo);
          if (getResultCallback != null && typeof getResultCallback == 'function') {
            getResultCallback('rqimg', null);
          }
        }
      }
    } else {
      if (getResultCallback != null && typeof getResultCallback == 'function') {
        getResultCallback("none", null);
      }
    }
  } else {
    console.log("options type :\n" + JSON.stringify(options.type));
    if (options.type == 'share') {
      let shareOpenId = options.shareopenid;
      let shareStationNo = options.stationno;
      let shareBusinessNo = options.businessno;
      if (shareOpenId != null) {
        app.ShareData.openId = shareOpenId;
        app.ShareData.stationNo = shareStationNo;
        app.ShareData.businessNo = shareBusinessNo;
        console.log("ShareOpenId:\n" + app.ShareData.openId);
        if (getResultCallback != null && typeof getResultCallback == 'function') {
          getResultCallback('share', null);
        }
      }
    }
  }
}

module.exports = {
  getOnShareAppMessageForShareOpenId: getOnShareAppMessageForShareOpenId,
  getOpenIdInShareMessage: getOpenIdInShareMessage,
  getAppOpenData: getAppOpenData,
  shareToOtherPay: shareToOtherPay,
}