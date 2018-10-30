// components/multifiltergroup/multifiltergroup.js
var checkbehavior = require("./../checkbehavior");
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [checkbehavior],
  properties: {
    title: {
      type: "string",
      value: "面积",
      observer: function () { }
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

  }
})
