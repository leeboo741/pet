/**
 * 请求失败回调 数据对象 构造方法
 * @param obj 参数对象
 */
var RequestFailObj = function RequestFailObj(obj) {
  this.code = -1; // 错误码
  this.header = null; // 请求头
  this.cookies = null; // cookies
  this.errMsg = null; // 
  if (obj != null) {
    if (obj.code != null && typeof obj.code == "number") {
      this.code = obj.code;
    }
    if (obj.header != null && typeof obj.header == "object") {
      this.header = obj.header;
    }
    if (obj.cookies != null && typeof obj.cookies == "object") {
      this.cookies = obj.cookies;
    }
    if (obj.errMsg != null && typeof obj.errMsg == "string") {
      this.errMsg = obj.errMsg;
    }
  }
}

module.exports = {
  RequestFailObj: RequestFailObj
}