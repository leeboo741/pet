
/**
 * 是否是视频文件
 * @param fileAddress 文件地址
 * @return true 是 false 不是
 */
function checkIsVideo(fileAddress) {
  let index = fileAddress.lastIndexOf(".");
  let suffix = fileAddress.substring(index + 1);
  if (suffix == "mp4" ||
    suffix == "mov" ||
    suffix == "m4v" ||
    suffix == "3gp" ||
    suffix == "avi" ||
    suffix == "m3u8" ||
    suffix == "webm") {
    return true;
  }
  return false;
}

/**
 * 是否可用电话
 * @param phone 要检查的电话
 * @return true 可用 false 不可用
 */
function checkIsPhoneAvailable(phone) {
  var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
  if (!myreg.test(phone)) {
    return false;
  } else {
    return true;
  }
}

/**
 * 检查是否为空
 * @param 对象
 * @return true 空 false 非空
 */
function checkIsEmpty(obj) {
  if (obj == null || obj.length <= 0) {
    return true;
  }
  return false;
}

/**
 * 检查 是否是可用 function
 * @param fctObj 函数对象
 * @return true 是 false 不是
 */
function checkIsFunction(fctObj) {
  if (fctObj != null && typeof fctObj == "function") {
    return true;
  }
  return false;
}

/**
 * 检查是否是 string
 * @param checkObj 检查对象
 * @return true 是 false 不是
 */
function checkIsString(checkObj) {
  return checkObj != null && typeof checkObj == "string";
}

/**
 * 检查是否是 object
 * @param checkObj 检查对象
 * @return true 是 false 不是
 */
function checkIsObject(checkObj) {
  return checkObj != null && typeof checkObj == "object";
}

/**
 * 检查是否是 boolean
 * @param checkObj 检查对象
 * @return true 是 false 不是
 */
function checkIsBoolean(checkObj) {
  return checkObj != null && typeof checkObj == "boolean";
}

/**
 * 检查是否是 number
 * @param checkObj 检查对象
 * @return true 是 false 不是
 */
function checkIsNumber(checkObj) {
  return checkObj != null && typeof checkObj == "number";
}

/**
 * 检查是否是 undefined
 * @param checkObj 检查对象
 * @return true 是 false 不是
 */
function checkIsUndefined(checkObj) {
  return checkObj != null && typeof checkObj == "undefined";
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



module.exports = {
  checkIsVideo: checkIsVideo,
  checkIsPhoneAvailable: checkIsPhoneAvailable,

  checkIsEmpty: checkIsEmpty,
  checkIsFunction: checkIsFunction,
  checkIsString: checkIsString,
  checkIsObject: checkIsObject,
  checkIsBoolean: checkIsBoolean,
  checkIsNumber: checkIsNumber,
  checkIsUndefined: checkIsUndefined,

  replaceSpecialChar: replaceSpecialChar,
  recoverySpecialChar: recoverySpecialChar,
  getUrlParamDict: getUrlParamDict
}