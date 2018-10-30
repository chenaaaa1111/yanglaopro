module.exports = Behavior({
  properties: {
    selectedValue: {
      type: "string",
      value: "",
      observer: function () { }
    },
    options: {
      type: "array",
      value: [],
      observer: function () { }
    }
  },
  data: {
  },
  attached: function () { },
  methods: {
    onItemTap: function (e) {
      console.log('onItemTap:',this.data.options);
      var selectedValue = e.currentTarget.dataset.value;
      var options = this.data.options;
      options.forEach(function (item, index) {
        if (item.value === selectedValue) {
          item.selected = true;
        } else {
          item.selected = false;
        }
      });
      this.setData({
        selectedValue: selectedValue,
        options: options
      });
      var t = this;
      var option = options.filter(function (item, index) {
        return item.value === t.data.selectedValue;
      });
      if (option && option[0]) {
        var selectedOption = option[0].value;
        var eDetails = { selectedOption },
          eOptions = {};
        this.triggerEvent("change", eDetails);
      }
    }
  },
  ready: function () {
    // var selectedValue = this.data.selectedValue;
    // var options = this.data.options;
    // options.forEach(function (item, index) {
    //   if (item.value === selectedValue) {
    //     item.selected = true;
    //   } else {
    //     item.selected = false;
    //   }
    // });
    // this.setData({
    //   options: options
    // });
    // var selectedOption = selectedValue;
    // var eDetails = { selectedOption },
    //   eOptions = {};
    // this.triggerEvent("change", eDetails);
  }
});