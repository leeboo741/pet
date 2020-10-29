const { RES_CODE_SUCCESS } = require("../../utils/config");
const util = require("../../utils/util");
const config = require("../../utils/config");
const loginUtils = require("../../utils/loginUtils");

/**
 * 获取始发城市列表
 * @param {function(boolean, object)} callback 
 */
function getStartCityData(callback){
  wx.request({
    url: config.URL_Service + config.URL_StartCity,
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS) {
        if (util.checkIsFunction(callback)) {
          callback(true, res.data.data)
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
 * 获取目的城市列表
 * @param {string} startCity 起始城市
 * @param {function(boolean, object)} callback 回调
 */
function getEndCityData(startCity, callback) {
  wx.request({
    url: config.URL_Service + config.URL_EndCity,
    data: {
      "startCity":startCity
    },
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS) {
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
 * 获取保价费率
 * @param {string} cityName 城市名称
 * @param {function(boolean, object)} callback 回调 
 */
function getInsurePriceRate(cityName, callback) {
  wx.request({
    url: config.URL_Service + config.URL_InsureRate,
    data: {
      "startCity": cityName
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
 * 查询预估价格
 * @param {object} paramObj 查询条件 
 * @param {function(boolean, object)} callback 回调 
 */
function getPredictPrice(paramObj, callback) {
  wx.request({
    url: config.URL_Service + config.URL_PredictPrice,
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
    },
  })
}

/**
 * 获取可用运输方式
 * @param {string} startCity 开始城市
 * @param {string} endCity 结束城市
 * @param {function(boolean, object)} callback 回调 
 */
function getAbleTransportType(startCity, endCity, callback) {
  wx.request({
    url: config.URL_Service + config.URL_AbleTransportType,
    data: {
      "startCity" : startCity,
      "endCity" : endCity,
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
    },
  })
}

/**
 * 获取宠物类型
 * @param {function(boolean, object)} callback 
 */
function getPetType(callback){
  wx.request({
    url: config.URL_Service + config.URL_PetType, 
    success: res => {
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
 * 获取宠物品种
 * @param {string} keyword 关键字
 * @param {function(boolean, object)} callback 回调
 */
function getPetClassify(keyword, callback) {
    wx.request({
      url: config.URL_Service + config.URL_GetPetClassifyListByKeyword + keyword,
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
 * 查询宠物箱是否可用
 * @param {string} startCity 开始城市
 * @param {string} endCity 结束城市
 * @param {string} transportId 运输方式id
 * @param {function(boolean, object)} callback 回调 
 */
function checkPetCageAble(startCity, endCity, transportId, callback) {
  wx.request({
    url: config.URL_Service + config.URL_MaxWeight,
    data: {
      startCity: startCity,
      endCity: endCity,
      transportType: transportId,
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
 * 查询宠物箱是否可用
 * @param {string} startCity 开始城市
 * @param {string} endCity 结束城市
 * @param {string} transportId 运输方式id
 * @param {function(boolean, object)} callback 回调 
 */
function getMaxWeight(startCity, endCity, transportId, callback) {
  wx.request({
    url: config.URL_Service + config.URL_AblePetCage,
    data: {
      startCity: startCity,
      endCity: endCity,
      transportType: transportId
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
 * 查询送宠|接宠可用站点
 * @param {string} cityName 城市名
 * @param {number} type 类型 0 接宠 1 送宠
 * @param {function(boolean, object)} callback 回调 
 */
function checkAbleStation(cityName, type, callback) {
  let urlStr = config.URL_Service + config.URL_AbleStation_Receipt;
  if (type == 1) {
    urlStr = config.URL_Service + config.URL_AbleStation_Send;
  }
  wx.request({
    url: urlStr,
    data: {
      "cityName": cityName 
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
 * 获取当前城市的站点电话
 * @param {string} cityName 城市名
 * @param {function(boolean, object)} callback 回调 
 */
function getStorePhoneByCityName(cityName, callback) {
  wx.request({
    url: config.URL_Service + config.URL_GetStorePhoneByCityName,
    data: {
      cityName: cityName
    },
    success(res){
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
 * 订单下单
 * @param {object} orderParamObj 下单参数对象
 * @param {function(boolean, object)} callback 回调
 */
function order(orderParamObj, callback) {
  wx.request({
    url: config.URL_Service + config.URL_Order,
    method: "POST",
    data: orderParamObj,
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
    },
  })
}

/**
 * 获取站点电话
 * @param {string} stationNo 站点编号
 * @param {function(boolean, object)} callback 回调
 */
function getStationPhone(stationNo, callback) {
  wx.request({
    url: config.URL_Service + config.URL_GetStationPhone,
    data: {
      stationNo: stationNo
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
 * 修改订单联系人
 * @param {object} paramObj 参数对象
 * @param {function(boolean, object)} callback 回调
 */
function editOrderContacts(paramObj, callback){
  wx.request({
    url: config.URL_Service + config.URL_EditOrderContacts,
    data: paramObj,
    method: "PUT",
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
 * 提交订单评价
 * @param {object} submitObj 提交数据
 * @param {function(boolean, object)} callback 回调
 */
function submitOrderEvaluate(submitObj, callback) {
  wx.request({
    url: config.URL_Service + config.URL_Order_Evalueate,
    data: submitObj,
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
    },
  })
}

/**
 * 通过订单编号查询订单
 * @param {string} searchKeyword 关键字
 * @param {function(boolean, object)} callback 回调
 */
function getOrderByOrderNo(searchKeyword, callback) {
  wx.request({
    url: config.URL_Service + config.URL_GetOrderNoByOrderNo,
    data: {
      customerNo: loginUtils.getCustomerNo(),
      orderNo: searchKeyword
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
 * 取消订单 
 * @param {string} orderNo 订单编号
 * @param {function(boolean, object)} callback 回调
 */
function cancelOrder(orderNo, callback) {
  wx.request({
    url: config.URL_Service + config.URL_CancelOrder,
    data: {
      customerNo: loginUtils.getCustomerNo(),
      orderNo: orderNo
    },
    method: "POST",
    header: {
      'content-type': "application/x-www-form-urlencoded"
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
 * 获取用户订单列表
 * @param {string} orderStatus 订单状态
 * @param {function(boolean, object)} callback 回调
 */
function getCustomerOrderList(orderStatus, callback) {
  wx.request({
    url: config.URL_Service + config.URL_GetOrderListByOrderStatus,
    data: {
      "orderStatus": orderStatus,
      "customerNo": loginUtils.getCustomerNo()
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
 * 检查订单是否可确认收货
 * @param {string} orderNo 订单编号
 * @param {string} customerNo 客户编号
 * @param {function(boolean, object)} callback 回调
 */
function checkOrderConfirmReceiveAble(orderNo, customerNo, callback) {
  wx.request({
    url: config.URL_Service + config.URL_CheckConfirm,
    data: {
      orderNo : orderNo,
      customerNo: customerNo 
    },
    success (res) {
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
    fail (res) {
      if (util.checkIsFunction(callback)) {
        callback(false, res);
      }
    }
  })
}

/**
 * 确认订单条款
 * @param {string} orderNo 订单编号
 * @param {function(boolean, object)} callback 回调
 */
function confirmOrderCondition(orderNo, callback) {
  wx.request({
    url: config.URL_Service + config.URL_Order_Confirm_Condition + "/?orderNo=" + orderNo,
    method: 'POST',
    success(res) {
      if (res.data.code == RES_CODE_SUCCESS) {
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

module.exports = {
  getStartCityData, // 获取始发城市列表
  getEndCityData, // 获取目的城市列表
  getInsurePriceRate, // 获取保价费率
  getPredictPrice, // 查询预估价格
  getAbleTransportType, // 获取可用运输方式
  getPetType, // 获取宠物类型
  getPetClassify,// 获取宠物品种
  checkPetCageAble, // 查询是否可用宠物箱
  getMaxWeight, // 查询最大允许重量
  checkAbleStation, // 查询送宠|接宠可用站点
  getStorePhoneByCityName, // 获取当前城市的站点电话
  order, // 订单下单
  getStationPhone, // 获取站点电话
  editOrderContacts, // 编辑订单联系人
  submitOrderEvaluate, // 提交订单评价
  getOrderByOrderNo, // 通过订单编号查询订单
  cancelOrder, // 取消订单
  getCustomerOrderList, // 获取客户订单列表
  checkOrderConfirmReceiveAble, // 检查订单是否可确认收货
  confirmOrderCondition, // 确认订单条款
}