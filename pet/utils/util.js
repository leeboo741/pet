const config = require("./config")

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 获取 yyyy-mm-dd 格式时间
 */
const formatYMD = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

/**
 * 获取时间和星期几
 */
function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  let yearDate = date.getFullYear();
  let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.time = yearDate + '-' + month + '-' + dayFormate;
  dateObj.week = show_day[day];
  return dateObj;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function checkEmpty(obj) {
  if (obj == null || obj==undefined) {
    return true;
  }
  if ((typeof obj == 'string' || obj instanceof Array) && obj.length <= 0) {
    return true;
  } 
  if (typeof obj == 'object' && Object.keys(obj).length <= 0) {
    return true;
  }
  return false;
}

function isVideo(fileAddress) {
  let addressList = fileAddress.split("?");
  fileAddress = addressList[0];
  let index = fileAddress.lastIndexOf(".");
  let suffix = fileAddress.substring(index + 1);
  if (suffix == "mp4" ||
      suffix == "mov" ||
      suffix == "m4v" ||
      suffix == "3gp" ||
      suffix == "avi" ||
      suffix == "m3u8" ||
      suffix == "webm"){
    return true;
  }
  return false;
}

function isPhoneAvailable(phone) {
  var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!myreg.test(phone)) {
    return false;
  } else {
    return true;
  }
}

/**
 * 替换特殊字符
 */
function replaceSpecialChar(string) {
  string = string.replace(/\%/g, "%25");
  string = string.replace(/\#/g, "%23");
  string = string.replace(/\&/g, "%26");
  string = string.replace(/\ /g, "%20");
  string = string.replace(/\//g, "%2F");
  string = string.replace(/\?/g, "%3F");
  string = string.replace(/\=/g, "%3D");
  return string;
}

/**
 * 恢复特殊字符
 */
function recoverySpecialChar(string) {
  string = string.replace(/\%25/g, "%");
  string = string.replace(/\%23/g, "#");
  string = string.replace(/\%26/g, "&");
  string = string.replace(/\%20/g, " ");
  string = string.replace(/\%2F/g, "/");
  string = string.replace(/\%3F/g, "?");
  string = string.replace(/\%3D/g, "=");
  return string;
}

/**
 * 获取地址中参数
 */
function getUrlParamDict(url) {
  let paramDict = {};
  let tempPaths = url.split("?");
  if (!checkEmpty(tempPaths) && tempPaths.length == 2) {
    let paramStr = tempPaths[1];
    let params = paramStr.split("&");
    for (let i = 0; i < params.length; i++) {
      let tempParamStr = params[i];
      let tempParams = tempParamStr.split("=");
      let tempParamKey = tempParams[0];
      let tempParamValue = tempParams[1];
      paramDict[tempParamKey] = tempParamValue;
    }
  }
  return paramDict;
}

/**
 * 检查是否是方法
 * @param functionName
 */
function checkIsFunction(functionName) {
  if (functionName != null && typeof functionName == "function") {
    return true;
  }
  return false;
}

/**
 * 检查是否是数字
 * @param {*} number 
 */
function checkIsNumber(number) {
  if (number != null && typeof number == 'number') {
    return true;
  } 
  return false;
}

/**
 * 是否是 object 对象
 * @return true 是 false 非
 */
function checkIsObject(obj) {
  if (obj != null && typeof obj == "object") {
    return true;
  }
  return false;
}

/**
 * 检查是否是空的 object 对象
 * @return true 空 false 非空
 */
function checkObjectIsEmpty(obj) {
  if (this.checkIsObject(obj) && Object.keys(obj).length > 0) {
    return false;
  }
  return true;
}

/**
 * 打印
 * @param  {...any} args 
 */
function printLog(...args) {
  if (config.PRINT_ABLE) {
    console.log(...args);
  }
}

module.exports = {
  formatTime: formatTime,
  dateLater: dateLater,
  formatYMD: formatYMD,
  checkEmpty: checkEmpty,
  isVideo: isVideo,
  isPhoneAvailable: isPhoneAvailable,
  replaceSpecialChar: replaceSpecialChar,
  recoverySpecialChar: recoverySpecialChar,
  getUrlParamDict: getUrlParamDict,
  checkIsFunction: checkIsFunction,
  checkIsObject: checkIsObject,
  checkObjectIsEmpty: checkObjectIsEmpty,
  checkIsNumber: checkIsNumber,
  printLog: printLog,
}
