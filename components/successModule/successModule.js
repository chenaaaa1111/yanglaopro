// components/webp/webp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },
  /**
   * 组件的初始数据
   */
  data: {
    url:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  },
  ready() {
    setTimeout(()=>{
      wx.navigateBack({ delta: 1 });
    },3000)
  }
})
