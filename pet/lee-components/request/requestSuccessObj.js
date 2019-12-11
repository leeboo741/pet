/**
 * 请求成功回调 数据对象 构造方法
 * @param obj 参数对象
 */
var RequestSuccessObj = function RequestSuccessObj(obj) {
  this.root = null; // 返回内容
  this.total = 0; // 返回总条数
  this.header = null; // 请求头
  this.cookies = null; // cookies
  if (obj != null) {
    if (obj.root != null) {
      this.root = obj.root;
    }
    if (obj.total != null && typeof obj.total == "number") {
      this.total = obj.total;
    }
    if (obj.header != null && typeof obj.header == "object") {
      this.header = obj.header;
    }
    if (obj.cookies != null && typeof obj.cookies == "object") {
      this.cookies = obj.cookies;
    }
  }
}

module.exports = {
  RequestSuccessObj: RequestSuccessObj
}