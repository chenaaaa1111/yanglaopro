// components/detail-swiper/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pensionImages:Array,
    imgUrl:String,
    curIndex:Number,
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
    durationChange: function (e) {
      this.setData({
        curIndex: e.detail.current + 1
      })
    },
  }
})
