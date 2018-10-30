var apis = require('../../../utils/api.js');
let {getAndSaveCityConfig} = require('../../../models/xlStorage');
var xlStorage = require('../../../models/xlStorage');

Page({
    data: {
        keywords: '', /** 搜索关键字 */
        ServiceList: [],
        listPageNum: 1,
        scrollToBottom: false,
        myLocation: {},
        noData: false
    },
    onLoad: function (option) {
        wx.showLoading({
            title: '加载中...',
        });
        let that = this;
        if(option.keywords) {
            that.setData({
                keywords: option.keywords
            });
        };
        let res = {firstPY:'',serviceProject:'',distance:''};
        if(option.serviceType) {
            getAndSaveCityConfig().then((data)=>{
                for (let index = 0; index < data.services.length; index++) {
                    if(option.serviceType == data.services[index].id) { res.serviceProject = data.services[index].value; break;};
                };
                wx.setStorageSync('serviceFilterObj',res);
                that.init();
            });
        }else {
            that.init();
        }
    },
    init(Location){
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        let myLocation = Location || that.data.myLocation;
        let serviceFilterObj = wx.getStorageSync('serviceFilterObj');
        serviceFilterObj = serviceFilterObj || {};
        apis.getFuwuList(Object.assign({ 'cityName': 'bj', 'pageIndex': 1, pageNumber: 10 * that.data.listPageNum, imageFormat: "300x210" },serviceFilterObj,{keywords: that.data.keywords},myLocation)).then((res) => {
            wx.hideLoading();
            if (res.data.code == 0) {
                let resData = res.data.data;
                let noData = false;
                resData.forEach((item,index) => {
                    let resAreas = item.beadServiceRegion.split(',');
                    resData[index].beadServiceRegion = resAreas[1] + resAreas[2];
                });
                if(resData.length <= 0) {
                    noData = true
                };
                that.setData({
                    ServiceList: res.data.data,
                    noData
                });
            } else {
                wx.showModal({
                        content: res.data.msg,
                        showCancel: false,
                        confirmText: '确定',
                        success: function (res) {
                    }
                });
            };
        });
    },
    startSearch(e,data){
        let that = this;
        xlStorage.getMyLocation().then((res)=>{
            that.setData({ myLocation: res });
            that.init(res);
        });
    },
    xlGoSearch(){
        wx.navigateTo({url: ('/pages/search/search?seachType=2')})
    },
    xlGoMap(){
        wx.navigateTo({url: ('/pages/map/map?mapType=2')})
    },
    xlBindscrolltolower(){
        let that = this;
        if(!this.data.scrollToBottom) {
            that.setData({ scrollToBottom: true,listPageNum: that.data.listPageNum + 1 });
            that.init();
            that.setData({ scrollToBottom: false });
        }
    }
})
