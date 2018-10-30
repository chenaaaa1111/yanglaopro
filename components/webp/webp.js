// components/webp/webp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src:{
      type: String, 
      value: '',
      observer: function (newVal, oldVal) {
        var t=this;
        wx.getSystemInfo({
          success: function (res) {
            if (res.platform == "android") {
              t.setData({
                url: newVal + "?f=webp"
              });
            } else {
              t.setData({
                url: t.data.src
              });
            }
          }
        });
      }
    },
    mode:{
      type:String,
      value:'scaleToFill',
      observer:function(newVal,oldVal){
      }
    }
  },
  externalClasses: ["imgstyle"],
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
    loadError:function(e){
      this.triggerEvent('error',{},{});
    }
  },
  ready:function(){
    var t=this;
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "android") {
          t.setData({
            url: t.data.src+ "?f=webp"
          });
        }else{
          t.setData({
            url: t.data.src
          });
        }
      }
    });
  }
})
