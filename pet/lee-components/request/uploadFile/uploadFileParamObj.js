/**
 * 构造 UploadFileParamObj 对象
 * @param obj 参数对象
 */
var UploadFileParamObj = function UploadFileParamObj(obj) {
  this.url = ""; // 请求地址
  this.filePath = ""; // 文件路径
  this.name = ""; // 名称
  this.header = { "Content-Type": "multipart/form-data" }; // 请求头
  this.formData = {}; // 附加信息
  this.success = null; // 请求成功回调
  this.fail = null; // 请求失败回调
  this.complete = null; // 请求完成回调
  this.onProgressCallback = null; // 进度回调

  if (obj != null) {
    if (obj.url != null && typeof obj.url == "string") {
      this.url = obj.url;
    }
    if (obj.filePath != null && typeof obj.filePath == "string") {
      this.filePath = obj.filePath;
    }
    if (obj.name != null && typeof obj.name == "string") {
      this.name = obj.name;
    }
    if (obj.header != null && typeof obj.header == "object") {
      this.header = obj.header;
      if (this.header["Content-Type"]==null) {
        this.header["Content-Type"] = "multipart/form-data";
      }
    }
    if (obj.formData != null && typeof obj.formData == "object") {
      this.formData = obj.formData;
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
    if (obj.onProgressCallback != null && typeof obj.onProgressCallback == "function") {
      this.onProgressCallback = obj.onProgressCallback;
    }
  }
}

module.exports = {
  UploadFileParamObj: UploadFileParamObj
}