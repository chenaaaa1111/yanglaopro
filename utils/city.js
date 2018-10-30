/**
 * 城市配置数据
 * @type {Array}
 */
var citys = [{
  citycode: "010",
  acronym: "bj",
  abbr: "",
  cityName: "北京",
  apiurl: "https://api.xinyl.cn/010/",
  // apiurl:"http://10.4.18.213:8083/",
  // apiurl:"https://api.xinyl.cn/010/test/",
  configReady: false,
  support:{
    organization:true,
    service:true,
    news:true
  }
}];

var cityInfo = {
  dataReady: true,
};
/**
 * 根据citycode获取城市配置数据
 * @param  {string} code 城市citycode
 * @return {Object}      城市配置节点数据，结构同citys节点结构
 */
function codeGetCityInfo(code) {
  var filters = citys.filter(function(item, index) {
    return item.citycode === code;
  });
  if (filters && filters[0]) {
    return filters[0];
  }
}
/**
 * 根据citycode获取城市简称，如北京简称bj
 * @param  {string} code 城市citycode
 * @return {string}      城市简称
 */
function codeGetAcronym(code) {
  var filters = citys.filter(function(item, index) {
    return item.citycode === code;
  });
  if (filters && filters[0]) {
    return filters[0].acronym;
  }
}
/**
 * 根据citycode获取城市名称
 * @param  {string} code 城市citycode
 * @return {string}      城市名称
 */
function codeGetName(code) {
  var filters = citys.filter(function(item, index) {
    return item.citycode === code;
  });
  if (filters && filters[0]) {
    return filters[0].cityName;
  }
}
/**
 * 根据citycode获取各城市接口地址
 * @param  {string} code 城市citycode
 * @return {Object}      城市各接口地址
 */
function codeGetApiUrl(code) {
  var cityInfo = citys.filter(function(item, index) {
    return item.citycode === code;
  });
  if (cityInfo && cityInfo[0]) {
    let {apiurl, commonApiurl, userApiurl} = cityInfo[0];
    return {
      apiurl,
      commonApiurl,
      userApiurl
    };
  }
}
/**
 * 根据城市名城获取对应城市编号
 * @param  {string} name 城市名称
 * @return {[type]}      城市citycode
 */
function nameGetCode(name) {
  var filters = citys.filter(function(item, index) {
    return item.cityName === name;
  });
  if (filters && filters[0]) {
    return filters[0].citycode;
  }
}
/**
 * 检查指定城市名城的城市配置是否存在
 * @param  {string} name 城市名称
 * @return {boolean}     指定城市是否存在
 */
function nameCheckExistCity(name) {
  if (name === "上海") {
    return false;
  }
  return citys.some(function(item, index) {
    return item.cityName === name;
  });
}
/**
 * 初始化配置数据
 * @param {Object} data 城市列表接口获取的城市配置数据
 */
function setCityInfo(data) {
  if (!data || cityInfo.dataReady) {
    return;
  }
  citys.forEach(function(cItem, cIndex) {
    data.forEach(function(dItem, dIndex) {
      if (dItem.Code === cItem.citycode) {
        cItem.cityName = dItem.CityName;
        cItem.apiurl = dItem.APIUrl;
        cItem.abbr = dItem.Abbr;
        cItem.commonApiurl = dItem.BizcommonUrl;
        cItem.userApiurl = dItem.UserCenterUrl;
        cItem.support={};
      }
    });
  });
  cityInfo.dataReady = true;
}

function codeSetConfig(citycode,data){
  if (!data){
    return ;
  }
  let cityInfo = codeGetCityInfo(citycode);
  if (!cityInfo || cityInfo.configReady){
    return ;
  }
  let mConf = resolveModuleConfig(data);
  let sConf = resolveSwitchConfig(data);
  cityInfo.support = Object.assign(cityInfo.support, mConf, sConf);
  cityInfo.configReady=true;
}

function resolveModuleConfig(data){
  if (!data || !data.Modules){
    return ;
  }
  let modules = data.Modules;
  let config={
    xinfang: false,
    ershoufang: false,
    zufang: false
  };
  modules.forEach((mods,index)=>{
    let modItemList = mods.ModuleItemList;
    if (modItemList){
      modItemList.forEach((mItem,mIndex)=>{
        switch (mItem["Type"]) {
          case MODULE_TYPE_XINFANG:
            config.xinfang = true;
            break;
          case MODULE_TYPE_ERSHOUFANG:
            config.ershoufang = true;
            break;
          case MODULE_TYPE_ZUFANG:
            config.zufang = true;
            break;
        }
      });
    }
  });
  return config;
}

function resolveSwitchConfig(data){
  if (!data || !data.Switches) {
    return;
  }
  let switchs = data.Switches;
  let config = {
    chat: false
  };
  switchs.forEach((swi,index)=>{
    switch (swi["Key"]){
      case KEY_CHAT:
        config.chat = swi["Value"];
      break;
    }
  });
  return config;
}
/**
 * 选择城市
 * @param  {string} citycode 城市编号
 */
function selectCity(citycode) {
  wx.getStorage({
    key: 'selectCity',
    success: function(res) {
      if (res) {
        let cityObj = codeGetCityInfo(citycode);
        if (cityObj && res.citycode !== citycode) {
          wx.setStorage({
            key: 'selectCity',
            data: Object.assign({}, cityObj),
          })
        }
      }
    },
    fail: function() {
      let cityObj = codeGetCityInfo(citycode);
      if (cityObj) {
        wx.setStorage({
          key: 'selectCity',
          data: Object.assign({}, cityObj),
        })
      }
    }
  });
}
/**
 * 获取当前选中城市
 * @return {Object}      城市配置节点数据，结构同citys节点结构
 */
function getSelectCity() {
  return new Promise((resolve, rejected) => {
    wx.getStorage({
      key: 'selectCity',
      success: function(res) {
        return resolve(res);
      },
      fail: function() {
        return rejected('还未选择城市！');
      }
    })
  });
}

module.exports = {
  citys,
  cityInfo,
  codeGetAcronym,
  codeGetName,
  setCityInfo,
  codeGetApiUrl,
  nameGetCode,
  nameCheckExistCity,
  getSelectCity,
  selectCity,
	codeGetCityInfo,
  codeSetConfig
}
