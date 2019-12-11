/**
 * 点亮 对象 
 * 
 * @param year 年
 * @param month 月
 * @param day 日
 * @param lightingType 点亮类型 default 灰色 | warning 红色 | alert 黄色 | remind 蓝色 | complete 绿色 
 */
var LightingDayObj = function (year, month, day, lightingType) {
  if (year != null) {
    this.year = year;
  } else {
    this.year = 0;
  }
  if (month != null) {
    this.month = month;
  } else {
    this.month = 0;
  }
  if (day != null) {
    this.day = day;
  } else {
    this.day = 0;
  }
  if (lightingType != null) {
    this.lightingType = lightingType;
  } else {
    this.lightingType = "default";
  }
}

/**
 * 点亮对象 方法
 * @function 比较日期是否相同 
 */
LightingDayObj.prototype = {
  compareDateSame: function (year, month, day) {
    if (this.year != year) {
      return false;
    }
    if (this.month != month) {
      return false;
    }
    if (this.day != day) {
      return false;
    }
    return true;
  },
}

module.exports = {
  LightingDayObj: LightingDayObj, // 点亮
}