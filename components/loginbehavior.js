module.exports = Behavior({
  behaviors: [],
  properties: {
    type: {
      type: String,
      value: '',
      observer: function (oldVal, newVal) {

      }
    },
    itemId: {
      type: String,
      value: '',
      observer: function (oldVal, newVal) {

      }
    },
    itemType: {
      type: String,
      value: '',
      observer: function (oldVal, newVal) {

      }
    },
    selected: {
      type: Boolean,
      value: false,
      observer: function (oldVal, newVal) {

      }
    }
  },
  data: {
  },
  attached: function () { },
  methods: {
    onRadioButtonTap: function (e) {
      console.log("this.data:", this.data);
      let t = this;
      let selected = e.detail.selected;
      let { itemId, itemType } = this.data;
      this.checkLogin().then((res) => {
        if (res && res.phone && res.token) {
          this.actionSuccess(selected, itemId, itemType, res.phone, res.token);
        } else {
          t.setData({
            selected: !selected
          });
          this.showLoginModal();
        }
      });
    },
    checkLogin: function (selected, itemId, itemType, token, phone) {
      return new Promise((resolve, rejected) => {
        wx.getStorage({
          key: 'userLoginInfo',
          success: function (res) {
            if (res && res.data) {
              let userInfo = res.data;
              if (userInfo.token) {
                resolve(userInfo);
              } else {
                resolve(false);
              }
            }
          },
          fail: function (res) {
            resolve(false);
          }
        });
      });
    },
    showLoginModal: function () {
      wx.showModal({
        content: '您还未登录',
        showCancel: true,
        cancelText: '取消',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/loginwx/loginwx?back=1',
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    }
  }
})