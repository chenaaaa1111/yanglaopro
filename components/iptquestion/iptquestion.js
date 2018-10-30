// components/iptquestion/iptquestion.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    remark: String,
    qId: String,
    gtype: String,
    type:'single',
    other: Boolean,
    type: {
      type: String,
      value: 'single',
      observer: function (oldVal, newVal) {

      }
    },
    options: {
      type: Array,
      value: [],
      observer: function (oldVal, newVal) {
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    iptVal:'',
    selectedVal:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onAnswerChanged:function(e){
      console.log("onAnswerChanged:iptquestion",e,this.data.options);
      let selectedValue = e.detail.selectedOption;
      let options = this.data.options;
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
      console.log('this.data11;', this.data);
      if (e.detail.value) {
        this.setData({
          iptVal: e.detail.value,
          options:options
        });
        console.log('this.data;',this.data);
      }
      let iptVal=this.data.iptVal;
      var eventDetail = {
        qId: this.data.qId,
        selectedOption: [iptVal,selectedOptions.join(',')].join('^')
      };
      var eventOptions = {};
      this.triggerEvent('change', eventDetail, eventOptions);
    }
  },
  ready:function(){
    console.log("ready11:", this.data.options);
  }
})
