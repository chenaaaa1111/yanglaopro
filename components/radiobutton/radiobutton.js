// components/radiobutton/radiobutton.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type:String,
      value:'',
      observer: function () {

      }
    },
    selected:{
      type:Boolean,
      value:false,
      observer:function(){

      }
    },
    label:{
      type:String,
      value:'',
      observer:function(){

      }
    },
    selectedLabel:{
      type:String,
      value:'',
      observer: function () {

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    text:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap:function(e){
      console.log('onTap');
      let selected=!this.data.selected;
      let label = selected ? (this.data.selectedLabel || this.data.label) :this.data.label;
      this.setData({
        selected: selected,
        text: label
      });
      this.triggerEvent('select',{
        selected:selected
      },{});
    }
  },
  ready:function(){
    let selected = this.data.selected;
    let label = selected ? (this.data.selectedLabel||this.data.label) : this.data.label;
    this.setData({
      text:label
    });
  }
})
