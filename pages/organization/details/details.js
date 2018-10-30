import apis from '../../../utils/api.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperImgIndex: 1,
    showCallPhone: false,
    loginStatus: false,
    ServiceType: [{
      id: 1,
      label: '自理'
    }, {
      id: 2,
      label: '非自理'
    },
    {
      id: 3,
      label: '半自理'
    },
    {
      id: 4,
      label: '日托'
    },
    {
      id: 5,
      label: '居家'
    },
    {
      id: 6,
      label: '失智'
    }
    ],
    newServiceTypeData: [],
    total: [],
    beadhouseBedCost: [],
    nursingCost: [],
    beadhouseMeals: [],
    showcover: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var postId = options.id;
    this.setData({
      postId: postId
    });

    apis.getOrganizationDetails({
      'cityName': 'bj',
      'imageFormat': '750x524'
    }, postId).then((res) => {
      if (res.data.code == 0) {
        that.setData({
          details: res.data.data,
        })
        console.log(this.data.details);
        var totalArr = this.data.total;
        if (this.data.details.beadhouseCostRangeMin != null && !undefined) {
          totalArr.push(this.data.details.beadhouseCostRangeMin);
        }
        if (this.data.details.beadhouseCostRangeMax != null && !undefined) {
          totalArr.push(this.data.details.beadhouseCostRangeMax);
        }
        totalArr = totalArr.join('-');

        let beadhouseBedCost = this.data.beadhouseBedCost;
        if (this.data.details.beadhouseBedCostMin != null && !undefined) {
          beadhouseBedCost.push(this.data.details.beadhouseBedCostMin);
        }
        if (this.data.details.beadhouseBedCostMax != null && !undefined) {
          beadhouseBedCost.push(this.data.details.beadhouseBedCostMax);
        }
        beadhouseBedCost = beadhouseBedCost.join('-');

        let nursingCost = this.data.nursingCost;
        if (this.data.details.nursingCostMin != null && !undefined) {
          nursingCost.push(this.data.details.nursingCostMin);
        }
        if (this.data.details.nursingCostMax != null && !undefined) {
          nursingCost.push(this.data.details.nursingCostMax);
        }
        nursingCost = nursingCost.join('-');

        let beadhouseMeals = this.data.beadhouseMeals;
        if (this.data.details.beadhouseMealsMin != null && !undefined) {
          beadhouseMeals.push(this.data.details.beadhouseMealsMin);
        }
        if (this.data.details.beadhouseMealsMax != null && !undefined) {
          beadhouseMeals.push(this.data.details.beadhouseMealsMax);
        }
        beadhouseMeals = beadhouseMeals.join('-');
        that.setData({
          title: this.data.details.beadhouseName,
          total: totalArr,
          beadhouseBedCost: beadhouseBedCost,
          nursingCost: nursingCost,
          beadhouseMeals: beadhouseMeals,
          bedNumTotal: parseFloat(this.data.details.beadhouseBedCostMin) + parseFloat(this.data.details.beadhouseBedCostMax),
          nurseTotal: parseFloat(this.data.details.nursingCostMin) + parseFloat(this.data.details.nursingCostMax),
          mealTotal: parseFloat(this.data.details.beadhouseMealsMin) + parseFloat(this.data.details.beadhouseMealsMax),
        })
        var remarkToken = this.data.details.beadhouseCostRangeRemark;
        var remarkArray = remarkToken.split("、");
        var remarkNums = [];
        for (var i = 0; i < remarkArray.length; i++) {
          remarkNums.push(remarkArray[i]);
        }

        let careTypeData = this.data.details.beadhouseServiceType;
        let ServiceType = this.data.ServiceType;
        let newServiceTypeData = this.data.newServiceTypeData;
        careTypeData = careTypeData.split(',');
        console.log(careTypeData);
        var showServiceType = ServiceType.forEach(function (item, index) {
          var idx = careTypeData.indexOf(item.id.toString());
          if (idx > -1) {
            newServiceTypeData.push(item.label);
          }
        })
        console.log(newServiceTypeData);

        this.setData({
          remarkNums: remarkNums,
          newServiceTypeData: newServiceTypeData
        })

      }
    });

    /**
     * 机构留言列表api
     */
    apis.getComments({
      'itemId': postId,
      'itemType': '1',
      'pageIndex': 1,
      'pageNumber': 2
    }).then((res) => {
      if (res.data.code == 0) {
        console.log(res);
        let msgboards = res.data.data;
        let msgboardsarr = [];
        let msgData = msgboards.forEach(function (item, index) {
          let id = item.id;
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
          updateTime = updateTime.substr(0, 10);
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

  gotoLogin: function (event) {
    wx.navigateTo({
      url: '../../loginwx/loginwx'
    })
  },
  toHome: function (event) {
    wx.switchTab({
      url: '../../index/index',
    })
  },

  showCallPhoneNumber: function () {
    this.setData({
      showCallPhone: true
    })
  },
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.replyPhone,
      success: function () {
        console.log("成功拨打电话")
      },
    })
  },
  OnhideCallPhone: function () {
    this.setData({
      showCallPhone: false
    })
  },
  towriteMsg(event) {
    wx.navigateTo({
      url: "../writemsg/writemsg?id=" + this.data.postId + "&title=" + this.data.title
    })
  },
  tomsgBoard(event) {
    wx.navigateTo({
      url: "../msgboard/msgboard?id=" + this.data.postId
    })
  },
  tocallphone: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
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
  toMaptype: function () {
    let data = JSON.stringify(this.data.details);
    //console.log(data);
    wx.navigateTo({
      url: "../../map/map?mapType=1&nowMarkData=" + data
    })
  },
  onRadioButtonTap: function (e) {
    console.log("onRadioButtonTap:", e);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    let that = this;
    let userLoginInfo = wx.getStorageSync('userLoginInfo');
    let userToken = userLoginInfo.token;
    console.log(userToken);
    let userPhone = userLoginInfo.phone;
    if (!userLoginInfo || !userLoginInfo.token) {
      //未登录
      this.setData({
        loginStatus: false,
        showcover: true
      })
    } else {
      //已登录
      this.setData({
        loginStatus: true,
        showcover: false,
        userToken: userToken,
        userPhone: userPhone
      })

      apis.getCollectionOrganization({
        'phone': userLoginInfo.phone,
        'pensionId': this.data.postId,
        'token': userLoginInfo.token
      }).then((res) => {
        if (res.data.code == 0) {
          console.log(res);
          that.setData({
            isCollectioned: !!res.data.data[0]
          });
          console.log(this.data.isCollectioned);
        }
      });
      apis.checkFavour({
        'token': userLoginInfo.token,
        'phone': userLoginInfo.phone,
        'itemId': this.data.postId,
        'itemType': 1
      }).then((res) => {
        if (res.data.code == 0) {
          console.log(res);
          that.setData({
            isFavoured: !!res.data.data
          });
        };
      });
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (option) {
    var that = this;
    this.setData({
      showShareApp: true
    })
    return {
      title: this.data.details.beadhouseName,
      path: '/pages/organization/details/details?id=' + this.data.details.id + '&pageId=123',
      success: function (res) {
        wx.showShareMenu({
          withShareTicket: true
        });

      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    }
  },

})