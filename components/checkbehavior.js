module.exports = Behavior({
  properties: {
    selectedValue: {
      type: "array",
      value: [],
      observer: function () { 

      }
    },
    options: {
      type: "array",
      value: [],
      observer: function () { }
    },
    enabled:{
      type:Boolean,
      value:true,
      observer: function () {}
    },
    maxSelected:{
      type:Number,
      value:0,
      observer:function(){}
    }
  },
  data: {
   
  },
  attached: function () { },
  methods: {
    onItemTap: function (e) {
      var selectedValue = e.currentTarget.dataset.value;
      var values = this.data.selectedValue;
      var options = this.data.options;
      if (selectedValue === "") {
        if (values.indexOf(selectedValue) === -1) {
          values=[];
          values.push(selectedValue);
        } else {
          values.splice(values.indexOf(selectedValue), 1);
        }
        options.forEach(function (item, index) {
          if (item.value === selectedValue) {
            item.selected = !item.selected;
          }else{
            item.selected=false;
          }
        });
      }else{
        if (values.indexOf(selectedValue) === -1&&this.data.enabled) {
          values.push(selectedValue);
          if (values.indexOf("") != -1) {
            values.splice(values.indexOf(""), 1);
          }
        } else if (values.indexOf(selectedValue) !== -1) {
          values.splice(values.indexOf(selectedValue), 1);
          if(values.length===0){
            values.push("");
          }
        }
        options.forEach( (item, index)=> {
          if (item.value === selectedValue) {
            if(this.data.enabled||item.selected){
              item.selected = !item.selected;
            }
          }
        });
      }
      console.log("options:",options,"selectedValue:",selectedValue,"values:",values);
      this.setData({ 
        selectedValue: values,
        options: options, 
        enabled: !this.data.maxSelected || this.data.maxSelected && values && values.length <this.data.maxSelected
      });
      console.log('this.data',this.data);
      var selectedOption=values;
      console.log("selectedOption", selectedOption);
      var eDetails = { selectedOption },
        eOptions = {};
      this.triggerEvent("change", eDetails);
    }
  }
});