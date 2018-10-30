// pages/index/index.js
var api = require('./../../utils/api.js');
var bmap = require('./../../libs/bmap-wx.min.js');
var city = require('./../../utils/city.js');
var config = require('./../../utils/config.js');
var careType = require('./../../models/caretype.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aroundList: [],
    showCityName: '',
    showQuickTips: true,
    adImages: [],
    showPhone: false,
    isshowAd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.navRequest();
    this.requestData();
    setTimeout(() => {
      this.setData({
        showQuickTips: false
      });
    }, 10000);
  },
  toMap: function() {
    wx.navigateTo({
      url: '../map/map'
    })
  },
  toSearch: function() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  tocallphone: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          systemInfo: res,
        })
        if (res.platform == "ios") {
          wx.makePhoneCall({
            phoneNumber: '010-65883352'
          })
        } else {
          that.setData({
            showPhone: true
          })
        }
      }
    })
  },
  tolistType: function(event) {
    let sort = event.currentTarget.dataset.sort;
    let name = event.currentTarget.dataset.name;
    let lng = this.data.lng;
    let lat = this.data.lat;
    wx.navigateTo({
      url: '/pages/organization/list/list' + '?isFrom=2' + '&serviceType=' + sort + '&lng=' + lng + '&lat=' + lat + '&name=' + name
    })
  },
  tolife: function(event) {
    let postid = event.currentTarget.dataset.postid;
    // console.log(postid);
    wx.navigateTo({
      url: '/pages/news/list/list?id=' + postid
    })
  },
  toservicelist: function(event) {
    let id = event.currentTarget.dataset.postid;
    //console.log(id);
    wx.navigateTo({
      url: '/pages/services/list/list' + '?serviceType=' + id
    })
  },
  locate: function() {
    return new Promise((resolve, rejected) => {
      let cityPromise = city.getSelectCity().catch(e => console.log(e));
      let locatePromise = new Promise((resolve, rejected) => {
        var BMap = new bmap.BMapWX({
          ak: config.ak
        });
        var fail = function(data) {
          console.log("fail:", data);
          resolve({
            latitude: '22.547714',
            longitude: '114.066687'
          });
        };
        var success = function(data) {
          console.log("success:", data);
          let province, provinceName, latitude, longitude;
          if (data.originalData.result && data.originalData.result.addressComponent) {
            province = data.originalData.result.addressComponent.province || '';
            config.locateCityName = provinceName = province.slice(0, -1);
            if (city.nameCheckExistCity(provinceName)) {
              config.locateCityCode = city.nameGetCode(provinceName);
            }
          }
          if (data.wxMarkerData && data.wxMarkerData[0]) {
            config.locateLatitude = latitude = data.wxMarkerData[0].latitude;
            config.locateLongitude = longitude = data.wxMarkerData[0].longitude;
          }
          // console.log("success...", config.locateCityName, config.locateCityCode, config.locateLatitude, config.lcateLongitude);
          resolve({
            province,
            latitude,
            longitude
          });
        };
        BMap.regeocoding({
          fail: fail,
          success: success
        });
      });
      Promise.all([cityPromise, locatePromise]).then(([cityRes, locationRes]) => {
        if (cityRes && cityRes.data) {
          config.nowCityCode = cityRes.data.citycode;
          config.nowCityName = cityRes.data.cityName;
          config.nowCityAcronym = cityRes.data.acronym;
        } else {
          let {
            province
          } = locationRes;
          if (province) {
            let provinceName = province.slice(0, -1);
            if (city.nameCheckExistCity(provinceName)) {
              config.nowCityCode = city.nameGetCode(provinceName);
              config.nowCityName = city.codeGetName(config.nowCityCode);
              config.nowCityAcronym = city.codeGetAcronym(config.nowCityCode);
            }
            city.selectCity(config.nowCityCode);
          }
        }
        let {
          latitude,
          longitude
        } = locationRes;
        resolve({
          latitude,
          longitude
        });
      });
    });
  },
  requestData: function(isrefresh) {
    this.locate().then((res) => {
      console.log(res);
      if (res) {
        let {
          latitude,
          longitude
        } = res;
        let params = {
          pageIndex: 1,
          pageNumber: 3,
          imageFormat: '240x180'
        };
        if (latitude && longitude) {
          params = Object.assign(params, {
            lat: latitude,
            lng: longitude
          });
        }
        /* else {
                  params = Object.assign(params, {
                    beadhouseTopsort: 1
                  });
                }*/
        let getAdImage = api.getAdImage({
          imageFormat: '750x260'
        });
        let getOrganization = api.getOrganizationWithFilters(params);
        Promise.all([getAdImage, getOrganization]).then(([imgRes, organizationRes]) => {
          let adImages = [];
          if (imgRes && imgRes.statusCode == '200' && imgRes.data.code == 0) {
            console.log("imgRes:", imgRes);
            let images = imgRes.data.data;
            adImages = images.map((item, index) => {
              let adImg = {
                id: item.id,
                imgUrl: item.beadhouseImgUrl
              };
              return adImg;
            });
          }
          if (organizationRes && organizationRes.statusCode == '200' && organizationRes.data.code == 0) {
            console.log("getOrganizationWithFilters:res", res);
            let lng = res.latitude;
            let lat = res.longitude;
            let responseData = organizationRes.data.data;
            let showData = responseData.map((response, index) => {
              let careTypeValues = response.beadhouseServiceType ? response.beadhouseServiceType.split(',') : '';
              let transData = {
                key: response.id,
                imgable: 1,
                img: response.pensionImages && response.pensionImages[0] ? response.pensionImages[0].imgUrl : "/images/img@2x.png",
                title: response.beadhouseName,
                address: response.beadhouseAddress || '',
                price: response.beadhouseCostRangeMin && response.beadhouseCostRangeMax ? [response.beadhouseCostRangeMin, response.beadhouseCostRangeMax].join('-') : parseInt(response.beadhouseCostRangeMin) || parseInt(response.beadhouseCostRangeMax) || 0,
                hospital: response.beadhouseHospital,
                medical: response.isMedical == '是',
                cooperateHospital: response.cooperateHospital,
                types: careType.idsGetCareLabels(careTypeValues),
                status: response.businessState
              }
              return transData;
            });
            console.log("showData:", showData);
            this.setData({
              aroundList: showData,
              showCityName: config.nowCityName,
              adImages: adImages,
              lng: lng,
              lat: lat
            })
            if (isrefresh) {
              wx.stopPullDownRefresh();
            }
            // console.log("showData", showData);
          }
        });
      }
    });
  },
  navRequest(){
    api.getDictInfos({
      'types': '1,4'
    }).then((res) => {
      console.log(res);
      let statusCode = res.statusCode.toString();
      if (statusCode.startsWith('2')) {
        wx.hideLoading();
        // console.log(res);
        let dicinfo = res.data.services;
        let dic0 = dicinfo[0];
        let dic1 = dicinfo[2];
        let dic2 = dicinfo[5];
        let dic3 = dicinfo[4];
        let dic4 = dicinfo[7];
        let dic5 = dicinfo[3];
        let dayCare = [dic1, dic2, dic3, dic4, dic5, dic0];
        this.setData({
          caretypes: res.data.serviceTypes,
          lives: dayCare,
          DictInfosloadOver: true
        })
      }
    })

    // 获取乐养生活http
    api.getNewsType().then((res) => {
      let statusCode = res.statusCode.toString();
      if (statusCode.startsWith('2')) {
        console.log(res);
        let oldlifes = res.data.data;
        // oldlifes[4].columnName = '产品评测';
        //console.log(oldlifes);
        this.setData({
          oldlifes: oldlifes
        })
        // let oldlifesData = this.data.oldlifes
        // if (oldlifesData.length > 5) {
        //   oldlifesData = oldlifesData.slice(0, 5);
        //   this.setData({
        //     oldlifes: oldlifesData
        //   })
        // }

        // this.data.oldlifes.forEach((item) => {
        //   if (item.sort == 2) {
        //     this.data.oldlifes.splice(1, 1);
        //     this.setData({
        //       oldlifes: this.data.oldlifes
        //     })
        //   }
        // })
      }
    });

    //弹窗api
    api.getFloatImages().then((res) => {
      let statusCode = res.statusCode.toString();
      if (statusCode.startsWith('2')) {
        console.log(res);
        let adImg_url = res.data.imgUrl;
        this.setData({
          adImg_url: adImg_url
        })
        if (this.data.adImg_url == undefined) {
          this.setData({
            isshowAd: false
          })
        } else {
          this.setData({
            isshowAd: true
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.requestData(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (option) {
    
  }
})