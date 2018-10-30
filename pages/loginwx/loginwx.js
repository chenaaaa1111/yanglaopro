var apis = require('../../utils/api.js');
var xlStorage = require('../../models/xlStorage');
var app = getApp();

Page({
  data: {
    reLaunchUrl: '',
    back: ''
  },
  onLoad: function (option) {
    xlStorage.userLogin();
    this.setData({
      reLaunchUrl: option.reLaunchUrl || '',
      back: option.back || ''
    });
    if(xlStorage.xlIsLogined()) {
      if(!userLoginInfo.name) {
        wx.showModal({content: '您尚未填写用户信息！', showCancel: false, confirmText: '去填写', success: function(){
          wx.redirectTo({url:'/pages/userinfo/userinfo?reLaunchUrl=' + (option.reLaunchUrl || '/pages/index/index')});
        }});
      }else{
        wx.showModal({content: '您已登录！', showCancel: false, confirmText: '去首页', success: function(){
          wx.switchTab({url:'/pages/index/index'});
        }});
      }
    }
  },
  WXLogin(e){
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    try {
      let value = wx.getStorageSync('wxlogintoken');
      if (value) {
        apis.userQuikWxDecode({
          encrypted: e.detail.encryptedData,
          indet: value,
          iv: e.detail.iv
        }).then((res) => {
            wx.hideLoading();
            if(res.data.code == 0) {
              xlStorage.xlSetUserInfo(xlStorage.tansformJsonNull(res.data.data));
              wx.showToast({title:'登录成功！',icon:'none'});
              /** 登录成功后跳转到来源页面，如果没有则跳到默认页面 */
              if(that.data.back == 1) {
                wx.navigateBack({ delta: 1 });
              }else {
                if(res.data.data.userName) {
                  if(that.data.reLaunchUrl) {
                    wx.redirectTo({ url: that.data.reLaunchUrl});
                  }else {
                    wx.switchTab({ url: '/pages/index/index'});
                  }
                }else {
                  wx.redirectTo({url:'/pages/userinfo/userinfo?reLaunchUrl=' + that.data.reLaunchUrl});
                };
              }
            }else {
              // wx.showToast({title: '微信登录失败！',icon:'none'});
              wx.redirectTo({url:'/pages/login/login'});
            }
        });
      }
    } catch (e) {
    };
  }
})
