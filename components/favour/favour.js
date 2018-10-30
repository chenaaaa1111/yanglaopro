// components/favour/favour.js
var loginbehavior = require("./../loginbehavior");
var api=require('./../../utils/api.js');
Component({
  behaviors: [loginbehavior],
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    actionSuccess: function (selected, itemId, itemType,phone,token){
      let params = {
        phone: phone,
        itemId: itemId,
        itemType: itemType,
        token: token
      };
      if (selected) {
        api.addFavour(params).then((res) => {
          console.log("已喜欢:",res);
          if(res&&res.data&&res.data.code==0){
            console.log("jjjjj");
            wx.showToast({
              title: '已喜欢',
              icon:'success'
            });
          }else if(res.data.code==110){
            wx.removeStorage({
              key: 'userLoginInfo',
              success:  (res)=> {
                this.showLoginModal();
              }
            });
            this.setData({
              selected: !selected
            });
          }
        });
      } else {
        api.cancelFavour(params).then((res) => {
          if (res && res.data && res.data.code == 0){
            wx.showToast({
              title: '取消喜欢',
            });
          }else{
            wx.removeStorage({
              key: 'userLoginInfo',
              success: (res) => {
                this.showLoginModal();
              }
            });
            this.setData({
              selected: !selected
            });
          }
        });
      }
    }
  }
})
