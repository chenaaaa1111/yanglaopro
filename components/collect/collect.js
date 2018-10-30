// components/collect/collect.js
var loginbehavior = require("./../loginbehavior");
var api = require('./../../utils/api.js');
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
    actionSuccess: function (selected, itemId, itemType, phone, token) {
      let params = {
        phone: phone,
        itemId: itemId,
        itemType: itemType,
        token: token
      };
      if (selected) {
        api.addCollection(params).then((res) => {
          if (res && res.data && res.data.code == 0) {
            wx.showToast({
              title: '已收藏',
              icon: 'success'
            });
          } else if (res.data.code == 110) {
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
      } else {
        api.delCollection(params).then((res) => {
          if (res && res.data && res.data.code == 0) {
            wx.showToast({
              title: '取消收藏'
            });
          } else if (res.data.code == 110) {
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
