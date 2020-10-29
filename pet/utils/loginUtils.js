const app = getApp();
const config = require("../utils/config.js");
const UrlPath = require('../utils/config.js');
const Util = require("../utils/util.js");
const PagePath = require("../utils/pagePath.js");

const Login_Success = 0;
const Login_NotExist = 1;
const Login_Fail = 2;
const Login_NoAuthSetting = 3;

const Key_UserInfo = "userInfo";
const Key_CurrentVersionCode = 'CurrentVersionCode'

const LastNeedClearUserInfoVersionCode = 78;

/**
 * 是否是当前最新版本Code
 */
function updateAppVersion() {
  try {
    let currentVersionCode = wx.getStorageSync(Key_CurrentVersionCode);
    if (currentVersionCode <= 78 && currentVersionCode < config.Version_Code) {
      saveAppVersionCode(config.Version_Code);
      return true;
    } else {
      saveAppVersionCode(config.Version_Code);
      return false;
    }
  } catch (e) {
    saveAppVersionCode(config.Version_Code);
    return true;
  }
}

/**
 * 存入当前版本Code
 */
function saveAppVersionCode() {
  try {
    wx.setStorageSync(Key_CurrentVersionCode, config.Version_Code);
  } catch (e) {

  }
}

/**
 * 获取当前AppType
 */
function getAppType(){
  return "WeappConsign";
}

/**
 * 获取用户
 */
function saveUserInfo(userInfo){
  let userInfoStr = JSON.stringify(userInfo);
  try {
    wx.setStorageSync(Key_UserInfo, userInfoStr);
  } catch (e) { 

  }
}

/**
 * 删除用户
 */
function deleteUserInfo(deleteCallback){
  wx.removeStorage({
    key: Key_UserInfo,
    success(res) {
      if (deleteCallback && typeof deleteCallback == "function") {
        deleteCallback(true)
      }
    },
    fail(res) {
      if (deleteCallback && typeof deleteCallback == "function") {
        deleteCallback(false)
      }
    }
  })
}

/**
 * 获取保存用户信息
 */
function getUserInfo() {
  try {
    let userInfo = JSON.parse(wx.getStorageSync(Key_UserInfo));
    return userInfo;
  } catch (e) {
    return null;
  }
}

/**
 * 获取员工信息
 */
function getStaffInfo() {
  let userInfo = getUserInfo();
  if (userInfo == null) {
    return null;
  }
  return userInfo.staff;
}

/**
 * 获取站点信息
 */
function getStationInfo() {
  let staff = getStaffInfo();
  if (staff == null) {
    return null;
  }
  return staff.station;
}

/**
 * 更新用户余额
 */
function resetBalance(balance) {
  if (balance == null || balance.length < 0) {
    balance = 0;
  }
  let userInfo = getUserInfo();
  userInfo.balance = balance;
  saveUserInfo(userInfo);
}

/**
 * 获取用户余额
 */
function getBalance() {
  let userInfo = getUserInfo();
  if (userInfo == null || userInfo.balance == null || userInfo.balance.length < 0) {
    return 0;
  }
  return userInfo.balance;
}

/**
 * 获取站点编号
 */
function getStationNo(){
  let userInfo = getUserInfo();
  if (userInfo == null || userInfo.staff == null || userInfo.staff.station == null || userInfo.staff.station.stationNo == null || userInfo.staff.station.stationNo.length <= 0) {
    return null;
  }
  return userInfo.staff.station.stationNo;
}

/**
 * 获取用户编号
 */
function getCustomerNo() {
  let userInfo = getUserInfo();
  if (userInfo == null || userInfo.customerNo == null || userInfo.customerNo.length <= 0) {
    return null;
  }
  return userInfo.customerNo;
}

/**
 * 获取性别
 */
function getSex() {
  let userInfo = getUserInfo();
  if (userInfo && userInfo.sex == 1) {
    return '男';
  } else {
    return '女';
  }
}

/**
 * 获取员工编号
 */
function getStaffNo() {
  let userInfo = getUserInfo();
  if (userInfo == null || userInfo.staff == null || userInfo.staff.staffNo == null || userInfo.staff.staffNo.length <= 0) {
    return null;
  }
  return userInfo.staff.staffNo;
}

/**
 * 获取商户编号
 */
function getBusinessNo() {
  let userInfo = getUserInfo();
  if (userInfo == null || userInfo.business == null || userInfo.business.businessNo == null || userInfo.business.businessNo.length <= 0) {
    return null;
  }
  return userInfo.business.businessNo;
}

/**
 * 获取商户认证级别
 */
function getBusinessAuthType() {
  let userInfo = getUserInfo();
  if (userInfo == null || userInfo.business == null || userInfo.business.authType == null || userInfo.business.authType.length <= 0) {
    return 0;
  } 
  return userInfo.business.authType;
}

/**
 * 检查用户商家信息是否补充完全
 */
function checkBusinessInfoComplete(){
  let userInfo = getUserInfo();
  if (userInfo == null || userInfo.business == null || userInfo.business.complete == null || userInfo.business.complete.length <= 0) {
    return false;
  } 
  return userInfo.business.complete==0?false:true;
}

/**
 * 是否是员工
 */
function isStaff() {
  let staffNo = getStaffNo();
  if (staffNo != null) {
    return true;
  }
  return false;
}

/**
 * 是否是商家
 */
function isBusiness() {
  let businessNo = getBusinessNo();
  if (businessNo != null) {
    return true;
  }
  return false;
}

/**
 * 获取用户电话
 */
function getPhone(){
  let userInfo = getUserInfo();
  if (userInfo == null || userInfo.phone == null || userInfo.phone.length <= 0) {
    return null;
  }
  return userInfo.phone;
}

/**
 * 获取openId
 */
function getOpenId() {
  let userInfo = getUserInfo();
  if (userInfo == null || userInfo.openId == null || userInfo.openId.length <= 0) {
    return null;
  }
  return userInfo.openId;
}

/**
 * 获取unionId
 */
function getUnionId() {
  let userInfo = getUserInfo();
  if (userInfo == null || userInfo.unionId == null || userInfo.unionId.length <= 0) {
    return null;
  }
  return userInfo.unionId;
}

/**
 * 是否登陆
 */
function isLogin() {
  let customerNo = getCustomerNo();
  if (customerNo == null) {
    return false;
  }
  return true;
}

/**
 * 获取微信加密过的基本信息
 */
function getWXUserInfo(getWXUserInfoCallback){
  let that = this;
  wx.login({
    success(res){
      let wxCode = res.code;
      that.getBaseInfoByWXCode(wxCode, function getBaseInfoCallBack(openId, sessionKey){
        wx.getUserInfo({
          success(wxUserInfo) {
            let tempUserInfo = wxUserInfo.userInfo; // 用户信息对象
            let rawData = wxUserInfo.rawData; // 不包括敏感信息的原始数据字符串，用于计算签名
            let signature = wxUserInfo.signature; // 签名
            let encryptedData = wxUserInfo.encryptedData; // 加密数据
            let iv = wxUserInfo.iv; // 加密算法初始向量
            wxUserInfo.openId = openId;
            wxUserInfo.sessionKey = sessionKey;
            that.getUserInfoByBaseInfo(wxUserInfo, function getUserInfoCallback(userInfo){
              if (Util.checkIsFunction(getWXUserInfoCallback)) {
                getWXUserInfoCallback(userInfo);
              }
            })
          }
        })
      })
    }
  })
}

function getBaseInfoByWXCode(wxCode, getBaseInfoCallback) {
  wx.request({
    url: UrlPath.URL_Service + UrlPath.URL_GetUserInfoByCode,
    data: {
      code: wxCode
    },
    success(res) {
      console.log("通过CODE获取用户信息:" + JSON.stringify(res));
      let resultData = res.data.data;
      let openId = resultData.openid;
      let sessionKey = resultData.sessionKey;
      if (getBaseInfoCallback && Util.checkIsFunction(getBaseInfoCallback)) {
        getBaseInfoCallback(openId, sessionKey);
      }
    },
    fail(res) {
      console.log("通过CODE获取用户信息失败");
      wx.showToast({
        title: '登录请求失败',
        icon: 'none'
      })
    },
  })
} 
function getUserInfoByBaseInfo(baseInfo, getUserInfoCallback) {
  wx.request({
    url: UrlPath.URL_Service + UrlPath.URL_GetUserInfoByBaseInfo,
    data: {
      encryptedData: baseInfo.encryptedData,
      sessionKey: baseInfo.sessionKey,
      iv: baseInfo.iv
    },
    success(res) {
      console.log("通过基本信息获取用户信息:" + JSON.stringify(res));
      if (Util.checkIsFunction(getUserInfoCallback)) {
        getUserInfoCallback(res.data.data)
      }
    },
    fail(res) {
      console.log("通过基本信息获取用户信息失败");
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      })
    },
  })
}

/**
 * 登录操作
 */
function login(loginCallback) {
  wx.navigateTo({
    url: PagePath.Path_Register,
  })
}

/**
 * 更新用户信息
 */
function updateCustomer(updateCallback) {
  let that = this;
  wx.request({
    url: UrlPath.URL_Service + UrlPath.URL_UpdateCustomer + this.getCustomerNo(),
    success(res) {
      if (res.data.code == config.RES_CODE_SUCCESS) {
        Util.printLog("更新用户信息: " + JSON.stringify(res));
        that.saveUserInfo(res.data.data);
        if (Util.checkIsFunction(updateCallback)) {
          updateCallback(true);
        }
      } else {
        if (Util.checkIsFunction(updateCallback)) {
          updateCallback(false);
        }
      }
    },
    fail(res) {
      if (Util.checkIsFunction(updateCallback)) {
        updateCallback(false);
      }
    }
  })
}

/**
 * 登录 获取服务器端的用户信息
 */
function getLogin(userInfo, encryptedData, iv, shareOpenId, loginCallback) {
  let that = this;
  wx.request({
    url: UrlPath.URL_Service + UrlPath.URL_Login,
    data: {
      encryptedData: encryptedData,
      iv: iv,
      shareOpenId: shareOpenId ? shareOpenId:null,
      wxUserInfo: userInfo
    },
    method: "POST", // 请求方式
    success(res){
      console.log("登录获取用户信息:"+ JSON.stringify(res.data.data));
      that.saveUserInfo(res.data.data);
      if (loginCallback) {
        loginCallback();
      }
    },
    fail(res){
      wx.showToast({
        title: '登录|注册失败',
        icon: 'none'
      })
    }
  })
} 

/**
 * 获取服务器端的新用户信息
 */
function getNewUserInfo(getNewUserInfoCallback) {
  if (getUnionId() == null) {
    return;
  }
  let that = this;
  wx.request({
    url: UrlPath.URL_Service + UrlPath.URL_LoginWithUnionId,
    data: {
      unionId: getUnionId()
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success(res) {
      that.saveUserInfo(res.data.data);
      if (Util.checkIsFunction(getNewUserInfoCallback)) {
        getNewUserInfoCallback(true);
      }
    },
    fail(res) {
      if (Util.checkIsFunction(getNewUserInfoCallback)) {
        getNewUserInfoCallback(false);
      }
    }
  })
}

/**
 * 检查是否登陆
 */
function checkLogin(alreadyLoginCallback){
  if (isLogin()) {
    if (alreadyLoginCallback) {
      alreadyLoginCallback(true);
    }
  } else {
    if (alreadyLoginCallback) {
      alreadyLoginCallback(false);
    }
  }
}

module.exports = {
  Login_Success,
  Login_NotExist,
  Login_Fail,
  Login_NoAuthSetting,
  login: login,
  updateCustomer: updateCustomer,
  saveUserInfo: saveUserInfo,
  getUserInfo: getUserInfo,
  getStaffInfo: getStaffInfo,
  getStationInfo: getStationInfo,
  deleteUserInfo: deleteUserInfo,
  isLogin: isLogin,
  getPhone: getPhone,
  getOpenId: getOpenId,
  getUnionId: getUnionId,
  checkLogin: checkLogin,
  getStaffNo: getStaffNo,
  getStationNo: getStationNo,
  getBusinessNo: getBusinessNo,
  getBusinessAuthType: getBusinessAuthType,
  checkBusinessInfoComplete: checkBusinessInfoComplete,
  isStaff: isStaff,
  isBusiness: isBusiness,
  getCustomerNo: getCustomerNo,
  getWXUserInfo: getWXUserInfo,
  getBaseInfoByWXCode: getBaseInfoByWXCode,
  getUserInfoByBaseInfo: getUserInfoByBaseInfo,
  getLogin: getLogin,
  getNewUserInfo: getNewUserInfo,
  resetBalance: resetBalance,
  getBalance: getBalance,
  getAppType: getAppType,
  updateAppVersion: updateAppVersion,
}