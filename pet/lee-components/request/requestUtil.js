const ResponseHandler = require("../request/responseHandle.js");
const { RequestParamObj } = require("../request/requestParamObj.js");  // 请求参数对象
const { RequestSuccessObj } = require("../request/requestSuccessObj.js"); // 请求成功对象
const { RequestFailObj } = require("../request/requestFailObj.js"); // 请求失败对象
const { UploadFileParamObj } = require("../request/uploadFile/uploadFileParamObj.js"); // 上传参数对象

/**
 * 1 调用 RequestUtil 接收 RequestParamObj 或者 UploadFileParamObj 对象，
 * 2 RequestUtil 根据 RequestParamObj 中参数 调用 wx.request 或者 wx.uploadFile 发起对应的GET,POST,PUT,DELETE,UPLOAD请求
 * 3 wx.request 或者 wx.uploadFile 接口调用成功返回中（success）和 失败返回中（fail）， 将数据提交给 ResponseHandler 进行处理
 * 4 ResponseHandler 剥离 成功数据 和 失败数据，并对失败数据进行 弹窗展示操作，将成功数据返回给 RequestUtil
 * 5 RequestUtil 通过 RequestParamObj 中的 回调函数， 将成功结果 和失败结果 返还给调用方 
 * 
 * 使用时 请先根据自己业务需要和数据结构 修改 
  * ResponseHandler 中的处理逻辑 ， 
  * RequestSuccessObj RequestFailObj 对象属性 ， 
  * ResponseCodeEnum 中的 状态码
 */ 

/**
 * 发起请求
 * @param requestParamObj 请求数据
 */
function Request(requestParam) {
  switch(requestParam.method) {
    case "GET": 
      RequestGET(requestParam);
      break;
    case "POST":
      RequestPOST(requestParam);
      break;
    case "PUT":
      RequestPUT(requestParam);
      break;
    case "DELETE":
      RequestDELETE(requestParam);
      break;
  }
}

/**
 * GET 请求
 * @param requestParamObj 对象 请求数据
 */
function RequestGET(requestParam) {
  if (requestParam == null) {
    throw new Error("requestParam 不能为空");
    return;
  }
  if (!(requestParam instanceof RequestParamObj)) {
    throw new Error("请使用 RequestParamObj");
    return;
  }
  wx.request({
    url: requestParam.url,
    data: requestParam.data,
    header: requestParam.header,
    success(res) {
      ResponseHandler.handleResponse(res,
        function handleSuccessCallback(root, total, header, cookies) {
          if (typeof requestParam.success == "function" && requestParam.success) {
            let requestSuccessObj = new RequestSuccessObj(
              {
                "root": root,
                "total": total,
                "header": header,
                "cookies": cookies
              }
            )
            requestParam.success(requestSuccessObj);
          }
        },
        function handleFailCallback(code, errMsg, header, cookies) {
          if (typeof requestParam.fail == "function" && requestParam.fail) {
            let requestFailObj = new RequestFailObj({
              "code": code,
              "header": header,
              "cookies": cookies,
              "errMsg": errMsg
            })
            requestParam.fail(requestFailObj);
          }
        },
      )
    },
    fail(res) {
      if (requestParam.fail != null && typeof requestParam.fail == "function") {
        let requestFailObj = new RequestFailObj()
        requestParam.fail(requestFailObj);
      }
      ResponseHandler.handleRequestFail();
    },
    complete(res) {
      if (requestParam.complete != null && typeof requestParam.complete == "function") {
        requestParam.complete(res);
      }
    }
  })
}

/**
 * PUT 请求
 * @param requestParamObj 对象 请求数据
 */
function RequestPUT(requestParam) {
  if (requestParam == null) {
    throw new Error("requestParam 不能为空");
    return;
  }
  if (!(requestParam instanceof RequestParamObj)) {
    throw new Error("请使用 RequestParamObj");
    return;
  }
  wx.request({
    url: requestParam.url,
    data: requestParam.data,
    header: requestParam.header,
    method: "PUT",
    success(res) {
      ResponseHandler.handleResponse(res,
        function handleSuccessCallback(root, total, header, cookies) {
          if (typeof requestParam.success == "function" && requestParam.success) {
            let requestSuccessObj = new RequestSuccessObj(
              {
                "root": root,
                "total": total,
                "header": header,
                "cookies": cookies
              }
            )
            requestParam.success(requestSuccessObj);
          }
        },
        function handleFailCallback(code, errMsg, header, cookies) {
          if (typeof requestParam.fail == "function" && requestParam.fail) {
            let requestFailObj = new RequestFailObj({
              "code": code,
              "header": header,
              "cookies": cookies,
              "errMsg": errMsg
            })
            requestParam.fail(requestFailObj);
          }
        },
      )
    },
    fail(res) {
      if (requestParam.fail != null && typeof requestParam.fail == "function") {
        let requestFailObj = new RequestFailObj()
        requestParam.fail(requestFailObj);
      }
      ResponseHandler.handleRequestFail();
    },
    complete(res) {
      if (requestParam.complete != null && typeof requestParam.complete == "function") {
        requestParam.complete(res);
      }
    }
  })
}

/**
 * POST 请求
 * @param requestParamObj 对象 请求数据
 */
function RequestPOST(requestParam) {
  if (requestParam == null) {
    throw new Error("requestParam 不能为空");
    return;
  }
  if (!(requestParam instanceof RequestParamObj)) {
    throw new Error("请使用 RequestParamObj");
    return;
  }
  wx.request({
    url: requestParam.url,
    data: requestParam.data,
    method: "POST",
    header: requestParam.header,
    success(res) {
      ResponseHandler.handleResponse(res,
        function handleSuccessCallback(root, total, header, cookies) {
          if (typeof requestParam.success == "function" && requestParam.success) {
            let requestSuccessObj = new RequestSuccessObj(
              {
                "root": root,
                "total": total,
                "header": header,
                "cookies": cookies
              }
            )
            requestParam.success(requestSuccessObj);
          }
        },
        function handleFailCallback(code, errMsg, header, cookies) {
          if (typeof requestParam.fail == "function" && requestParam.fail) {
            let requestFailObj = new RequestFailObj({
              "code": code,
              "header": header,
              "cookies": cookies,
              "errMsg": errMsg
            })
            requestParam.fail(requestFailObj);
          }
        },
      )
    },
    fail(res) {
      if (requestParam.fail != null && typeof requestParam.fail == "function") {
        let requestFailObj = new RequestFailObj()
        requestParam.fail(requestFailObj);
      }
      ResponseHandler.handleRequestFail();
    },
    complete(res) {
      if (requestParam.complete != null && typeof requestParam.complete == "function") {
        requestParam.complete(res);
      }
    }
  })
}

/**
 * DELETE 请求
 * @param requestParamObj 对象 请求数据
 */
function RequestDELETE(requestParam) {
  if (requestParam == null) {
    throw new Error("requestParam 不能为空");
    return;
  }
  if (!(requestParam instanceof RequestParamObj)) {
    throw new Error("请使用 RequestParamObj");
    return;
  }
  wx.request({
    url: requestParam.url,
    data: requestParam.data,
    method: "DELETE",
    header: requestParam.header,
    success(res) {
      ResponseHandler.handleResponse(res,
        function handleSuccessCallback(root, total, header, cookies) {
          if (typeof requestParam.success == "function" && requestParam.success) {
            let requestSuccessObj = new RequestSuccessObj(
              {
                "root": root,
                "total": total,
                "header": header,
                "cookies": cookies
              }
            )
            requestParam.success(requestSuccessObj);
          }
        },
        function handleFailCallback(code, errMsg, header, cookies) {
          if (typeof requestParam.fail == "function" && requestParam.fail) {
            let requestFailObj = new RequestFailObj({
              "code": code,
              "header": header,
              "cookies": cookies,
              "errMsg": errMsg
            })
            requestParam.fail(requestFailObj);
          }
        },
      )
    },
    fail(res) {
      if (requestParam.fail != null && typeof requestParam.fail == "function") {
        let requestFailObj = new RequestFailObj()
        requestParam.fail(requestFailObj);
      }
      ResponseHandler.handleRequestFail();
    },
    complete(res) {
      if (requestParam.complete != null && typeof requestParam.complete == "function") {
        requestParam.complete(res);
      }
    }
  })
}

/**
 * 上传文件请求
 * @param uploadFileParam UploadFileParamObj 对象
 * @return uploadTask
 */
function RequestUploadFile(uploadFileParam) {
  if (uploadFileParam == null) {
    throw new Error("uploadFileParam 不能为空");
    return;
  }
  if (!(uploadFileParam instanceof UploadFileParamObj)) {
    throw new Error("请使用 UploadFileParamObj");
    return;
  }
  let uploadTask = null;
  uploadTask = wx.uploadFile({
    url: uploadFileParam.url,
    filePath: uploadFileParam.filePath,
    name: uploadFileParam.name,
    header: uploadFileParam.header,
    formData: uploadFileParam.formData,
    success(res) {
      ResponseHandler.handleResponse(res,
        function handleSuccessCallback(root, total, header, cookies) {
          if (typeof uploadFileParam.success == "function" && uploadFileParam.success) {
            let requestSuccessObj = new RequestSuccessObj(
              {
                "root": root,
                "total": total,
                "header": header,
                "cookies": cookies
              }
            )
            uploadFileParam.success(requestSuccessObj);
          }
        },
        function handleFailCallback(code, errMsg, header, cookies) {
          if (typeof uploadFileParam.fail == "function" && uploadFileParam.fail) {
            let requestFailObj = new RequestFailObj({
              "code": code,
              "header": header,
              "cookies": cookies,
              "errMsg": errMsg
            })
            uploadFileParam.fail(requestFailObj);
          }
        },
      )
    },
    fail(res) {
      if (uploadFileParam.fail != null && typeof uploadFileParam.fail == "function") {
        let requestFailObj = new RequestFailObj()
        uploadFileParam.fail(requestFailObj);
      }
      ResponseHandler.handleRequestFail();
    },
    complete(res) {
      if (uploadFileParam.complete != null && typeof uploadFileParam.complete == "function") {
        uploadFileParam.complete(res);
      }
    }
  })
  uploadTask.onProgressUpdate(
    function upload(res) {
      if (uploadFileParam.onProgressCallback != null && typeof uploadFileParam.onProgressCallback == "function") {
        uploadFileParam.onProgressCallback(res)
      }
    }
  )
  return uploadTask;
}

module.exports = {
  Request: Request,
  RequestUploadFile: RequestUploadFile,
}