const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const dateFormat = (date, fmt) => {
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  }
  return fmt;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//获取url参数
const getUrlParams = (url) => {
  if (!url || url.indexOf("?") == -1) {
    return;
  }
  var params = {};
  var search = url.substring(url.indexOf("?") + 1);
  var fragments = search.split("&");
  fragments.forEach(function(item, index) {
    let entrys = item.split("=");
    let key = entrys[0];
    let value = entrys[1] || '';
    params[key] = value;
  });
  return params;
}
//获取url地址
const getUrlAddress = (url) => {
  if (!url) {
    return;
  }
  var fragments = url.split("?");
  return fragments[0];
}
//合并query参数
const mergeQuerys = (q1, ...rest) => {
  q1 = q1 || {};
  rest.forEach(function(item, index) {
    Object.assign(q1, item);
  });
  return q1;
}
//生成search字符串
const createUrlSearch = (obj) => {
  var keys = Object.keys(obj);
  var frags = [];
  keys.forEach(function(key, index) {
    let value = obj[key];
    if (key && /\S/.test(value)) {
      var frag = key + "=" + obj[key];
      frags.push(frag);
    }
  });
  return "?" + frags.join("&");
}
/**
 * 生成全局唯一标识符
 * @param  {number} len   uuid的长度
 * @param  {number} radix 基数(二进制，十进制，十六进制等)
 * @return {string}       [description]
 */
function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
    i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    // Fill in random data. At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

function extend() {
  if (arguments.length === 0) {
    return;
  }
  var obj = arguments[0];
  for (var i = 1, len = arguments.length; i < len; i++) {
    var other = arguments[i];
    for (var item in other) {
      obj[item] = other[item];
    }
  }
  return obj;
}

module.exports = {
  formatTime: formatTime,
  getUrlParams,
  getUrlAddress,
  mergeQuerys,
  createUrlSearch,
  dateFormat,
  uuid,
  extend
}
