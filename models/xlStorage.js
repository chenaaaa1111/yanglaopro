var apis=require("../utils/api.js");

// function getAndSaveCityConfig(){
//     return new Promise(function(resolve, reject) {
//         try {
//             let value = wx.getStorageSync('xlcityConfig');
//             if (value) {
//                 resolve(value);
//             }else {
//                 apis.getDictInfos({ 'types': '1,2,3,4,5,6,7,8,9,10,11,12' }).then((res) => {
//                     wx.setStorageSync('xlcityConfig',res.data);
//                     resolve(res.data);
//                 })
//             }
//         } catch (e) {
//         };
//     });
// };

function getAndSaveCityConfig(){
    return new Promise(function(resolve, reject) {
        try {
            let value = wx.getStorageSync('xlcityConfig');
            if (value) {
                resolve(value);
            }else {
                apis.getCityArea({}).then((res)=>{
                    if(res.data.code == 0) {
                        let areaData = [{
                            firstPY:"",gscopeName:"全市"
                        },...res.data.data]
                        apis.getDictInfos({ 'types': '1,2,3,4,5,6,7,8,9,10,11,12' }).then((res2) => {
                            res2.data.cityArea = areaData;
                            wx.setStorageSync('xlcityConfig',res2.data);
                            resolve(res2.data);
                        })
                    }
                });
            }
        } catch (e) {
        };
    });
};


function xlIsLogined(){
    try {
        let userLoginInfo = wx.getStorageSync('userLoginInfo');
        if(userLoginInfo && userLoginInfo.token) {
            console.log('已经登录');
            return true;
        }else {
            console.log('未登录');
            return false;
        }
    } catch (error) {
        
    }
};

function xlGetUserInfo() {
    try {
        let userLoginInfo = wx.getStorageSync('userLoginInfo');
        return userLoginInfo || {}
    } catch (error) {
        
    }
}

function xlSetUserInfo(data) {
    wx.setStorageSync('userLoginInfo',data);
}

function xlLoginOut() {
    try {
        wx.removeStorageSync('userLoginInfo');
        wx.reLaunch({url:'/pages/loginwx/loginwx'});
    } catch (e) {
    }
}

function getMyLocation(){
    return new Promise(function(resolve, reject) {
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                let data = {
                    lat: res.latitude,
                    lng: res.longitude
                    };
                resolve(data);
            },
            fail: function(){
                reject();
            }
        })
    })
}

function tansformJsonNull(obj){
    for(let attr in obj){
        if(obj[attr]=="null" || obj[attr]==null){obj[attr]=''}
    };
    return obj;
}

function getOrgInfoFromStorage(){
    return new Promise(function(resolve, reject) {
        try {
            let value = wx.getStorageSync('xlOrgInfo') || '';
            resolve(value);
        } catch (e) {
        };
    });
};

function saveOrgInfoFromStorage(data){
    wx.setStorageSync('xlOrgInfo',data);
};

function removeOrgInfoConfig() {
    return {
        type: 1, /** 1机构、2服务 */
        orgName: '',
        contactName: '',
        contactWork: '',
        contactPhone: '',
        smsCode: '',
        contactCertificate: {min: 1, max: 3, datas: []},
        orgLicense: {min: 1, max: 3, datas: []},
        orgAddr: '',
        orgIntroduce: '',
        orgTell: '',
        orgLogo: {min: 0, max: 3, datas: []},
        orgPhotots: {min: 0, max: 3, datas: []},
        orgService: {min: 0, max: 7, datas: []},
    }
};

function userLogin() {
    wx.login({
        success: function(res) {
          if (res.code) {
            apis.userQuikLoginWx({code: res.code}).then((data) => {
              wx.setStorageSync('wxlogintoken',data.data);
            });
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
    });
};

module.exports = {
    getAndSaveCityConfig,
    xlIsLogined,
    xlGetUserInfo,
    xlSetUserInfo,
    xlLoginOut,
    getMyLocation,
    tansformJsonNull,
    getOrgInfoFromStorage,
    saveOrgInfoFromStorage,
    removeOrgInfoConfig,
    userLogin
}