const config = require("../../utils/config");
const loginUtils = require("../../utils/loginUtils");
const { RES_CODE_SUCCESS } = require("../../utils/config");
const util = require("../../utils/util");

/**
 * 获取待审核商户列表
 * @param {function(boolean, object)} callback 回调
 */
function getUnauditedBusinessList(callback) {
  wx.request({
    url: config.URL_Service + config.URL_GetUnauditedStation,
    data: {
      customerNo: loginUtils.getCustomerNo()
    },
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS) {
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
 * 拒绝商家申请
 * @param {object} applyObj 申请对象
 * @param {function(boolean, object)} callback 回调 
 */
function rejectBusinessApply(applyObj, callback) {
  wx.request({
    url: config.URL_Service + config.URL_RejectStationApply,
    data: applyObj,
    method: "PUT",
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS && res.data.data > 0) {
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
 * 审核通过商家申请
 * @param {object} applyObj 申请对象 
 * @param {function(boolean, object)} callback 回调 
 */
function approvalBusinessApply(applyObj, callback) {
  wx.request({
    url: config.URL_Service + config.URL_ApprovalStationApply,
    data: applyObj,
    method: "PUT",
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS && res.data.data > 0) {
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
 * 获取待审核员工列表
 * @param {function(boolean, object)} callback 回调
 */
function getUnauditedStaffList(callback){
  wx.request({
    url: config.URL_Service + config.URL_GetUnauditedStaff,
    data: {
      phone: loginUtils.getPhone()
    },
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS) {
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
 * 拒绝员工申请
 * @param {object} applyObj 审核对象
 * @param {function(boolean, object)} callback 回调
 */
function rejectStaffApply(applyObj, callback) {
  wx.request({
    url: config.URL_Service + config.URL_RejectStaffApply,
    data: applyObj,
    method: "PUT",
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS && res.data.data > 0) {
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
 * 审核通过员工申请
 * @param {object} applyObj 审核对象
 * @param {function(boolean, object)} callback 回调
 */
function approvalStaffApply(applyObj, callback) {
  wx.request({
    url: config.URL_Service + config.URL_ApprovalStaffApply,
    data: applyObj,
    method: "PUT",
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS && res.data.data > 0) {
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

module.exports = {
  getUnauditedBusinessList, // 获取待审核商户列表
  rejectBusinessApply, // 拒绝商家申请
  approvalBusinessApply, // 审核通过商家申请

  getUnauditedStaffList, // 获取待审核员工列表
  rejectStaffApply, // 拒绝员工申请
  approvalStaffApply, // 审核通过员工申请
}