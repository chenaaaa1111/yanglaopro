//logs.js
const util = require('../../utils/util.js');
var apis = require('../../utils/api.js');
var xlStorage = require('../../models/xlStorage');
var app = getApp()

Page({
  data: {
    userLoginInfo: {},
    useTypeList: ['自己','父母','亲戚','朋友'],
    genderList: ['男','女'],
    serviceDateList: ['近期','3-6个月','大于半年'],
    healthDegreeList: ['自理','半自理','失能','失智'],
    houseNumList: ['一人','二人'],
    addressName: '',
    address: '',
    addressShow: false,
    submited: false,
    filterAreaList: [],
    reLaunchUrl: ''
  },
  onLoad: function (option) {
    let that = this;
    wx.showLoading({
        title: '加载中...',
    });
    let userLoginInfo = wx.getStorageSync('userLoginInfo');
    this.setData({
      reLaunchUrl: option.reLaunchUrl || '',
      userLoginInfo: userLoginInfo||''
    });
    if(!userLoginInfo || !userLoginInfo.token) {
      wx.showModal({content: '您还未登录！', showCancel: false, confirmText: '去登录', success: function(){
        wx.redirectTo({url:'/pages/loginwx/loginwx?reLaunchUrl=' + '/pages/userinfo/userinfo'});
      }})
    }else {
      this.setData({ submited: false });
      xlStorage.getAndSaveCityConfig().then((data)=>{
        wx.hideLoading();
        that.setData({
            filterAreaList: data.cityArea
        });
    });
    }
  },
  /** 单选 */
  xlPickBox1Btn(event){
    let res = this.data.userLoginInfo;
    res[event.target.dataset.pickboxnum] = this.data[event.target.dataset.pickboxnum + 'List'][event.target.dataset.picklistnum];
    this.setData({ userLoginInfo: res });
  },
  xlInputBox1Inp(event){
    let res = this.data.userLoginInfo;
    res[event.target.dataset.xlinputboxnum] = event.detail.value;
    this.setData({ userLoginInfo: res });
  },
  xlSubmitBtnTap(){
    let that = this;
    /** 避免短时重复提交 */
    if(this.data.submited) { return }
    this.setData({ submited: true });
    if(!this.data.userLoginInfo.userName) {
      wx.showModal({
        content: '姓名不能为空！',
        showCancel: false,
        confirmText: '确定',
        success: function(res) {
        }
      })
    }else {
      wx.showLoading({
        title: '加载中...',
      });
      apis.saveUser(this.data.userLoginInfo).then(res=>{
        wx.hideLoading();
        if(res.data.code === 0){
          wx.setStorageSync('userLoginInfo',this.data.userLoginInfo);
          wx.showModal({
              content: '信息保存成功！',
              showCancel: false,
              confirmText: '确定',
              success: function (res) {
                wx.navigateBack();
              }
          });
        }else if(res.data.code === 110) {
          wx.removeStorageSync('userLoginInfo');
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            confirmText: '去登录',
            success: function(res) {
              wx.redirectTo({url:'/pages/loginwx/loginwx?reLaunchUrl=' + that.data.reLaunchUrl});
            }
          })
        }else {
          wx.showModal({
              content: res.data.msg,
              showCancel: false,
              confirmText: '确定',
              success: function (res) {
              }
          });
        }
      }).catch(err=>{
        // wx.showToast({title:'网络错误，请检查网络是否连接！',icon:'none'})
        wx.hideLoading();
      })
    }
  },
  xlAddrBtns(event) {
    let cityname = event.target.dataset.cityname;
    console.log(cityname);
    console.log(event);
    
    this.setData({ address: (cityname == '全市'? '北京市' : '北京市' + cityname), addressName: cityname });
  },
  xlInputAddr(event){
    let address = event.detail.value;
    this.setData({ address });
  },
  showaddress(){
    this.setData({ addressShow: true });
  },
  hideaddress(event){
    if(event.target.dataset.save) {
      let res = this.data.userLoginInfo;
      res.address = this.data.address;
      this.setData({ userLoginInfo: res });
    }
    this.setData({ addressShow: false });
  }
})
