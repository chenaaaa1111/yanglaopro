// components/ad-dialog/adDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowAd: {
      type: Boolean,
      value: true
    },
    adImg_url: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeAd: function() {
      this.setData({
        isShowAd: false
      })
    },
    // toadDetail: function(event) {
    //   wx.navigateTo({
    //     url: '/pages/active/alzheimer/alzheimer'
    //   })
    // }
  }
})