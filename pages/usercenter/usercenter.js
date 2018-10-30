//logs.js
const util = require('../../utils/util.js');
var xlStorage = require('../../models/xlStorage');

Page({
  data: {
    userLoginInfo: {},
  },
  onShow: function () {
    let userLoginInfo = wx.getStorageSync('userLoginInfo');
    this.setData({
      userLoginInfo: userLoginInfo||{}
    });
    // if(!userLoginInfo || !userLoginInfo.token) {
    //   wx.showModal({content: '您还未登录！', showCancel: false, confirmText: '去登录', success: function(){
    //     wx.navigateTo({url:'/pages/loginwx/loginwx?reLaunchUrl=' + '/pages/usercenter/usercenter'});
    //   }})
    // };
  },
  xlGotoLoad(){
    wx.navigateTo({url:'/pages/loginwx/loginwx'});
  },
  xlGotoInfo(){
    if(this.data.userLoginInfo && this.data.userLoginInfo.phone) {
      wx.navigateTo({url:'/pages/userinfo/userinfo'});
    }
  },
  xlGotoXuqiu(){
    if(this.data.userLoginInfo && this.data.userLoginInfo.phone) {
      wx.navigateTo({url:'/pages/demand/demand'});
    }
  },
  xlGotoJigou(){
    if(this.data.userLoginInfo && this.data.userLoginInfo.phone) {
      wx.navigateTo({url:'/pages/collections/organization/organization'});
    }
  },
  xlGotoFuwu(){
    if(this.data.userLoginInfo && this.data.userLoginInfo.phone) {
      wx.navigateTo({url:'/pages/collections/service/service'});
    }
  },
  xlGotoWenjuan(){
      wx.navigateTo({url:'/pages/active/questionnaire/questionnaire'});
  },
  xlGotoTel(){
    wx.makePhoneCall({
      phoneNumber: '010-65883352',
      success(){
      },
      fail(){
        // wx.showModal({
        //   content: '调用电话失败，您可以选择手动拨号',
        //   showCancel: false,
        //   confirmText: '确定',
        //   success: function(res) {
        //   }
        // })
      }
    })
  },
  xlLoginOut(){
    this.setData({
      userLoginInfo: {}
    });
    wx.removeStorageSync('userLoginInfo');
    // wx.navigateTo({url:'/pages/loginwx/loginwx'});
  }
})
