import apis from '../../../utils/api.js';
var object = require("../../../utils/config.js");
var careType = require('../../../models/caretype.js');
let animationShowHeight = 300; //动画偏移高度
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lists: '',
    area: '区域',
    pricesNum: '总费用',
    serviceTypeView: '照护类型',
    more: '更多',
    isShowFee: false,
    isShowArea: false,
    isShowServiceType: false,
    isShowMore: false,
    bgApcity: false,
    ischecked: false,
    checkArray: [],
    medicalType: 'm0',
    hasHospital: "h0",
    hasGreenChannel: "g0",
    activeIndexSort: '0',
    dataList: {
      pageIndex: 1,
      pageNumber: 20,
      imageFormat: '240x180'
    },
    listsServiceType: [],
    caretypeArray: [],
    scrollHeight: '',
    scrollTop: 0,
    total: [],
    chooseArea1: true,
    nearby: '',
    caretypesLen: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let scrollHeight = `height:${res.windowHeight*2}rpx`;
        that.setData({
          scrollHeight: scrollHeight
        })
      },
    })
    console.log(this.data.scrollHeight);
    this.getRequestHttp();

    //需求定制
    if (options.isFrom == '1') {
      let serviceType = options.serviceType;
      let minAmt = options.minAmt;
      let maxAmt = options.maxAmt;
      let firstPY = options.firstPY;
      let houseType = options.houseType;
      if (serviceType != undefined) {
        this.data.dataList['serviceType'] = serviceType;
      } else {
        delete this.data.dataList.serviceType;
      }
      if (minAmt != undefined) {
        this.data.dataList['minAmt'] = minAmt;
      } else {
        delete this.data.dataList.minAmt;
      }
      if (maxAmt != undefined) {
        this.data.dataList['maxAmt'] = maxAmt;
      } else {
        delete this.data.dataList.maxAmt;
      }
      if (firstPY != undefined) {
        this.data.dataList['firstPY'] = firstPY;
      } else {
        delete this.data.dataList.firstPY;
      }
      if (houseType != undefined) {
        this.data.dataList['houseType'] = houseType;
      } else {
        delete this.data.dataList.houseType;
      }
      console.log(this.data.dataList);
      this.getRequestHttp();
    }

    // 首页 服务类型传值
    if (options.isFrom == '2') {
      // let careTypeCode = options.serviceType;
      let careTypeCode = parseFloat(options.serviceType);
      let nameType = options.name;
      let lng = options.lng;
      let lat = options.lat;

      this.data.dataList['serviceType'] = careTypeCode;
      this.data.dataList['lng'] = lng;
      this.data.dataList['lat'] = lat;
      this.getRequestHttp();
      this.setData({
        careTypeCode: careTypeCode,
        serviceTypeView: nameType
      })
    }
    //关爱认知症 查看全部特护机构传值
    console.log(options);
    if (options.isFrom == '3') {
      let careTypeCode = parseFloat(options.servicetype);
      this.data.dataList['serviceType'] = careTypeCode;
      this.getRequestHttp();
      this.setData({
        careTypeCode: careTypeCode,
        serviceTypeView: '失智'
      })
    }


    //搜索机构 返回列表
    let keywordsVal = options.keywords;
    if (keywordsVal) {
      this.data.dataList['keyWords'] = keywordsVal;
      this.getRequestHttp();
    }

    //获取区域http
    apis.getCityArea().then((res) => {
      if (res.data.code == 0) {
        that.setData({
          counts: res.data.data
        })
      }
    })

    apis.getDictInfos({
      'types': '1,3,6,9,12'
    }).then((res) => {
      let statusCode = res.statusCode.toString();
      if (statusCode.startsWith('2')) {
        console.log(res);
        that.setData({
          caretypes: res.data.serviceTypes,
          caretypesLen: res.data.serviceTypes.length,
          houseTypes: res.data.houseTypes,
          allCost: res.data.costs,
          sortLists: res.data.sorts,
          nearby: res.data.dictances
        })
        let selectIndex = [];
        for (let i = 1; i <= this.data.caretypesLen; i++) {
          selectIndex.push({
            sureid: false
          });
        }
        if (this.data.careTypeCode) {
          selectIndex[this.data.careTypeCode - 1].sureid = true;
        }
        this.setData({
          selectIndex: selectIndex
        })
      }
    })


  },
  //机构列表http
  getRequestHttp: function () {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    apis.getOrganizationWithFilters(this.data.dataList).then((res) => {
      wx.hideLoading();
      if (res.data.code == 0) {
        that.setData({
          lists: res.data.data,
        });
        // console.log(this.data.lists);
        let responseData = this.data.lists;
        let listsData = responseData.map(function (item, index) {
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
        // console.log('listsData:', listsData);
        this.setData({
          listsData: listsData
        })
        if (this.data.lists <= 0) {
          that.setData({
            loading: true
          })
        }
      }
    });
  },

  toSearch: function () {
    wx.navigateTo({
      url: '../../search/search'
    })
  },
  toMap: function () {
    wx.navigateTo({
      url: '../../map/map'
    })
  },
  changeBoxBtn: function (e) {
    var getDataNum = e.currentTarget.dataset.num;
    var isShowFee = !this.data.isShowFee;
    var isShowArea = !this.data.isShowArea;
    var isShowServiceType = !this.data.isShowServiceType;
    var isShowMore = !this.data.isShowMore;
    if (getDataNum == 0) {
      this.setData({
        isShowArea: isShowArea,
        isShowFee: false,
        isShowServiceType: false,
        isShowMore: false
      })
      if (isShowArea == true) {
        this.setData({
          bgApcity: true
        })
      } else {
        this.setData({
          bgApcity: false
        })
      }
    }
    if (getDataNum == 1) {
      this.setData({
        isShowFee: isShowFee,
        isShowArea: false,
        isShowServiceType: false,
        isShowMore: false
      })
      if (isShowFee == true) {
        this.setData({
          bgApcity: true
        })
      } else {
        this.setData({
          bgApcity: false
        })
      }
    }
    if (getDataNum == 2) {
      this.setData({
        isShowArea: false,
        isShowFee: false,
        isShowMore: false,
        isShowServiceType: isShowServiceType
      })
      if (isShowServiceType == true) {
        this.setData({
          bgApcity: true
        })
      } else {
        this.setData({
          bgApcity: false
        })
      }
    }
    if (getDataNum == 3) {
      this.setData({
        isShowArea: false,
        isShowFee: false,
        isShowServiceType: false,
        isShowMore: isShowMore
      })
      if (isShowMore) {
        this.setData({
          bgApcity: true
        })
      } else {
        this.setData({
          bgApcity: false
        })
      }
    }
  },
  // 背景图切换
  onBgTap: function () {
    this.setData({
      isShowFee: false,
      isShowArea: false,
      bgApcity: false,
      isShowServiceType: false,
      isShowMore: false
    })
  },

  //照护类型确认事件
  chooseType: function (event) {
    let index = event.currentTarget.dataset.idx;
    let selectIndex = this.data.selectIndex;
    selectIndex[index].sureid = !selectIndex[index].sureid;
    this.setData({
      selectIndex: selectIndex
    })
    // console.log(this.data.selectIndex);

    var postSelectData = [];
    var postSelectDataVal = [];
    this.data.selectIndex.forEach((item, index) => {
      if (item.sureid) {
        postSelectData.push(this.data.caretypes[index].value);
        postSelectDataVal.push(this.data.caretypes[index].name);
      }
    })
    console.log(postSelectData, postSelectDataVal);
    this.setData({
      postSelectData: postSelectData,
      postSelectDataVal: postSelectDataVal
    })
  },
  subCaretypeBtn: function () {
    let postSelectDataVal = this.data.postSelectDataVal.join('、');
    if (this.data.postSelectDataVal.length > 1) {
      postSelectDataVal = postSelectDataVal.slice(0, 3) + '...'
    }

    this.setData({
      serviceTypeView: postSelectDataVal,
      isShowServiceType: false,
      bgApcity: false
    })
    let postSelectData = this.data.postSelectData.join(",");
    this.data.dataList['serviceType'] = postSelectData;
    if (this.data.postSelectData.length < 1) {
      delete this.data.dataList.serviceType;
      this.setData({
        serviceTypeView: "照护类型"
      })
    }
    this.getRequestHttp();
  },


  //更多选择类型
  changeHouseType: function (event) {
    this.setData({
      houseType: event.currentTarget.dataset.sort
    })
    console.log(event.currentTarget.dataset.sort);
  },
  changeMedical: function (event) {
    this.setData({
      medicalType: event.target.id
    })
  },
  changeHospital: function (event) {
    this.setData({
      hasHospital: event.target.id
    })
  },
  changeGreenChannel: function (event) {
    this.setData({
      hasGreenChannel: event.target.id
    })
  },
  // 重置
  resetContext: function (event) {
    this.setData({
      houseType: "s0",
      medicalType: 'm0',
      hasHospital: "h0",
      hasGreenChannel: "g0",
    })
    delete this.data.dataList.isMedical;
    delete this.data.dataList.aroundHospital;
    delete this.data.dataList.cooperateHospital;
  },
  // 更多确定
  confirmMore: function (event) {
    this.setData({
      isShowMore: false,
      bgApcity: false
    })

    var houseType = this.data.houseType;
    if (houseType == 1) {
      this.data.dataList['houseType'] = '单人间';
    } else if (houseType == 2) {
      this.data.dataList['houseType'] = '双人间';
    } else if (houseType == 3) {
      this.data.dataList['houseType'] = '多人间';
    } else if (houseType == 4) {
      this.data.dataList['houseType'] = '套间';
    } else {
      delete this.data.dataList.houseType;
    }

    var medicalType = this.data.medicalType;
    if (medicalType == 'm1') {
      this.data.dataList['isMedical'] = '是'
    } else {
      delete this.data.dataList.isMedical;
    }

    var hasHospital = this.data.hasHospital;
    if (hasHospital == 'h1') {
      this.data.dataList['aroundHospital'] = '有'
    } else {
      delete this.data.dataList.aroundHospital;
    }

    var hasGreenChannel = this.data.hasGreenChannel;
    if (hasGreenChannel == 'g1') {
      this.data.dataList['cooperateHospital'] = '有'
    } else {
      delete this.data.dataList.cooperateHospital;
    }
    if (houseType != 's0' || medicalType == 'm1' || hasHospital == 'h1' || hasGreenChannel == 'g1') {
      this.setData({
        isShowMoreCur: true
      })
    } else {
      this.setData({
        isShowMoreCur: false
      })
    }
    this.getRequestHttp();
  },

  //city 区域事件
  selectCount: function (event) {
    var that = this;
    var countFirstpy = event.currentTarget.dataset.firstpy;
    var countName = event.currentTarget.dataset.name;
    var counts = this.data.counts;
    this.setData({
      activeIndex: event.currentTarget.id,
      area: countName,
      bgApcity: false,
      isShowArea: false
    })
    console.log(countFirstpy);
    console.log(counts);
    var firstPY = "firstPY";
    this.data.dataList[firstPY] = countFirstpy;
    if (this.data.dataList.firstPY == 'bj') {
      delete this.data.dataList.firstPY
    }
    console.log(this.data.dataList);
    this.getRequestHttp();
  },
  //附近事件
  selectNearby: function (event) {
    var that = this;
    let activeIndexnearby = event.currentTarget.dataset.sort;
    console.log(activeIndexnearby);
    let distance = event.currentTarget.dataset.value;
    let name = event.currentTarget.dataset.name;
    that.setData({
      activeIndexnearby: activeIndexnearby,
      area: name,
      bgApcity: false,
      isShowArea: false
    })
    this.data.dataList['distance'] = distance;
    if (distance == '全市') {
      delete this.data.dataList.distance;
    }
    this.getRequestHttp();
  },

  //总费用事件
  selectTotal: function (event) {
    var totalName = event.currentTarget.dataset.name;
    var totalNameSlice = totalName;
    if (totalName.length > 4) {
      totalNameSlice = totalName.slice(0, 4) + '...'
    } else {
      totalNameSlice = totalName;
    }
    this.setData({
      activeIndex2: event.currentTarget.id,
      totalName: totalName,
      pricesNum: totalNameSlice,
      bgApcity: false,
      isShowFee: false,
    })
    if (this.data.pricesNum == '不限') {
      this.setData({
        pricesNum: '总费用'
      })
    }

    var minAmt = "minAmt";
    var maxAmt = "maxAmt";
    if (this.data.totalName == '不限') {
      delete this.data.dataList.minAmt;
      delete this.data.dataList.maxAmt;
    }
    if (this.data.totalName == '3000以下') {
      this.data.dataList[minAmt] = "0000";
      this.data.dataList[maxAmt] = "3000";
    }
    if (this.data.totalName == '3000-6000') {
      this.data.dataList[minAmt] = "3000";
      this.data.dataList[maxAmt] = "6000";
    }
    if (this.data.totalName == '6000-9000') {
      this.data.dataList[minAmt] = "6000";
      this.data.dataList[maxAmt] = "9000";
    }
    if (this.data.totalName == '9000-12000') {
      this.data.dataList[minAmt] = "9000";
      this.data.dataList[maxAmt] = "12000";
    }
    if (this.data.totalName == '12000以上') {
      this.data.dataList[minAmt] = "12000";
      this.data.dataList[maxAmt] = "99999";
    }
    console.log(this.data.dataList);
    this.getRequestHttp();
  },


  //排序
  chooseSortMethod: function (e) {
    var that = this;
    var sortNum = e.currentTarget.dataset.sortnumber;
    console.log(sortNum)
    this.setData({
      activeIndexSort: sortNum,
      showSortwrap: false
    });
    var sort = "sort";
    if (this.data.activeIndexSort == 0) {
      delete this.data.dataList.sort;
    }
    if (this.data.activeIndexSort == 1) {
      this.data.dataList[sort] = '1';
    }
    if (this.data.activeIndexSort == 2) {
      this.data.dataList[sort] = '2';
    }
    if (this.data.activeIndexSort == 3) {
      this.data.dataList[sort] = '3';
    }
    if (this.data.activeIndexSort == 4) {
      this.data.dataList[sort] = '4';
    }
    this.getRequestHttp();
  },
  showSortTap: function (e) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      showSortwrap: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1)
  },
  sortWrapTap: function (e) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showSortwrap: false
      })
    }.bind(this), 200)
  },

  loadMore: function () {
    console.log('上拉加载更多');
    var newdataList = this.data.dataList;
    newdataList.pageNumber = newdataList.pageNumber + 20;
    this.setData({
      dataList: newdataList
    })
    this.getRequestHttp();
    //console.log(this.data.dataList.pageIndex);
    //console.log(this.data.dataList.pageNumber);
  },
  chooseArea: function (event) {
    let that = this;
    let idx = event.currentTarget.dataset.idx;
    if (idx == 0) {
      that.setData({
        chooseArea1: true,
        chooseArea2: false
      })
    } else {
      that.setData({
        chooseArea2: true,
        chooseArea1: false,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onShareAppMessage: function () {

  }
})