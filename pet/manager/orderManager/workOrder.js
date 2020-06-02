const Cache_Key_OrderTaker = "OrderTakerInfoCache";

const Other_Code = "Other";

/**
 * 获取 存储的提货信息
 * @param cityName 城市名称
 * @return 提货信息
 */
function getOrderTakerInfoWithCityName(cityName, code) {
  if (cityName == null) {
    throw new Error("getOrderTakerInfoWithCityName cityName 不能为空");
    return {};
  }
  if (code == null || code.length <= 0) {
    code = Other_Code;
  }
  try {
    var orderTakerDict = wx.getStorageSync(Cache_Key_OrderTaker);
    var result = orderTakerDict[cityName];
    result = result[code];
    if (result != null) {
      return result;
    }
    return {};
  } catch (e) {
    return {};
  }
}

/**
 * 存储 提货信息
 * 
 * @param cityName 城市名称
 * @param code 航班编码
 * @param orderTakerInfo 提货信息
 */
function saveOrderTakerInfoWithCityName(cityName, code, orderTakerInfo) {
  if (cityName == null) {
    throw new Error("saveOrderTakerInfoWithCityName cityName 不能为空");
    return;
  }
  if (orderTakerInfo == null || typeof orderTakerInfo != 'object') {
    throw new Error("saveOrderTakerInfoWithCityName orderTakerInfo 不能为空,需要是Object对象")
    return;
  }
  if (code == null || code.length <= 0) {
    code = Other_Code;
  }
  var orderTakerDict = {};
  try {
    orderTakerDict = wx.getStorageSync(Cache_Key_OrderTaker);
  } catch (e) {

  }
  if (orderTakerDict == null || typeof orderTakerDict != 'object' || orderTakerDict.length <= 0) {
    orderTakerDict = {};
  }
  if (orderTakerDict[cityName] == null || typeof orderTakerDict[cityName] != 'object' || orderTakerDict[cityName].length <= 0) {
    orderTakerDict[cityName] = {};
  }
  orderTakerDict[cityName][code] = orderTakerInfo;

  try {
    wx.setStorageSync(Cache_Key_OrderTaker, orderTakerDict)
  } catch (e) {

  }
}

/**
 * 获取航空公司编码
 * @param order 订单
 * @return 航空公司编码
 */
function getAirportCompanyCode(order){
  if (order.outTransportInfo.transportNum == null || order.outTransportInfo.transportNum.length <= 0) {
    throw new Error("getAirportCompanyCode 航班号不能为空");
    return;
  }
  if (order.outTransportInfo.transportNum.length < 2) {
    return null;
  }
  if (order.transport.transportType == 3 || order.transport.transportType == 4) {
    var airportNum = order.outTransportInfo.transportNum;
    var tempNum = airportNum.substr(0,2);
    if (/^[a-zA-Z]+$/.test(tempNum)) {
      tempNum = tempNum.toUpperCase();
      return tempNum;
    }
    return null;
  }
  return null;
}

module.exports={
  getOrderTakerInfoWithCityName: getOrderTakerInfoWithCityName,
  saveOrderTakerInfoWithCityName: saveOrderTakerInfoWithCityName,
  getAirportCompanyCode: getAirportCompanyCode
}