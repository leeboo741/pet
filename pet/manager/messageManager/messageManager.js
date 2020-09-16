const config = require("../../utils/config");
const loginUtils = require("../../utils/loginUtils");
const {RES_CODE_SUCCESS, Value_Default_LastGetMessageTime, Key_LastGetMessageTime } = require("../../utils/config");
const util = require("../../utils/util");

/**
 * 获取最新站内信
 * @param {function(boolean, object)} callback 回调
 */
function getNewMessage(callback) {
  wx.request({
    url: config.URL_Service + config.URL_Get_New_Message,
    data: {
      customerNo: loginUtils.getCustomerNo(),
      lastModifyTime: getLastGetMessageTime()
    },
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS) {
        if (res.data.data > 0) {
          setLastGetMessageTime(util.formatTime(new Date()));
        }
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

/**
 * 获取站内信列表
 * @param {number} offset 偏移量
 * @param {number} limit 页长
 * @param {function(boolean, object)} callback 回调
 */
function getMessageList(offset, limit, callback){
  wx.request({
    url: config.URL_Service + config.URL_Get_Message,
    data: {
      customerNo: loginUtils.getCustomerNo(),
      offset: offset,
      limit: limit
    },
    success(res){
      if (res.data.code == RES_CODE_SUCCESS) {
        if (!util.checkEmpty(res.data.data)) {
          setLastGetMessageTime(util.formatTime(new Date()));
        }
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

/**
 * 获取最后更新时间
 */
function  getLastGetMessageTime() {
  try{
    let lastTime = wx.getStorageSync(Key_LastGetMessageTime);
    return lastTime;
  }catch (e){
    return Value_Default_LastGetMessageTime;
  }
}

/**
 * 存储最后更新时间
 */
function  setLastGetMessageTime(time) {
  try {
    wx.setStorageSync(Key_LastGetMessageTime, time);
  } catch (e) {

  }
}

module.exports = {
  getNewMessage, // 获取最新站内信
  getMessageList, // 获取站内信列表
}