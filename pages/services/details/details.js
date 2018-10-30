var apis = require('../../../utils/api.js');
var xlStorage = require('../../../models/xlStorage');

Page({
  data: {
    ServiceData: [],
    markers: [],
    scale: 14,
    isCollectioned: false,
    isFavoured: false,
    showCallPhone: false,
    showShareApp: false,
    showcover: true
  },
  onLoad: function(option) {
    let postId = option.serviceId;
    
    this.setData({
      postId: postId
    });
    let that = this;
    if (option.showShareApp == 1) {
      this.setData({
        showShareApp: true
      })
    };
    let userLoginInfo = wx.getStorageSync('userLoginInfo');
    if (userLoginInfo && userLoginInfo.token) {
      this.getIsCollectionedAndFavoured(userLoginInfo.phone,option.serviceId,userLoginInfo.token)
    };
    if (option.serviceId) {
      wx.showLoading({
        title: '加载中...',
      });
      apis.getFuwuDetail({
        imageFormat: "750x524"
      }, option.serviceId).then((res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          let markers = [];
          markers.push({
            id: 1,
            iconPath: '../../images/map_point1.png',
            latitude: res.data.data[0].lat,
            longitude: res.data.data[0].lng,
            width: 20,
            height: 26,
          });
          that.setData({
            markers: markers,
            ServiceData: res.data.data[0]
          });
        } else {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            confirmText: '确定',
            success: function(res) {}
          });
        };
      });
    } else {
      wx.showModal({
        content: "serviceId为空，获取数据失败！",
        showCancel: false,
        confirmText: '确定',
        success: function(res) {}
      })
    }
    
    /**
    * 机构留言列表api
    */
    apis.getComments({
      'itemId': that.data.postId,
      'itemType': '2',
      'pageIndex': 1,
      'pageNumber': 2
    }).then((res) => {
      if (res.data.code == 0) {
        let msgboards = res.data.data;
        console.log(msgboards);
        console.log(that.data.ServiceData);
        let msgboardsarr = [];
        let msgData = msgboards.forEach(function (item, index) {
          let phone = item.phone;
          let createTime = item.createTime;
          let comment = item.comment;
          let star = parseFloat(item.star);
          let updateTime = item.updateTime;
          let replyComment = item.replyComment;
          let replyShow = false
          if (item.updateTime != null && item.replyComment != null) {
            updateTime = item.updateTime.substr(0, 10);
            replyComment = item.replyComment;
            replyShow = true
          }
          phone = phone.substr(0, 3) + '***' + phone.substr(9, 2);
          createTime = createTime.substr(0, 10);
          let temp = {
            phone,
            createTime,
            comment,
            star,
            updateTime,
            replyComment,
            replyShow
          }
          msgboardsarr.push(temp);
        });
        that.setData({
          msgboards: msgboardsarr
        })
        if (that.data.msgboards.length > 0) {
          that.setData({
            notavailable: true
          })
        }
      }
    });
  },
  onShow() {
    let that = this;
    let userLoginInfo = wx.getStorageSync('userLoginInfo');
    if (!userLoginInfo || !userLoginInfo.token) {
      //未登录状态
      that.setData({
        showcover: true
      })
    } else {
    }
  },
  xlTel() {
    // if(this.data.ServiceData) {
    //     let phoneList = [];
    //     if(this.data.ServiceData.beadServiceTelphone){
    //         phoneList.push(this.data.ServiceData.beadServiceTelphone)
    //     };
    //     if(this.data.ServiceData.beadServiceTelphone_two){
    //         phoneList.push(this.data.ServiceData.beadServiceTelphone_two)
    //     };
    //     if(this.data.ServiceData.beadServiceTelphone_three){
    //         phoneList.push(this.data.ServiceData.beadServiceTelphone_three)
    //     };
    //     wx.showActionSheet({
    //         itemList: phoneList,
    //         success: function(res) {
    //           wx.makePhoneCall({
    //             phoneNumber: phoneList[res.tapIndex]
    //           });
    //         },
    //         fail: function(res) {
    //         }
    //     })
    // }
    this.setData({
      showPhone: true
    })
  },
  onShareAppMessage(options) {
    let that = this;
    return {　　　　
      title: "昱言养老服务",
      　　　　path: 'pages/services/details/details?showShareApp=1&serviceId=' + that.data.ServiceData.id,
      　　　　imgUrl: '',
      　　　　success: function(res) {　　　　},
      　　　　fail: function() {　　　　}
    }
  },
  OnhideCallPhone() {
    this.setData({
      showCallPhone: false
    })
  },
  makeCallPhone() {
    wx.makePhoneCall({
      phoneNumber: '010-65883352'
    });
  },
  toHome: function(event) {
    wx.switchTab({
      url: '../../index/index',
    })
  },
  onRadioButtonTap: function(e) {
    console.log("onRadioButtonTap:", e);
  },
  xlGoToMap() {
    let data = JSON.stringify(this.data.ServiceData);
    wx.navigateTo({
      url: ('/pages/map/map?mapType=2&nowMarkData=' + data)
    });
  },
  towriteMsg(event) {
    wx.navigateTo({
      url: "../writemsg/writemsg?id=" + this.data.postId + "&title=" + this.data.ServiceData.beadServiceName
    })
  },
  tomsgBoard(event) {
    wx.navigateTo({
      url: "../msgboard/msgboard?id=" + this.data.ServiceData.id
    })
  },
  getIsCollectionedAndFavoured(phone,id,token){
    let that = this;
    apis.getCollectionService({
      'phone': phone,
      'stationId': id,
      token
    }).then((res) => {
      if (res.data.code == 0) {
        that.setData({
          isCollectioned: !!res.data.data[0]
        });
      };
    });
    apis.checkFavour({
      'phone': phone,
      'itemId': id,
      token,
      'itemType': '2'
    }).then((res) => {
      console.log(res);
      
      if (res.data.code == 0) {
        that.setData({
          isFavoured: !!res.data.data
        });
      };
    });
  }
})