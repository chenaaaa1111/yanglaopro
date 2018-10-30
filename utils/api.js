import { GET, POST, DELETE,UPLOAD} from './network.js';
import config from './config.js';
import city from './city.js';

//获取城市列表
const getCurApiUrl = () => {
  return new Promise((resolve,reject)=>{
    let { apiurl} = city.codeGetApiUrl(config.nowCityCode);
    // console.log("apiurl", apiurl);
    config.url = apiurl;
    config.nowCityAcronym = city.codeGetAcronym(config.nowCityCode);
    return resolve({
      url: config.url,
      acronym: config.nowCityAcronym
    });
  });
}

const getUser = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url +'user/get_user');
});

const userLogin = (params) => getCurApiUrl().then((json) => {
  return POST(params, json.url + 'user/login');
});

const userQuikLogin = (params) => getCurApiUrl().then((json) => {
  return POST(params, json.url + 'user/login_quick');
});

const userQuikLoginWx = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'yuyan/wx_login');
});

const userQuikWxDecode = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'yuyan/wx_decode');
});

const loginOut = (params) => getCurApiUrl().then((json) => {
  return POST(params, json.url + 'user/loginout');
});

const register = (params) => getCurApiUrl().then((json) => {
  return POST(params, json.url + 'user/register');
});

const saveUser = (params) => getCurApiUrl().then((json) => {
  return POST(params, json.url + 'user/save_user');
});

const sendSMS = (params) => getCurApiUrl().then((json) => {
  return POST(params, json.url + 'user/send_sms');
});

const getCityArea = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'yuyan/scope/' + config.nowCityAcronym);
});
/** 服务列表 */
const getFuwuList = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'yuyan/pension_service/' + config.nowCityAcronym);
});
/** 服务详情 */
const getFuwuDetail = (params, id) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'yuyan/service_detail/' + id);
});
const getJigouList = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'yuyan/pension/bj');
});
const getCollectionJigou = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'get_collection_pension');
});
/** 收藏 */
const addCollection = (params) => getCurApiUrl().then((json) => {
  return POST(params, json.url + 'add_collection');
});

const delCollection = (params) => getCurApiUrl().then((json) => {
  return POST(params, json.url + 'cancel_collection');
});

const getCollectionService = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'get_collection_station');
});

/**查询收藏的机构 */
const getCollectionOrganization = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'get_collection_pension');
});

const getDictInfo=(params)=>getCurApiUrl().then((json)=>{
  return POST(params, json.url +'yuyan/get_dictionary');
});

const getDictInfos=(params)=>getCurApiUrl().then((json)=>{
  return GET(params, json.url +'yuyan/get_dictionary_infos');
});

/**获取资讯列表 */
const getNewsList = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'yuyan/news');
});
/**获取资讯详情 */
const getNewsDetail= (params,id) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'yuyan/news_detail/'+id);
});
/**获取资讯类型 */
const getNewsType = (params)=>getCurApiUrl().then((json)=>{
  return GET(params, json.url +'yuyan/newstype');
});
/**获取广告图片 */
const getAdImage = (params) => getCurApiUrl().then((json)=>{
  return GET(params, json.url + 'yuyan/ad_image/' + config.nowCityAcronym);
});
/**获取机构列表 */
const getOrganizationWithFilters = (params) =>getCurApiUrl().then((json) => {
  return GET(params, json.url + 'yuyan/all_pension/' + config.nowCityAcronym);
});
/**获取机构详情 */
const getOrganizationDetails = (params, id) =>getCurApiUrl().then((json) => {
  return GET(params, json.url + 'yuyan/pension_detail/' + id);
}); 
/**获取热门机构 */
const getHotOrganizations = (params)=>getCurApiUrl().then((json)=>{
  return GET(params, json.url + 'yuyan/hot_pension/' + config.nowCityAcronym);
});
/**地图获取机构 */
const mapGetOrganization = (params)=>getCurApiUrl().then((json)=>{
  return GET(params, json.url + 'yuyan/pension_count/' + config.nowCityAcronym);
});

const addFavour = (params) => getCurApiUrl().then((json)=>{
  return POST(params, json.url + 'add_like');
});

const cancelFavour = (params)=>getCurApiUrl().then((json)=>{
  return POST(params, json.url + 'cancel_like');
});

const checkFavour = (params)=>getCurApiUrl().then((json)=>{
  return GET(params, json.url + 'get_like');
});

const addComments = (params)=>getCurApiUrl().then((json)=>{
  return POST(params, json.url + 'add_comment');
});

const getComments = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'get_comment');
});

const getFloatImages = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'yuyan/get_index_pic');
});

/** 机构服务入驻 */
const pensionReside = (params)=>getCurApiUrl().then((json)=>{
  return POST(params, json.url + 'yuyan/pension_reside',{"content-type": "application/json"});
});

const pensionEmail = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'yuyan/pension_email');
});

const addSurvey = (params) => getCurApiUrl().then((json)=>{
  return POST(params, json.url + 'add_survey');
});

const getSurvey = (params) => getCurApiUrl().then((json) => {
  return GET(params, json.url + 'get_survey');
});

const uploadVoice = (params) => getCurApiUrl().then((json)=>{
  let { name, filePath,formData}=params;
  // let url = json.url + 'upload';
  let url = 'http://10.58.8.47:8021/yuyan/voice_discern'
  return UPLOAD(name, filePath,url, formData);
});
/** 上方留了三个案例写法，实际api在本注释之下 */
module.exports = {
  getUser,
  userLogin,
  userQuikLogin,
  userQuikLoginWx,
  userQuikWxDecode,
  loginOut,
  register,
  saveUser,
  sendSMS,
  getCityArea,
  getFuwuList,
  getFuwuDetail,
  getJigouList,
  getCollectionJigou,
  addCollection,
  delCollection,
  getCollectionOrganization,
  getCollectionService,
  getCollectionOrganization,
  getDictInfo,
  getDictInfos,
  getNewsList,
  getNewsDetail,
  getNewsType,
  getAdImage,
  getOrganizationWithFilters,
  getHotOrganizations,
  mapGetOrganization,
  getOrganizationDetails,
  getFloatImages,
  addFavour,
  checkFavour,
  cancelFavour,
  getFloatImages,
  getComments,
  pensionReside,
  pensionEmail,
  addComments,
  addSurvey,
  getSurvey,
  uploadVoice
}