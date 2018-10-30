  //app.js
var api=require("./utils/api.js");

App({
  onLaunch: function (ops) {
    wx.removeStorageSync('xlcityConfig');
    wx.removeStorageSync('serviceFilterObj');
    wx.removeStorageSync('xlOrgInfo');
  },
  globalData: {
    userInfo: null
  },
  onError:function(res){
    console.log("***************"+res);
  }
})