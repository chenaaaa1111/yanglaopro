// components/link/link.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text:{
      type:'string',
      value:'',
      observer:function(){
        this.update();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    frags:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    update: function () {
      // let reg = /http[s]?:\/\/([\w-]+.)+([:\d+])?(\/[\w-\.\/\?%&=]*)?/gi;
      let reg = /http[s]?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*/gi;
      let str = this.data.text;
      let result;
      let lastIndex = reg.lastIndex;
      let frags = [];
      while ((result = reg.exec(str)) != null) {
        if (lastIndex < result.index) {
          frags.push({ index: lastIndex, text:str.slice(lastIndex, result.index), urlmatch: false });
        }
        frags.push({ index: result.index, text: result[0], urlmatch: true, url: encodeURIComponent(result[0]) });
        // console.log("result:", result,reg.lastIndex);
        lastIndex = reg.lastIndex;
      }
      if (lastIndex <= str.length - 1) {
        frags.push({ index: lastIndex, text: str.slice(lastIndex), urlmatch: false });
      }
      this.setData({
        frags
      });
      // console.log("frags", frags);
    }
  },
  ready:function(){
    this.update();
  }
})
