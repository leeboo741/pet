const config = require("../../utils/config");
const { RES_CODE_SUCCESS } = require("../../utils/config");
const util = require("../../utils/util");

/**
 * 获取定位周边站点
 * @param {object{latitude, longitude}} location 
 * @param {number} offset 
 * @param {number} limit 
 * @param {function(boolean, object)} callback 
 */
function getStaionByPosition(location, offset, limit, callback) {
  wx.request({
    url: config.URL_Service + config.URL_GetStationListByPosition,
    data: {
      latitude: location.latitude,
      longitude: location.longitude,
      offset: offset,
      limit: limit
    },
    success(res) {
      util.printLog('getStaionByPosition:\n', JSON.stringify(res));
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
      util.printLog('getStaionByPosition:\n', JSON.stringify(res));
      if (util.checkIsFunction(callback)) {
        callback(false, res);
      }
    }
  })
}

/**
 * 通过省份获取省下所有站点
 * @param {string} province 
 * @param {function(boolean, object)} callback 
 */
function getStationListByProvince(province, callback) {
  wx.request({
    url: config.URL_Service + config.URL_GetStationListByProvince,
    data: {
      province: province
    },
    success(res) {
      util.printLog("getStationListByProvince:\n", JSON.stringify(res));
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
      util.printLog("getStationListByProvince:\n", JSON.stringify(res));
      if (util.checkIsFunction(callback)) {
        callback(false, res);
      }
    }
  })
}

/**
 * 查询站点数据的城市分组
 * @param {*} callback 
 */
function getStationCityGroup(callback){
  wx.request({
    url: config.URL_Service + config.URL_GetStationCityGroup,
    success(res) {
      util.printLog("getStationCityGroup:\n", JSON.stringify(res));
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
      util.printLog("getStationCityGroup:\n", JSON.stringify(res));
      if (util.checkIsFunction(callback)) {
        callback(false, res);
      }
    }
  })
}

module.exports ={
  getStaionByPosition, 
  getStationListByProvince,
  getStationCityGroup,
}