
/**
 * 构造 RequestParam 对象
 * @param obj 参数对象
 */
var RequestParamObj = function RequestParamObj(obj) {
  this.url = ""; // 请求地址
  this.data = {}; // 请求参数
  this.header = {}; // 请求头
  this.method = "GET"; // 请求方式
  this.success = null; // 接口调用成功回调
  this.fail = null; // 接口调用失败回调
  this.complete = null; // 接口调用完成回调

  if (obj != null) {
    if (obj.url != null && typeof obj.url == "string") {
      this.url = obj.url;
    }
    if (obj.data != null && typeof obj.data == "object") {
      this.data = obj.data;
    }
    if (obj.header != null && typeof obj.header == "object") {
      this.header = obj.header;
    }
    if (obj.method != null && typeof obj.header == "string") {
      let tempMethod = obj.method;
      tempMethod = tempMethod.toUpperCase();
      this.method = tempMethod;
    }
    if (obj.success != null && typeof obj.success == "function") {
      this.success = obj.success;
    }
    if (obj.fail != null && typeof obj.fail == "function") {
      this.fail = obj.fail;
    }
    if (obj.complete != null && typeof obj.complete == "function") {
      this.complete = obj.complete;
    }
  }
}

module.exports={
  RequestParamObj: RequestParamObj
}