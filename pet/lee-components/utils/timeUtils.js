/**
 * 获取时间
 * @param targetDate 目标时间 可以为空 Date 类型 或者 毫秒
 * @param yearDuration 年份差距 数字类型 可以为空
 * @param monthDuration 月份差距 数字类型 可以为空
 * @param weekDuration 周差距 数字类型 可以为空
 * @param dayDuration 天差距 数字类型 可以为空
 * @param hourDuration 小时差距 数字类型 可以为空
 * @param minDuration 分钟差距 数字类型 可以为空
 * @param secDuration 秒数差距 数字类型 可以为空
 */
function getDate(targetDate, 
                yearDuration, 
                monthDuration, 
                weekDuration, 
                dayDuration, 
                hourDuration, 
                minDuration, 
                secDuration) {

  let tempDate = new Date();
  if (targetDate != null) {
    tempDate = new Date(targetDate);
  }

  if (yearDuration != null) {
    tempDate.setFullYear(tempDate.getFullYear() + yearDuration);
  }

  if (monthDuration != null) {
    tempDate.setMonth(tempDate.getMonth() + monthDuration);
  }

  if (weekDuration != null) {
    tempDate.setDate(tempDate.getDate() + (7 * weekDuration));
  }

  if (dayDuration != null) {
    tempDate.setDate(tempDate.getDate() + dayDuration);
  }

  if (hourDuration != null) {
    tempDate.setHours(tempDate.getHours() + hourDuration);
  }

  if (minDuration != null) {
    tempDate.setMinutes(tempDate.getMinutes() + minDuration);
  }

  if (secDuration != null) {
    tempDate.setSeconds(tempDate.getSeconds() + secDuration);
  }

  return tempDate;
}

/**
 * 获取月份第一天
 * @param date 目标时间
 */
function getStartDayForMonth(date){
  let startDateOfMonth = date.setDate(1);
  return new Date(startDateOfMonth);
}

/**
 * 获取月份最后一天
 * @param date 目标时间
 */
function getEndDayForMonth(date) {
  let endDateOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0); // 获取本月最后一天
  return new Date(endDateOfMonth);
}

/**
 * 获取月份天数
 * @param date 目标时间
 */
function getDayCountForMonth(date){
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (month == 1 | month == 3 | month == 5 | month == 7 | month == 8 | month == 10 | month == 12) {
    return 31;
  } else if (month == 4 | month == 6 | month == 9 | month == 11) {
    return 30;
  } else {
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0 && year % 3200 != 0) || year % 172800 == 0) {
      return 29;
    } else {
      return 28;
    }
  }
}

/**
 * 获取格式化时间
 * @param date 时间
 * @param format 格式
 * 将 Date 转化为指定格式的String
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)可以用 1-2 个占位符 
 * eg: 
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
function dateFormat(date, format) {
  var o = {
    "M+": date.getMonth() + 1, //月份         
    "d+": date.getDate(), //日         
    "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时         
    "H+": date.getHours(), //小时         
    "m+": date.getMinutes(), //分         
    "s+": date.getSeconds(), //秒       
    "S": date.getMilliseconds() //毫秒         
  };
  var week = {
    "0": "日",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六"
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(format)) {
    format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }  
  return format;       
}

module.exports = {
  getDate: getDate, // 获取时间
  dateFormat: dateFormat, // 获取格式化时间
  getStartDayForMonth: getStartDayForMonth, // 获取当月第一天
  getEndDayForMonth: getEndDayForMonth, // 获取当月最后一天
  getDayCountForMonth: getDayCountForMonth, // 获取当月天数
}