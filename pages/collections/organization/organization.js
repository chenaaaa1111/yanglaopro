var apis = require('../../../utils/api.js');
var xlStorage = require('../../../models/xlStorage');
var careType = require('../../../models/caretype.js');

Page({
    data: {
        collectionList: [],
        xlNoDataBox: false,
        isCollectioned: false
    },
    onLoad: function (option) {
        let that = this;
        let userLoginInfo = wx.getStorageSync('userLoginInfo');
        if(!userLoginInfo || !userLoginInfo.token) {
                wx.showModal({content: '您还未登录！', showCancel: false, confirmText: '去登录', success: function(){
                wx.navigateTo({url:'/pages/loginwx/loginwx?reLaunchUrl=' + '/pages/collections/organization/organization'});
            }})
        }else {
            wx.showLoading({
                title: '加载中...',
            });
            apis.getCollectionJigou({ 'phone': userLoginInfo.phone, token: userLoginInfo.token, imageFormat: "300x210" }).then((res) => {
                wx.hideLoading();
                if (res.data.code == 0) {
                    console.log(res);
                    
                    let listsData = res.data.data.map(function (item, index) {
                      let careTypeValues = item.beadhouseServiceType ? item.beadhouseServiceType.split(',') : '';
                      let temp = {
                        key: item.id,
                        imgable: 1,
                        img: item.pensionImages && item.pensionImages[0] ? item.pensionImages[0].imgUrl : "/images/img@2x.png",
                        title: item.beadhouseName,
                        address: item.beadhouseAddress,
                        price: item.beadhouseCostRangeMin && item.beadhouseCostRangeMax ? [item.beadhouseCostRangeMin, item.beadhouseCostRangeMax].join('-') : parseInt(item.beadhouseCostRangeMin) || parseInt(item.beadhouseCostRangeMax) || 0,
                        hospital: item.beadhouseHospital,
                        medical: item.isMedical == '是',
                        cooperateHospital: item.cooperateHospital,
                        types: careType.idsGetCareLabels(careTypeValues),
                        status: item.businessState
                      };
                      return temp;
                    })
                    console.log('listsData:', listsData);
                    this.setData({
                        collectionList: listsData
                    })
                }
            });
        }
    },
    getBeadhouseServiceType(str){
        let resStr = '';
        let careType = ['自理 ','非自理 ','半自理 ','日托 ','居家 '];
        if(!str || str == 'undefined') {
            resStr = '暂无';
        }else {
            let strList = str.split(',');
            if(strList.length < 3) {
            strList.map(item => {
                resStr += careType[item -1]
            })
            }else {
            resStr = careType[strList[0] - 1] + careType[strList[1] - 1] + careType[strList[2] - 1];
            }
        }
        return resStr;
    },
    itemBindTap(e){
        if(e.currentTarget.dataset.iteminfo) {
            wx.navigateTo({url: ('/pages/organization/details/details?id=' + e.currentTarget.dataset.iteminfo.id)})
        };
    }
})
