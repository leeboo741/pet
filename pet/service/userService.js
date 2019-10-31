const app = getApp();
const config = require("../utils/config.js");

const Login_Success = 0;
const Login_NotExist = 1;
const Login_Fail = 2;
const Login_NoAuthSetting = 3;

const Key_UserInfo = "userInfo";

/**
 * 获取用户
 * @param userInfo 用户对象
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
 * @param deleteCallback(deleteSuccess) 删除结果回调 true 成功 false 失败
 */
function deleteUserInfo(deleteCallback){
  wx.removeStorage({
    key: Key_UserInfo,
    success(res) {
      console.log("删除用户 success: \n" + JSON.stringify(res));
      if (deleteCallback && typeof deleteCallback == "function") {
        deleteCallback(true)
      }
    },
    fail(res) {
      console.log("删除用户 fail: \n" + JSON.stringify(res));
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
 * 获取用户电话
 */
function getPhone(){
  let userInfo = getUserInfo();
  if (userInfo == null || userInfo.openId == null || userInfo.openId.length <= 0) {
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
 * 是否登陆
 */
function isLogin() {
  let openId = getOpenId();
  if (openId == null) {
    return false;
  }
  return true;
}

/**
 * 登陆操作
 */
function login(loginCallback) {
  wx.showLoading({
    title: '请稍等...',
  })
  console.log("微信登陆")
  // 登录
  wx.login({
    success: res => {
      console.log("微信login success => " + res.code);
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      let wxCode = res.code;
      app.globalData.code = res.code;
      // 查看是否授权
      wx.getSetting({
        success(res) {
          console.log("获取授权成功")
          if (res.authSetting['scope.userInfo']) {
            console.log("获取 scope.userInfo 授权成功")
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success(res) {
                console.log("微信登陆 => \n" + JSON.stringify(res));
                let userInfo = res.userInfo;
                if (userInfo.gender != null && userInfo.gender == "1") {
                  userInfo.gender = "男";
                } else {
                  userInfo.gender = "女";
                }
                // 向服务器请求登陆，返回 本微信 在服务器状态，注册|未注册，
                wx.request({
                    url: config.URL_Service + config.URL_Login, // 服务器地址
                  data: {
                    "code": wxCode
                  }, // 参数
                  success: res => {
                    console.log("success => " + JSON.stringify(res));
                    if (res.data.code == config.RES_CODE_SUCCESS) {
                      let tempUserInfo = JSON.parse(res.data.data)
                      userInfo.customerNo = tempUserInfo.customerNo
                      userInfo.openId = tempUserInfo.openId
                      userInfo.phone = tempUserInfo.phone
                      userInfo.nickName = tempUserInfo.customerName
                      userInfo.avatarUrl = tempUserInfo.headerImage
                      userInfo.gender = tempUserInfo.sex
                      userInfo.role = tempUserInfo.role
                      userInfo.balance = tempUserInfo.balance
                      saveUserInfo(userInfo);
                      if (loginCallback) {
                        loginCallback(Login_Success, "登陆成功");
                      }
                    } else if (res.data.code == config.RES_CODE_NOTEXIST) {
                      app.globalData.nickName = userInfo.nickName;
                      app.globalData.avatarUrl = userInfo.avatarUrl;
                      app.globalData.gender = userInfo.gender;
                      app.globalData.openId = res.data.data;
                      if (loginCallback) {
                        loginCallback(Login_NotExist, "未注册");
                      }
                    } else {
                      if (loginCallback) {
                        loginCallback(Login_Fail, "登陆失败，请稍后再试");
                      }
                    }
                  }, // 请求成功回调 登陆成功 保存 用户信息。登陆失败，跳转注册页面
                  fail: res => {
                    console.log("fail => " + JSON.stringify(res));
                    if (loginCallback) {
                      loginCallback(Login_Fail, "链接失败，请稍后再试");
                    }
                  }, // 请求失败回调,弹窗，重新请求
                  complete: res => {
                    console.log("complite => " + JSON.stringify(res));
                    wx.hideLoading();
                  }, // 请求完成回调，隐藏loading
                })
              }
            })
          } else {
            wx.hideLoading();
            if (loginCallback) {
              loginCallback(Login_NoAuthSetting, "未授权！");
            }
          }
        },
        fail(res) {
          console.log("获取授权失败");
          wx.hideLoading();
        },
        complete(res) {
        },
      })
    },
    fail(res) {
      console.log("微信login fail => " + JSON.stringify(res));

      if (loginCallback) {
        loginCallback(Login_Fail, "微信登陆失败");
      }
    },
    complete(res) {
      console.log("微信login complete => " + JSON.stringify(res));
    },
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
  login: login,
  saveUserInfo: saveUserInfo,
  getUserInfo: getUserInfo,
  deleteUserInfo: deleteUserInfo,
  isLogin: isLogin,
  getPhone: getPhone,
  getOpenId: getOpenId,
  checkLogin: checkLogin
}