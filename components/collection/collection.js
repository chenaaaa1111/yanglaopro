var apis = require('../../utils/api.js');
var xlStorage = require('../../models/xlStorage');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isCollectioned:{ /** 关注-true 未关注-false */
            type: Boolean,
            value: false
        },
        collectionType: { /** 机构-1 服务-2 */
            type: Number,
            value: 1
        },
        collectionId:{
            type: Number,
            value: 0
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
            let userLoginInfo = wx.getStorageSync('userLoginInfo');
            if(!userLoginInfo || !userLoginInfo.token) {
                if(that.properties.collectionType == 1) {
                    wx.showModal({content: '您还未登录！', showCancel: true,cancelText: '取消', confirmText: '去登录', success: function(res){
                        if (res.confirm){
                            wx.navigateTo({url:'/pages/loginwx/loginwx?reLaunchUrl=' + '/pages/organization/details/details?id=' + that.properties.collectionId});
                        }
                    }})
                }else if(that.properties.collectionType == 2) {
                    wx.showModal({content: '您还未登录！', showCancel: true,cancelText: '取消', confirmText: '去登录', success: function(res){
                        if (res.confirm){
                            wx.navigateTo({url:'/pages/loginwx/loginwx?reLaunchUrl=' + '/pages/services/details/details?serviceId=' + that.properties.collectionId});
                        }
                    }})
                }
            }else {
                if(!this.properties.isCollectioned) {
                    apis.addCollection({ phone: userLoginInfo.phone, token: userLoginInfo.token, itemId: that.properties.collectionId, itemType: that.properties.collectionType}).then((res)=>{
                        if(res.data.code == 0) {
                            wx.showModal({
                                content: '已加入收藏',
                                showCancel: false,
                                confirmText: '确定',
                                success: function(res) {
                                    that.setData({
                                        isCollectioned: true
                                    })
                                }
                            })
                        }else if(res.data.code === 110) {
                            wx.removeStorageSync('userLoginInfo');
                            wx.showModal({
                                content: res.data.msg,
                                showCancel: false,
                                confirmText: '去登录',
                                success: function(res) {
                                    wx.navigateTo({url:'/pages/loginwx/loginwx'});
                                }
                            })
                        }else {
                            wx.showModal({
                                content: res.data.msg,
                                showCancel: false,
                                confirmText: '确定',
                                success: function(res) {
                                }
                            })
                        }
                    })
                }else {
                    apis.delCollection({ phone: userLoginInfo.phone, token: userLoginInfo.token, itemId: that.properties.collectionId, itemType: that.properties.collectionType}).then((res)=>{
                        if(res.data.code == 0) {
                            wx.showModal({
                                content: '已取消收藏',
                                showCancel: false,
                                confirmText: '确定',
                                success: function(res) {
                                    that.setData({
                                        isCollectioned: false
                                    })
                                }
                            })
                        }else if(res.data.code === 110) {
                            wx.removeStorageSync('userLoginInfo');
                            wx.showModal({
                                content: res.data.msg,
                                showCancel: false,
                                confirmText: '去登录',
                                success: function (res) {
                                    wx.navigateTo({url:'/pages/loginwx/loginwx'});
                                }
                            });
                        }else {
                            wx.showModal({
                                content: res.data.msg,
                                showCancel: false,
                                confirmText: '确定',
                                success: function (res) {
                                }
                            });
                        }
                    })
                }
            }
        }
    }
  })