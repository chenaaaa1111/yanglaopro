// components/filtergroup/filtergroup.js
var radiobehavior = require("./../radiobehavior");
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [radiobehavior],
  properties: {
    title:{
      type: String,
      value: "面积",
      observer: function () {
      }
    },
    min:{
      type:String,
      value:"",
      observer:function(){
      }
    },
    max: {
      type: String,
      value: "",
      observer: function () {
      }
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
    minChange:function(e){
      this.triggerEvent("MinChange",{
        value:e.detail.value
      },{});
    },
    maxChange:function(e){
      this.triggerEvent("MaxChange", {
        value: e.detail.value
      }, {});
    }
  },
  ready: function () {
   
  }
})
