//测试环境api地址
// const target = 'http://10.4.18.213:8083/';
//预览环境api地址
// const target ="https://api.xinyl.cn/010/test";
// 正式环境api地址
const target ="https://api.xinyl.cn/010";
const ak = 'sNaY0N0xKHjvhz55QTulRT9cNtCLI9qR';
// 融云appkey
const imak = 'n19jmcy59f619';
const version = 'v6';
const platform = 'wechat';

var url = '';
var commonApiurl = '';
var userApiurl = '';
//当前请求的的城市编号与城市名
var nowCityCode = '010';
var nowCityName = '北京';
var nowCityAcronym = 'bj';
//设置默认的城市编号与城市名
const cityCode = '010';
const cityName = '北京';
const cityAcronym = 'bj';

const locateCityName='';
const locateCityCode='';
const locateLatitude ='';
const locateLongitude =''; 

var sem = 'wechat';
var hmpl = '';

var userId = '';
//webapp网页域名
const domain = '';

module.exports = {
	target,
	ak,
	version,
	cityCode,
	cityName,
	cityAcronym,
	nowCityCode,
	nowCityName,
	nowCityAcronym,
	url,
	commonApiurl,
	userApiurl,
	domain,
	platform,
	sem,
	hmpl,
	userId,
  locateCityName,
  locateCityCode,
  locateLatitude,
  locateLongitude
}