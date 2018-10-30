// components/checkboxgroup/checkboxgroup.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tabbarNum:{
            type: Number,
            value: 1
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
        xlBtnTap1(){
            if(this.properties.tabbarNum != 1) {
                wx.navigateTo({url:'/pages/index/index'});
            }
        },
        xlBtnTap2(){
            if(this.properties.tabbarNum != 2) {
                wx.navigateTo({url:'/pages/usercenter/usercenter'});
            }
        }
    }
  })