const app = getApp();
const config = require("../utils/config.js");

const Login_Success = 0;
const Login_NotExist = 1;
const Login_Fail = 2;
const Login_NoAuthSetting = 3;

const Key_UserInfo = "userInfo";

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
 * 获取openId
 */
function getOpenID() {
  let userInfo = getUserInfo();
  if (userInfo == null || userInfo.openID == null || userInfo.openID.length <= 0) {
    return null;
  }
  return userInfo.openID;
}

/**
 * 是否登陆
 */
function isLogin() {
  let openID = getOpenID();
  if (openID == null) {
    return false;
  }
  return true;
}


function login(loginCallback, msg) {
  wx.showLoading({
    title: '登陆中...',
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
                    if (res.data.prompt == config.Prompt_Success) {
                      let tempUserInfo = JSON.parse(res.data.root)
                      userInfo.customerNo = tempUserInfo.customerNo
                      userInfo.openID = tempUserInfo.openid
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
                    } else if (res.data.prompt == config.Prompt_NotExist) {
                      app.globalData.nickName = userInfo.nickName;
                      app.globalData.avatarUrl = userInfo.avatarUrl;
                      app.globalData.gender = userInfo.gender;
                      app.globalData.openID = res.data.root;
                      if (loginCallback) {
                        loginCallback(Login_NotExist, "未注册");
                      }
                    } else {
                      if (loginCallback) {
                        loginCallback(Login_Fail, "登陆失败，请稍后失败");
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
      alreadyLoginCallback();
    }
  } else {
    wx.showModal({
      title: '尚未登陆',
      content: '需要登陆使用该功能',
      cancelText: '暂不登陆',
      confirmText: '登陆',
      success(res) {
        if (res.confirm) {
          login(function loginCallback(state, msg) {
            if (state == Login_Success) {
              wx.showToast({
                title: '登陆成功',
              })
            } else if (state == Login_Fail) {
              wx.showModal({
                title: '登陆失败',
                content: msg,
                showCancel: false,
                confirmText: "重新登陆",
                success (res) {
                  if (res.confirm) {
                    checkLogin();
                  }
                }
              })
            } else if (state == Login_NoAuthSetting) {
              wx.showModal({
                title: '获取用户信息授权失败',
                content: '登陆注册需要获取您的昵称、头像等基本信息。请在个人中心点击(登陆|注册)按钮进行授权。',
                success(result) {
                  if (result.confirm) {
                    wx.switchTab({
                      url: "/pages/me/me",
                    })
                  }
                }
              })
            } else {
              wx.navigateTo({
                url: '/pages/register/register',
              })
            }
          })
        } else if (res.cancel) {

        }
      },
    })
  }
}

module.exports = {
  Login_Success,
  Login_NotExist,
  Login_Fail,
  login: login,
  saveUserInfo: saveUserInfo,
  getUserInfo: getUserInfo,
  isLogin: isLogin,
  getOpenID: getOpenID,
  checkLogin: checkLogin
}