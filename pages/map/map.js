const apis = require('../../utils/api.js');
const xlStorage = require('../../models/xlStorage');
var careType = require('../../models/caretype.js');

Page({ 
    data: {
      mapType: 1, /** 1 机构 2 服务 */
      mapData: [],
      markers: [],
      markersSelected: '',
      locationInfo: '',
      lat: '',
      lng: '',
      detailData: '',
      scale: 13,
      beadhouseServiceTypeList:{
        '1':'自理','2':'非自理','3':'半自理','4':'日托','5':'居家'
      }
    },
    regionchange(e) {
    },
    mapbindtap(e){
      if(this.data.detailData) {
        this.setData({
          detailData: ''
        });
      };
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
    markertap(e) {
      let that = this;
      let markers = this.data.markers;
      markers[e.markerId].iconPath = '../../images/map_point2.png';
      if(that.data.markersSelected || that.data.markersSelected === 0) {markers[that.data.markersSelected].iconPath = '../../images/map_point1.png';}
      if(this.data.mapType == 1) {
        let detailData = JSON.parse(JSON.stringify(that.data.mapData.list[e.markerId]));
        detailData.beadhouseServiceType = careType.idsGetCareLabels(detailData.beadhouseServiceType.split(','));
        this.setData({
          detailData: detailData,
          markers: markers,
          markersSelected: e.markerId
        });
      }else if(this.data.mapType == 2) {
        this.setData({
          detailData: that.data.mapData[e.markerId],
          markers: markers,
          markersSelected: e.markerId
        });
      }
    },
    xlGotoLocation(){
      let that = this;
      xlStorage.getMyLocation().then((res)=>{
        that.setData(res);
      });
    },
    onLoad(option){
      let that = this;
      wx.showLoading({
        title: '加载中...',
      });
      xlStorage.getMyLocation().then((res)=>{
        that.setData({
          locationInfo: res
        });
      });
      this.setData({ mapType: option.mapType || 1 });
      if(option.nowMarkData) {
        try {
          let nowMarkData = JSON.parse(option.nowMarkData);
          if(this.data.mapType == 1) {
            nowMarkData.beadhouseServiceType = this.getBeadhouseServiceType(nowMarkData.beadhouseServiceType);
          };
          that.setData({
            detailData: nowMarkData
          });
        } catch (error) {
          
        }
      }
      if(this.data.mapType == 1) {
        apis.getJigouList({'cityName':'bj'}).then((res)=>{
          wx.hideLoading();
          if(res.data.code == 0){
            that.setData({
              mapData: res.data.data
            });
            let markers = [];
            this.data.mapData.list.map((item,index)=>{
              let nowMarkerData = {
                id: index,
                iconPath: '../../images/map_point1.png',
                latitude: this.data.mapData.list[index].lat,
                longitude: this.data.mapData.list[index].lng,
                width: 20,
                height: 26,
              };
              if(that.data.detailData && that.data.detailData.id == item.id) {
                nowMarkerData.iconPath = '../../images/map_point2.png';
              };
              markers.push(nowMarkerData);
            });
            this.setData({
              markers: markers,
              // lat: this.data.mapData.list[0].lat,
              // lng: this.data.mapData.list[0].lng
              lat: (that.data.detailData && that.data.detailData.lat) || that.data.locationInfo.lat || '39.9299857781',
              lng: (that.data.detailData && that.data.detailData.lng) || that.data.locationInfo.lng || '116.395645038'
              // lat: '39.9299857781',
              // lng:  '116.395645038'
            });
          }else {
            wx.showModal({
              content: res.data.msg,
              showCancel: false,
              confirmText: '确定',
              success: function(res) {
              }
            });
          };
        });
      }else if(this.data.mapType == 2) {
        apis.getFuwuList({'cityName':'bj'}).then((res)=>{
          wx.hideLoading();
          if(res.data.code == 0){
            let resData = res.data.data;
            resData.forEach((item,index) => {
                let resAreas = item.beadServiceRegion.split(',');
                resData[index].beadServiceRegion = resAreas[1] + resAreas[2];
            });
            that.setData({
              mapData: resData
            });
            let markers = [];
            this.data.mapData.map((item,index)=>{
              let nowMarkerData = {
                id: index,
                iconPath: '../../images/map_point1.png',
                latitude: this.data.mapData[index].lat,
                longitude: this.data.mapData[index].lng,
                width: 20,
                height: 26,
              };
              if(that.data.detailData && that.data.detailData.id == item.id) {
                nowMarkerData.iconPath = '../../images/map_point2.png';
              };
              markers.push(nowMarkerData);
            });
            this.setData({
              markers: markers,
              // lat: this.data.mapData[0].lat,
              // lng: this.data.mapData[0].lng
              lat: (this.data.detailData && this.data.detailData.lat) || that.data.locationInfo.lat || '39.9299857781',
              lng: (this.data.detailData && this.data.detailData.lng) || that.data.locationInfo.lng || '116.395645038'
              // lat: '39.9299857781',
              // lng:  '116.395645038'
            });
          }else {
            wx.showModal({
              content: res.data.msg,
              showCancel: false,
              confirmText: '确定',
              success: function(res) {
              }
            });
          };
        });
      }
    },
    xlGoServiceDetail(){
      let that = this;
      wx.navigateTo({url: ('/pages/services/details/details?serviceId=' + that.data.detailData.id)})
    },
    xlGoOrgDetail(){
      let that = this;
      wx.navigateTo({url: ('/pages/organization/details/details?id=' + that.data.detailData.id)})
    },
    xlGoSearch(){
        wx.navigateTo({url: ('/pages/search/search?seachType=' + this.data.mapType)})
    }
})