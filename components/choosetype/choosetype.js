// components/choose-type/chooseType.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    caretypes:Array,
    selectIndex:Array,
    caretypesNum: Array,
    caretypesStr: Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached: function () {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    chooseType:function(event){
      let index = event.currentTarget.dataset.idx;
      // console.log(index);
      let selectIndex = this.properties.selectIndex;
      selectIndex[index].sureid = !selectIndex[index].sureid;
      this.setData({
        selectIndex: selectIndex
      })
      // console.log(this.properties.selectIndex);

      let postSelectNum = [];
      let postSelectStr = [];
      this.properties.selectIndex.forEach((item, index) => {
        if (item.sureid) {
          postSelectNum.push(this.data.caretypes[index].value);
          postSelectStr.push(this.data.caretypes[index].name)
        }
      })
      console.log(postSelectNum, postSelectStr);
      this.setData({
        caretypesNum: postSelectNum,
        caretypesNum: postSelectStr
      })
    },
    caretypeBtn: function (event) {
      this.triggerEvent('confirm',{
        
     })
    }
  }
})
