
const ResponseCodeEnum = require("../request/ResponseCodeEnum.js");

/**
 * request Success 时 处理方法
 * @param resource 返回数据
 * @param handleSuccessCallback 处理后 成功时 回调
 * @param handleFailCallback 处理后 失败时 回调
 */
function handleResponse(resource, handleSuccessCallback, handleFailCallback) {
  console.log("handleResponse resource:\n" + JSON.stringify(resource));
  if (resource.statusCode != ResponseCodeEnum.Status_Code.OK) {
    wx.showToast({
      title: '请求失败：' + resource.statusCode,
      icon: 'none'
    })
    handleFailCallback(resource.statusCode)
    return;
  }
  if (resource.data != null && typeof resource.data == "string") {
    resource.data = JSON.parse(resource.data);
  }
  if (resource.data.code == ResponseCodeEnum.Res_Code.SUCCESS) {
    if (handleSuccessCallback != null && typeof handleSuccessCallback == "function") {
      handleSuccessCallback(resource.data.root, resource.data.total, resource.header, resource.cookies);
    }
  } else if (resource.data.code == ResponseCodeEnum.Res_Code.NOT_EXIST) {
    wx.showToast({
      title: '用户不存在',
      icon: 'none'
    })
    if (handleFailCallback != null && typeof handleFailCallback == "function") {
      handleFailCallback(resource.data.code, resource.data.errMsg, resource.header, resource.cookies)
    }
  } else {
    let msg = resource.data.errMsg;
    if (msg == null || msg.length <= 0) {
      msg = "请求失败！"
    }
    wx.showToast({
      title: msg,
      icon: 'none'
    })
    if (handleFailCallback != null && typeof handleFailCallback == "function") {
      handleFailCallback(resource.data.code, resource.data.errMsg, resource.header, resource.cookies)
    }
  }
}

/**
 * request fail 时 处理方法
 */
function handleRequestFail() {
  wx.showToast({
    title: '网络异常',
    icon: 'none'
  })
}

module.exports={
  handleResponse: handleResponse, // request Success 时 处理方法
  handleRequestFail: handleRequestFail, // request Fail 时 处理方法
}