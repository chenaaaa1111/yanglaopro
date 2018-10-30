const apis = require('../../utils/api.js');
var xlStorage = require('../../models/xlStorage');

Page({
  data: {
    serviceArea: [],
    servicePrice:['不限','3000以下','3000-6000','6000-9000','9000-12000','12000以上'],
    serviceContent:['日间照料','短托服务','老年餐','送餐服务','助浴服务','维修服务','理疗服务','无障碍出行','适老化改造','体验服务'],
    serviceRange:['不限','1公里内','3公里内','5公里内','本市内','本市周边'],
    serviceContentData: [],
    userLoginInfo: '',
    submited: false
  },
  onLoad: function () {
    let userLoginInfo = wx.getStorageSync('userLoginInfo');
    this.setData({
      userLoginInfo: userLoginInfo||''
    });
    if(!userLoginInfo || !userLoginInfo.token) {
      wx.showModal({content: '您还未登录！', showCancel: false, confirmText: '去登录', success: function(){
        wx.redirectTo({url:'/pages/loginwx/loginwx?reLaunchUrl=' + '/pages/demand/demand'});
      }})
    };
    /** 初始化选项 */
    wx.showLoading({
        title: '加载中...',
    });
    apis.getCityArea({}).then((res)=>{
      wx.hideLoading();
      if(res.data.code == 0) {
        let allFilter = {
          firstPY:"",gscopeName:"全市"
        };
        this.setData({
          serviceArea: [allFilter,...res.data.data]
        });
      }else {
        wx.showModal({
          content: res.data.msg,
          showCancel: false,
          confirmText: '去登录',
          success: function(res) {
            wx.redirectTo({url:'/pages/loginwx/loginwx?reLaunchUrl=' + '/pages/demand/demand'});
          }
        })
      }
    });
    let serviceContentData = [];
    this.data.serviceContent.forEach((item,index) => {
      let res1 = false;
      if(this.data.userLoginInfo.serviceContent) {
        this.data.userLoginInfo.serviceContent.split(',').forEach((item2,index2) => {
          if(item2 == item) { res1 = true }
        });
        serviceContentData.push(res1);
      }
    });
    this.setData({
      serviceContentData: serviceContentData
    });
  },
  /** 多选 */
  xlPickBox2Btn(event){
    let that = this;
    let resArr = this.data[event.target.dataset.pickboxnum + 'Data'];
    resArr[event.target.dataset.picklistnum] = !resArr[event.target.dataset.picklistnum];
    if(!resArr.find((n)=>{return n})){resArr[event.target.dataset.picklistnum] = !resArr[event.target.dataset.picklistnum];}
    let res = this.data.userLoginInfo;
    let res2 = [];
    this.data.serviceContentData.forEach((item,index) => {
      if(item){ res2.push(that.data.serviceContent[index])}
    });
    res[event.target.dataset.pickboxnum] = res2.join(',');
    this.setData({
      [event.target.dataset.pickboxnum + 'Data']: resArr,
      userLoginInfo: res
    });
  },
  /** 单选 */
  xlPickBox1Btn(event){
    let res = this.data.userLoginInfo;
    res[event.target.dataset.pickboxnum] = this.data[event.target.dataset.pickboxnum][event.target.dataset.picklistnum];
    this.setData({ userLoginInfo: res });
  },
  /** 城市特殊单选 */
  xlPickBox3Btn(event){
    let res = this.data.userLoginInfo;
    res[event.target.dataset.pickboxnum] = this.data[event.target.dataset.pickboxnum][event.target.dataset.picklistnum].gscopeId;
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
    if(that.data.submited) { return }
    that.setData({ submited: true });
    wx.showLoading({
        title: '加载中...',
    });
    apis.saveUser(that.data.userLoginInfo).then(res=>{
      wx.hideLoading();
      if(res.data.code === 0){
        wx.setStorageSync('userLoginInfo',that.data.userLoginInfo);
        wx.showModal({
            content: '需求信息保存成功！',
            showCancel: false,
            confirmText: '确定',
            success: function (res) {
              wx.navigateBack();
            }
        });
      }else if(res.data.code === 110){
        /** token验证失败 */
        wx.removeStorageSync('userLoginInfo');
        wx.showModal({
          content: 'token验证失败,请重新登录！',
          showCancel: false,
          confirmText: '确定',
          success: function(res) {
            wx.redirectTo({url:'/pages/loginwx/loginwx?reLaunchUrl=/pages/demand/demand'});
          }
        })
      }else {
        wx.showModal({
          content: res.data.msg,
          showCancel: false,
          confirmText: '确定',
          success: function(res) {
          }
        })
      }
      that.setData({ submited: false });
    }).catch(err=>{
      // wx.showToast({title:'网络错误，请检查网络是否连接！',icon:'none'})
      that.setData({ submited: false });
    })
  }
})
