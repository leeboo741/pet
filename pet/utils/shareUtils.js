const LoginUtil = require("../utils/loginUtils.js");
const PagePath = require("../utils/pagePath.js");
const app = getApp();

/**
 * 分享 微信小程序
 */
function getOnShareAppMessageForShareOpenId(){
  return {
    title: "淘宠惠一站式服务中心",
    path: PagePath.Path_Home + '?shareopenid=' + LoginUtil.getOpenId() + '&type=share',
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
  let type = options.type;
  if (type == null) {
    getResultCallback("none",null);
  } else {
    if (options.type == 'share') {
      let shareOpenId = options.shareopenid;
      if (shareOpenId != null) {
        app.ShareData.openId = shareOpenId;
        console.log("ShareOpenId:\n" + app.ShareData.openId);
        if (getResultCallback != null && typeof getResultCallback == 'function') {
          getResultCallback('share', null);
        }
      }
    } else if (options.type == 'scan') {
      let scanOrderNo = options.orderno;
      if (scanOrderNo != null) {
        app.ShareData.scanOrderNo = scanOrderNo;
        console.log("ScanOrderNo:\n" + app.ShareData.scanOrderNo);
        if (getResultCallback != null && typeof getResultCallback == 'function') {
          getResultCallback('scan', null);
        }
      }
    }
  }
}

module.exports = {
  getOnShareAppMessageForShareOpenId: getOnShareAppMessageForShareOpenId,
  getOpenIdInShareMessage: getOpenIdInShareMessage,
  getAppOpenData: getAppOpenData,
}