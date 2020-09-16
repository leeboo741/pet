const LoginUtil = require("../utils/loginUtils.js");
const PagePath = require("../utils/pagePath.js");
const app = getApp();
const Util = require("../utils/util.js");
const loginUtils = require("../utils/loginUtils.js");

const ShareOtherPayType_Platform = 0;
const ShareOtherPayType_Business = 1;

/**
 * 分享 代支付
 * @param {*} orderNo 
 * @param {*} amount 
 * @param {*} qrcodePath 
 * @param {*} otherPayType
 */
function shareToOtherPay(orderNo, amount, qrcodePath, otherPayType){
  let tempPath = PagePath.Path_Home + '?type=sharetopay' + '&orderno=' + orderNo + '&amount=' + amount + '&customerno=' + LoginUtil.getCustomerNo() + "&shareopenid=" + loginUtils.getOpenId() + "&otherpaytype=" + otherPayType;
  let data = {
    title: "请查看并确认订单"
  };
  if (otherPayType == ShareOtherPayType_Business && qrcodePath != null) {
    let tempqrcodepath = encodeURIComponent(qrcodePath)
    tempPath = tempPath + "&shareqrcodepath=" + tempqrcodepath;
    data.imageUrl = qrcodePath;
  } 
  data.path = tempPath;
  return data;
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
  if (type == null) { // 普通二维码 扫码进入
    console.log("options type null");
    if (options.q != null) {
      let tempPath = Util.recoverySpecialChar(options.q);
      console.log("options tempPath :\n" + tempPath);
      let tempParams = Util.getUrlParamDict(tempPath);
      console.log("options tempParams :\n" + JSON.stringify(tempParams))
      if (tempParams.type == 'scan') { // 扫码签收
        let scanOrderNo = tempParams.orderno;
        if (scanOrderNo != null) {
          app.ShareData.scanOrderNo = scanOrderNo;
          console.log("ScanOrderNo:\n" + app.ShareData.scanOrderNo);
          if (getResultCallback != null && typeof getResultCallback == 'function') {
            getResultCallback('scan', null);
          }
        }
      } else if (tempParams.type == "rqimg") { // 商家扫码
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
  } else { // 分享卡片进入
    console.log("options type :\n" + JSON.stringify(options.type));
    if (options.type == 'share') { // 分享卡片
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
    } else if (options.type == 'sharetopay') { // 代支付卡片
      let orderNo = options.orderno;
      let amount = options.amount;
      let customerNo = options.customerno;
      let shareOpenId = options.shareopenid;
      let shareQRCodePath = decodeURIComponent(options.shareqrcodepath);
      let shareOtherPayType = options.otherpaytype;
      app.ShareData.openId = shareOpenId;
      app.ShareData.payOrderNo = orderNo;
      app.ShareData.payAmount = amount;
      app.ShareData.payCustomerNo = customerNo;
      app.ShareData.shareQRCodePath = shareQRCodePath;
      app.ShareData.shareOtherPayType = shareOtherPayType;
      if (getResultCallback != null && typeof getResultCallback == 'function') {
        getResultCallback('sharetopay', null);
      }
    }
  }
}

module.exports = {
  getOnShareAppMessageForShareOpenId: getOnShareAppMessageForShareOpenId,
  getOpenIdInShareMessage: getOpenIdInShareMessage,
  getAppOpenData: getAppOpenData,
  shareToOtherPay: shareToOtherPay,
  ShareOtherPayType_Platform,
  ShareOtherPayType_Business,
}