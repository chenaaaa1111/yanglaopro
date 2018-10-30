var apis = require('../../utils/api.js');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        iteminfo:{ /** item数据 */
            type: Object,
            value: {}
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
        xlBtnTap(){
            let that = this;
            if(that.properties.iteminfo.id) {
                wx.navigateTo({url: ('/pages/services/details/details?serviceId=' + that.properties.iteminfo.id)})
            };
        }
    }
  })