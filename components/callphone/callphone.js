// components/callphone/callphone.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showCallPhone:{
      type: Boolean,
      value: false
    }
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
    phoneCall: function (e) {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.replyPhone,
        success: function () {
          console.log("成功拨打电话");         
        },
      })
      this.setData({
        showCallPhone: false
      })
    },
    OnhideCallPhone: function () {
      this.setData({
        showCallPhone: false
      })
    }
  }
})
