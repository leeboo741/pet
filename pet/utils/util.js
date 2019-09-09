const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 获取 yyyy-mm-dd 格式时间
 */
const formatYMD = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

/**
 * 获取时间和星期几
 */
function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  let yearDate = date.getFullYear();
  let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.time = yearDate + '-' + month + '-' + dayFormate;
  dateObj.week = show_day[day];
  return dateObj;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function checkEmpty(obj) {
  if (obj == null || obj.length <= 0) {
    return true;
  }
  return false;
}

function isVideo(fileAddress) {
  let index = fileAddress.lastIndexOf(".");
  let suffix = fileAddress.substring(index + 1);
  if (suffix == "mp4" ||
      suffix == "mov" ||
      suffix == "m4v" ||
      suffix == "3gp" ||
      suffix == "avi" ||
      suffix == "m3u8" ||
      suffix == "webm"){
    return true;
  }
  return false;
}

function isPhoneAvailable(phone) {
  var myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
  if (!myreg.test(phone)) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  formatTime: formatTime,
  dateLater: dateLater,
  formatYMD: formatYMD,
  checkEmpty: checkEmpty,
  isVideo: isVideo,
  isPhoneAvailable: isPhoneAvailable,
}
