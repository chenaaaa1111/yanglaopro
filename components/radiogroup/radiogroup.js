// components/radiogroup/radiogroup.js
var radiobehavior = require("./../radiobehavior");
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [radiobehavior],
  properties: {
    gtype:String,
    extra:String
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

  },
  ready:function(){
    console.log("ready:",this.data);
  }
})
