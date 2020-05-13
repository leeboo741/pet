const Cache_Key_OrderTaker = "OrderTakerInfoCache";

/**
 * 获取 存储的提货信息
 * @param cityName 城市名称
 * @return 提货信息
 */
function getOrderTakerInfoWithCityName(cityName) {
  if (cityName == null) {
    throw new Error("getOrderTakerInfoWithCityName cityName 不能为空");
    return {};
  }
  try {
    var orderTakerDict = wx.getStorageSync(Cache_Key_OrderTaker);
    var result = orderTakerDict[cityName];
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
 * @param orderTakerInfo 提货信息
 */
function saveOrderTakerInfoWithCityName(cityName, orderTakerInfo) {
  if (cityName == null) {
    throw new Error("saveOrderTakerInfoWithCityName cityName 不能为空");
    return;
  }
  var orderTakerDict = {};
  try {
    orderTakerDict = wx.getStorageSync(Cache_Key_OrderTaker);
  } catch (e) {

  }
  if (orderTakerDict == null || typeof orderTakerDict != 'object' || orderTakerDict.length <= 0) {
    orderTakerDict = {};
  }
  orderTakerDict[cityName] = orderTakerInfo;

  try {
    wx.setStorageSync(Cache_Key_OrderTaker, orderTakerDict)
  } catch (e) {

  }
}

module.exports={
  getOrderTakerInfoWithCityName: getOrderTakerInfoWithCityName,
  saveOrderTakerInfoWithCityName: saveOrderTakerInfoWithCityName,
}