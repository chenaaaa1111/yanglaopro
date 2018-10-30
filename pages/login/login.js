var apis = require('../../utils/api.js');
var xlStorage = require('../../models/xlStorage');
var app = getApp();
Page({
  data: {
    phoneNum: '',
    phoneNumErr: false,
    butMsg: '获取验证码',
    getMsgCodeTimer: '',
    msgCode: '',
    msgCodeErr: false,
    reLaunchUrl: ''
  },
  onLoad: function (option) {
    this.setData({
      reLaunchUrl: option.reLaunchUrl || ''
    });
    let userLoginInfo = wx.getStorageSync('userLoginInfo');
    if(userLoginInfo && userLoginInfo.token) {
      if(userLoginInfo.name) {
        wx.showModal({content: '您尚未填写用户信息！', showCancel: false, confirmText: '去填写', success: function(){
          wx.redirectTo({url:'/pages/userinfo/userinfo?reLaunchUrl=' + (option.reLaunchUrl || '/pages/index/index')});
        }});
      }else {
        wx.showModal({content: '您已登录！', showCancel: false, confirmText: '去首页', success: function(){
          wx.switchTab({url:'/pages/index/index'});
        }});
      }
    };
  },
  xlPhoneInputTap(event){
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
    if (!myreg.test(event.detail.value)) {
      this.setData({
        phoneNum:event.detail.value,
        phoneNumErr: true
      })
    } else {
      this.setData({
        phoneNum:event.detail.value,
        phoneNumErr: false
      })
    } 
  },
  xlMsgInputTap(event){
    let myreg=/^[0-9]{6}$/;  
    if (!myreg.test(event.detail.value)) {  
      this.setData({
        msgCode:event.detail.value,
        msgCodeErr: true
      });
    } else {
      this.setData({
        msgCode:event.detail.value,
        msgCodeErr: false
      });
    } 
  },
  getMsgCode(){
    let time = 10;
    let that = this;
    if(this.data.phoneNumErr || !/^[1][3,4,5,7,8][0-9]{9}$/.test(this.data.phoneNum)) {
      wx.showToast({title:"请输入正确的手机号！",icon:'none'})
    }else {
      if(this.data.butMsg === "获取验证码" && !this.data.getMsgCodeTimer){
        wx.showLoading({
          title: '加载中...',
        });
        /*** 时间计数 */
        this.data.getMsgCodeTimer = setInterval(function(){
          if(time > 0) {
            that.setData({
              butMsg: --time + 's后重新获取'
            })
          }else {
            clearInterval(that.data.getMsgCodeTimer);
            that.setData({
              butMsg: "获取验证码",
              getMsgCodeTimer: ''
            })
          };
        },1000)
        /*** 发送请求 */
        apis.sendSMS({tel:that.data.phoneNum}).then(res=>{
          wx.hideLoading();
          wx.showToast({title:"获取验证码成功！",icon:'none'});
        }).catch(err=>{
          wx.hideLoading();
          wx.showToast({title:"获取验证码失败！",icon:'none'});
        })
      }
    }
  },
  login(){
    let that = this;
    if(this.data.phoneNumErr || !/^[1][3,4,5,7,8][0-9]{9}$/.test(this.data.phoneNum)) {
      wx.showModal({
        content: "请输入正确的手机号！",
        showCancel: false,
        confirmText: '确定',
        success: function(res) {
          this.setData({ phoneNumErr: true })
        }
      })
    }else if(this.data.msgCodeErr || !/^[0-9]{6}$/.test(this.data.msgCode)){
      wx.showModal({
        content: "请输入正确的验证码！",
        showCancel: false,
        confirmText: '确定',
        success: function(res) {
          this.setData({ msgCodeErr: true })
        }
      })
    }else {
      wx.showLoading({
        title: '加载中...',
      });
      apis.userQuikLogin({phone:that.data.phoneNum,code:that.data.msgCode}).then(res=>{
        wx.hideLoading();
        if(res.data.code === 0){
          /** 存储登录信息 */
          let userLoginInfo = xlStorage.tansformJsonNull(res.data.data);
          wx.setStorageSync('userLoginInfo',userLoginInfo);
          wx.showToast({title:'登录成功！',icon:'none'})
          /** 登录成功后跳转到来源页面，如果没有则跳到默认页面 */
          if(that.data.back == 1) {
            wx.navigateBack({ delta: 1 });
          }else {
            if(userLoginInfo.userName) {
              if(that.data.reLaunchUrl) {
                wx.redirectTo({ url: that.data.reLaunchUrl});
              }else {
                wx.switchTab({ url: '/pages/index/index'});
              }
            }else {
              wx.redirectTo({url:'/pages/userinfo/userinfo?reLaunchUrl=' + that.data.reLaunchUrl});
            }
          }
        }else {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            confirmText: '确定',
            success: function(res) {
            }
          })
        }
      }).catch(err=>{
        // wx.showToast({title:'网络错误，请检查网络是否连接！',icon:'none'});
        wx.hideLoading();
      })
    }
  }
})
