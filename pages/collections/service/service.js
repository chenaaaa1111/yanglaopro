var apis = require('../../../utils/api.js');
var xlStorage = require('../../../models/xlStorage');

Page({
    data: {
        ServiceList: [],
        xlNoDataBox: false
    },
    onLoad: function (option) {
        let that = this;
        let userLoginInfo = wx.getStorageSync('userLoginInfo');
        if(!userLoginInfo || !userLoginInfo.token) {
                wx.showModal({content: '您还未登录！', showCancel: false, confirmText: '去登录', success: function(){
                wx.navigateTo({url:'/pages/loginwx/loginwx?reLaunchUrl=' + '/pages/collections/service/service'});
            }})
        }else {
            wx.showLoading({
                title: '加载中...',
            });
            apis.getCollectionService({ 'phone': userLoginInfo.phone, token: userLoginInfo.token, imageFormat: "300x210" }).then((res) => {
                wx.hideLoading();
                if (res.data.code == 0) {
                    let resData = res.data.data;
                    resData.forEach((item,index) => {
                        let resAreas = item.beadServiceRegion.split(',');
                        resData[index].beadServiceRegion = resAreas[1] + resAreas[2];
                    });
                    that.setData({
                        ServiceList: res.data.data
                    });
                    if(res.data.data.length == 0) {
                        that.setData({
                            xlNoDataBox: true
                        });
                    };
                } else if(res.data.code === 110) {
                    wx.removeStorageSync('userLoginInfo');
                    wx.showModal({
                        content: res.data.msg,
                        showCancel: false,
                        confirmText: '去登录',
                        success: function (res) {
                            wx.navigateTo({url:'/pages/loginwx/loginwx?reLaunchUrl=' + '/pages/collections/service/service'});
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
            });
        }
    },
    itemBindTap(e){
        if(e.currentTarget.dataset.iteminfo) {
            wx.navigateTo({url: ('/pages/services/details/details?serviceId=' + e.currentTarget.dataset.iteminfo.id)})
        };
    }
})
