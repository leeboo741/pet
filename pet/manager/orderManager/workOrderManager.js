const config = require("../../utils/config")
const loginUtils = require("../../utils/loginUtils")
const { RES_CODE_SUCCESS } = require("../../utils/config")
const util = require("../../utils/util")

/**
 * 删除订单
 * @param {string} orderNo // 订单编号
 * @param {function(boolean, object)} callback // 回调
 */
function deleteOrder(orderNo, callback) {
  wx.request({
    url: config.URL_Service + config.URL_DeleteOrder + '?orderNo=' + orderNo + '&customerNo=' + loginUtils.getCustomerNo(),
    method:'DELETE',
    header: {'content-type': 'application/x-www-form-urlencoded'},
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS && res.data.data == true) {
        if (util.checkIsFunction(callback)) {
          callback(true, res.data.data);
        }
      } else {
        if (util.checkIsFunction(callback)) {
          callback(false, res);
        }
      }
    },
    fail(res){
      if (util.checkIsFunction(callback)) {
        callback(false, res);
      }
    }
  })
}

/**
 * 获取订单列表 -- 未付款， 全部
 * @param {array<string>} stateList // 订单状态
 * @param {number} offset // 偏移
 * @param {number} limit // 页长
 * @param {string} keyword // 关键字
 * @param {string(yyyy-MM-dd)} orderDate // 订单日期 
 * @param {function(boolean, object)} callback  // 回调
 */
function getOrderList_1(stateList, offset, limit, keyword, orderDate, callback){
  let data = {
    stationNo: loginUtils.getStationNo(),
    state: stateList,
    offset: offset,
    limit: limit,
    keyword: keyword,
    orderDate: orderDate,
    customerNo: loginUtils.getCustomerNo()
  };
  wx.request({
    url: config.URL_Service + config.URL_Order_Station_All,
    data: data,
    success(res) {
      console.log("请求未付单据 success：\n" + JSON.stringify(res));
      if (res.data.code == config.RES_CODE_SUCCESS) {
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
 * 出入港 订单 param 对象
 */
class GetOrderParam{
  constructor(orderNo, orderTypeArray, startOrderTime, endOrderTime, startLeaveTime, endLeaveTime, endCity, name, phone, code, offset, limit) {
    this.staffNo = loginUtils.getStaffNo();
    this.stationNo = loginUtils.getStationNo();
    this.orderNo = orderNo?orderNo:'';
    this.orderTypeArray = orderTypeArray?orderTypeArray:[];
    this.startOrderTime = startOrderTime?startOrderTime:'';
    this.endOrderTime = endOrderTime?endOrderTime:'';
    this.startLeaveTime = startLeaveTime?startLeaveTime:'';
    this.endLeaveTime = endLeaveTime?endLeaveTime:'';
    this.endCity = endCity?endCity:'';
    this.name = name?name:'';
    this.phone = phone?phone:'';
    this.code = code?code:'';
    this.offset = offset?offset:0;
    this.limit = limit?limit:20;
  }
}

/**
 * 获取订单列表 -- 出入港
 * @param {GetOrderParam} getOrderParam 查询条件 
 * @param {function(boolean, object)} callback 回调
 */
function getOrderList_2(getOrderParam, callback) {
  if (!(getOrderParam instanceof GetOrderParam)) {
    throw new Error('请使用 GetOrderParam 对象');
  }
  wx.request({
    url: config.URL_Service + config.URL_GetInOrOutHarbourList,
    data: {
      queryParamStr: JSON.stringify(getOrderParam)
    },
    success(res) {
      console.log("请求工作单 success：\n" + JSON.stringify(res));
      if (res.data.code == RES_CODE_SUCCESS) {
        if (util.checkIsFunction(callback)) {
          callback(true, res.data.data);
        }
      } else {
        if (util.checkIsFunction(callback)) {
          callback(false, res)
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
 * 查询订单 -- 全部
 * @param {GetOrderParam} getOrderParam // 查询条件
 * @param {function(boolean, object)} callback 回调
 */
function getOrderList_3(getOrderParam, callback) {
  if (!(getOrderParam instanceof GetOrderParam)) {
    throw new Error('请使用 GetOrderParam 对象');
  }
  wx.request({
    url: config.URL_Service + config.URL_GetStationAllOrder,
    data: {
      queryParamStr: JSON.stringify(getOrderParam)
    },
    success(res) {
      if (res.data.code == config.RES_CODE_SUCCESS) {
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
      if(util.checkIsFunction(callback)) {
        callback(false, res);
      }
    }
  })
}

/**
 * 订单改价
 * @param {string} orderNo // 订单编号
 * @param {number} paymentAmount // 改价金额
 * @param {function(boolean, object)} callback // 回调 
 */
function changeOrderPrice(orderNo, paymentAmount, callback) {
  wx.request({
    url: config.URL_Service + config.URL_ChangeOrderPrice,
    data: {
      orderNo: orderNo,
      paymentAmount: paymentAmount
    },
    method: "PUT",
    success(res) {
      console.log("确认改价 success: \n" + JSON.stringify(res));
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
 * 订单运输信息
 */
class PostTransportInfo{
  constructor(orderNo, transportType, expressNum, transportNum, startCity, endCity, dateTime){
    this.order = {
      orderNo: orderNo
    };
    this.staff = {
      staffNo: loginUtils.getStaffNo(),
      phone: loginUtils.getPhone()
    };
    this.transportType = transportType;
    this.expressNum = expressNum;
    this.transportNum = transportNum;
    this.startCity = startCity;
    this.endCity = endCity;
    this.dateTime = dateTime
  }
}

/**
 * 添加订单运输信息
 * @param {PostTransportInfo} postTransportInfo // 订单运输信息
 * @param {function(boolean, object)} callback // 回调
 */
function addPostTransportInfo(postTransportInfo, callback){
  wx.request({
    url: config.URL_Service + config.URL_PostTransportInfo,
    data: postTransportInfo,
    method: "POST",
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
 * 获取默认订单提货配置
 * @param {string} orderNo 订单编号
 * @param {string} code 航班号/车次好
 * @param {function(boolean, object)} callback 回调
 */
function getDefaultOrderTakerInfo(orderNo, code , callback) {
  wx.request({
    url: config.URL_Service + config.URL_GetDefaultOrderTakerInfo(orderNo, code),
    success(res) {
      console.log ("获取默认提货信息配置success: " + JSON.stringify(res));
      if (res.data.code == config.RES_CODE_SUCCESS) {
        if (util.checkIsFunction(callback)){
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
 * 提交订单提货配置
 * @param {object} orderTakerInfo // 提货配置
 * @param {function(boolean, object)} callback 
 */
function addOrderTakerInfo(orderTakerInfo, callback) {
  wx.request({
    url: config.URL_Service + config.URL_PostOrderTakerInfo,
    method: "POST", // 请求方式
    data: orderTakerInfo,
    success(res) {
      if (res.data.code == config.RES_CODE_SUCCESS) {
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
    },
  })
}

/**
 * 出入港
 * @param {array<string>} fileList 
 * @param {number} sn 
 * @param {string} orderNo 
 * @param {string} orderType 
 * @param {function(boolean, object)} callback 
 */
function inOrOutHarbour(fileList, sn, orderNo, orderType, callback) {
  wx.request({
    url: config.URL_Service + config.URL_ConfirmInOutHarbour,
    method: "POST", // 请求方式
    data: {
      fileList: fileList,
      sn: sn,
      orderNo: orderNo,
      orderType: orderType,
    },
    success(res) {
      wx.hideLoading();
      console.log("确定入港 success: \n" + JSON.stringify(res));
      if (res.data.code == config.RES_CODE_SUCCESS) {
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
 * 添加订单备注
 * @param {string} orderNo 订单编号
 * @param {string} remark 备注
 * @param {function(boolean, object)} callback 回调 
 */
function addOrderRemark(orderNo, remark, callback) {
  wx.request ({
    url: config.URL_Service + config.URL_PostOrderRemark,
    data: {
      order: {
        orderNo: orderNo
      },
      staff: loginUtils.getStaffInfo(),
      remarks: remark
    },
    method: 'POST',
    success(res) {
      if (res.data.code == config.RES_CODE_SUCCESS && res.data.data > 0) {
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
 * 修改待签收状态为派送中
 * @param {string} orderNo 订单编号
 * @param {string} recipientName 收件人名称
 * @param {string} recipientPhone 收件人电话
 * @param {string} address 收件人地址
 * @param {function(boolean, object)} callback 回调 
 */
function changeOrderDeliver(orderNo, recipientName, recipientPhone, address, callback) {
  wx.request({
    url: config.URL_Service + config.URL_ChangeToDeliver,
    data: {
      order:{
        orderNo: orderNo
      },
      recipientName: recipientName,
      recipientPhone: recipientPhone,
      address: address,
    },
    method: 'POST',
    success(res) {
      if (res.data.code == config.RES_CODE_SUCCESS && res.data.data > 0) {
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
 * 取消补价单
 * @param {string} billNo 补价单编号
 * @param {function(boolean, object)} callback 回调
 */
function cancelPremium(billNo, callback){
  wx.request({
    url: config.URL_Service + config.URL_CancelPremium,
    data: billNo,
    method:"PUT",
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
 * 新增补价单
 * @param {object} paramObj 参数对象
 * @param {function(boolean, object)} callback 回调
 */
function addNewPremium(paramObj, callback) {
  wx.request({
    url: config.URL_Service + config.URL_Premium,
    data: paramObj,
    method: "POST",
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
 * 提交付款凭证
 * @param {string} orderNo 订单编号
 * @param {string} paymentVoucher 凭证地址
 * @param {function(boolean, object)} callback 回调
 */
function submitPaymentVoucher(orderNo, paymentVoucher, callback) {
  wx.request({
    url: config.URL_Service + config.URL_Add_PaymentVoucher,
    data: {
      orderNo: orderNo,
      paymentVoucher: paymentVoucher
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
 * 申请退款
 * @param {string} orderNo 订单编号
 * @param {number} amount 退款金额
 * @param {string} reason 退款原因
 * @param {function(boolean, object)} callback 回调
 */
function submitRefund(orderNo, amount, reason, callback) {
  wx.request({
    url: config.URL_Service + config.URL_OrderRefund,
    data: {
      order: {
        orderNo: orderNo,
      },
      staff: {
        staffNo: loginUtils.getStaffNo(),
      },
      serviceFeeAmount: amount==null?0:amount,
      refundReason: reason
    },
    method: "POST",
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

module.exports={
  deleteOrder, // 删除订单

  getOrderList_1, // 获取订单列表 -- 未付款
  getOrderList_2, // 获取订单列表 -- 出入港
  getOrderList_3, // 获取订单列表 -- 全部

  changeOrderPrice, // 订单改价
  addPostTransportInfo, // 添加订单运输信息
  getDefaultOrderTakerInfo, // 获取默认订单提货配置
  addOrderTakerInfo, // 提交订单提货配置
  addOrderRemark, // 添加订单备注

  inOrOutHarbour, // 订单出入港

  changeOrderDeliver, // 修改待签收状态为派送中

  GetOrderParam, // 出入港 订单 param 对象
  PostTransportInfo, // 订单运输信息 对象

  cancelPremium, // 取消补价单
  addNewPremium, // 新增补价单

  submitPaymentVoucher, // 提交付款凭证

  submitRefund, // 提交退款申请
}