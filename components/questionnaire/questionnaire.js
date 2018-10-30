// components/questionnaire/questionnaire.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:String,
    remark:String,
    qId:{
      type: String,
      value:'',
      observer:function(){
        this.setData({
          iptVal: ''
        });
      }
    },
    gtype:String,
    other:Boolean,
    otherValue:String,
    textareaValue:String,
    maxSelected:Number,
    type:{
      type:String,
      value:'single',
      observer: function (oldVal, newVal){

      }
    },
    options:{
      type:Array,
      value:[],
      observer:function(oldVal,newVal){
      }
    },
    more:{
      type:String,
      value:'',
      observer: function (oldVal, newVal) {
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    iptVal:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onAnswerChanged:function(e){
      console.log("onAnswerChanged", e,this.data.options);
      let selectedValue = e.detail.selectedOption;
      let options=this.data.options;
      let selectedOptions = [];
      options.forEach((option, index) => {
        if (option.value === selectedValue || selectedValue && selectedValue.indexOf(option.value) != -1) {
          option.selected = true;
        } else {
          if (this.data.type == 'single') {
            option.selected = false;
          } else if (this.data.type == 'multi' && selectedValue && selectedValue.indexOf(option.value) == -1) {
            option.selected = false;
          }
        }
        if (option.selected) {
          selectedOptions.push(option.value);
        }
      });
      if(e.detail.value){
        this.setData({
          iptVal: e.detail.value
        });
      }
      console.log("this.data.iptVal:", this.data.iptVal, "this.data.otherValue:", this.data.otherValue);
      if(this.data.iptVal){
        selectedOptions.push(this.data.iptVal);
      }
      var eventDetail = {
        qId: this.data.qId,
        selectedOption: selectedOptions
      };
      var eventOptions={};
      this.triggerEvent('change', eventDetail, eventOptions);
    }
  },
  ready:function(e){
  }
})
