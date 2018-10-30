// pages/search/search.js
var request = require('./../../utils/api.js');
var citys=require('./../../utils/config.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    seachtype:1,//搜索类型，1机构2服务3资讯
    placehold:"请输入机构养老名称、地址",
    seachValue:'',
    bnum:0,
    showtext:true,
    focus:true,
    cityName:'bj',
    keyWords:'',
    isnoNull:false,
    showhistory:true,
    items:[],
    history:[],//搜索历史
    cityCode: citys.nowCityCode,
    seachFocus:false,
    seachItem:[],
    array: []
  },
  hideText:function(res){
      this.setData({
        showtext:false
      })
  },
  hisGotoList:function(e){
     var value = e.currentTarget.dataset.value;
     if (this.data.seachtype == 1) {
       //跳转养老机构详情
       wx.redirectTo({
         url: './../../pages/organization/list/list?keywords=' + value,
       })
     } else if (this.data.seachtype == 2) {
       //跳转养老服务
       wx.redirectTo({
         url: './../../pages/services/list/list?keywords=' + value,
       })
     } else {
       //资讯列表暂时不跳转了   
     }
      },
  gotoList:function(e){//点击确定按钮的时候
    console.log(e.detail.value);
    var cityCode = citys.nowCityCode;
    console.log(cityCode);
    var keywords = e.detail.value; 
    var historylist='';
    this.setHistory({ value: e.detail.value})
    if (this.data.seachtype == 1) {
      //跳转养老机构详情
      wx.redirectTo({
        url: './../../pages/organization/list/list?keywords=' + keywords,
      })
    } else if (this.data.seachtype == 2) {
      //跳转养老服务
      wx.redirectTo({
        url: './../../pages/services/list/list?keywords=' + keywords,
      })
    } else {
      //资讯列表暂时不跳转了   
    }
  },
  speechEnd:function(e){
    console.log('语音',e);
    var detail=e.detail;   
    if(detail){
      var result=detail.result;
      this.setData({ seachValue: result});
      this.data.placehold = result;
      console.log('seachValue', this.data.seachValue)
    }else{

    }
  },
  chfocus:function(e){
      this.setData({
        focus:true
      })
  },
  showHistory(seachType){
    var history=wx.getStorageSync(this.data.cityCode);
    if (seachType==1){
      this.setData({ history: history[0], seachItem:[]});
    }else if(seachType==2){
      this.setData({ history: history[1], seachItem: [] });
    }
  },
  oninput:function(evt){
  
    this.setData({showhold:true})
    if (evt.detail.cursor==0){//显示清除叉号
      this.setData({
        isnoNull:false    
      })
      this.showHistory(this.data.seachtype)
    }else{
      this.setData({
        isnoNull: true,
        history: []
      })
    }
    var value = this.Trim(evt.detail.value);
    if(value==''||value==undefined){
      
    }
    var self = this;
    self.setData({
      keyWords: value
    })
    var senddata = {
      keyWords: value,
      "ident": 1
    }
    if (this.data.seachtype == 1) {
      request.getOrganizationWithFilters(senddata).then(function(res){
        var seait = res.data.data;
        if (seait.length == 0 && value) {
          seait.push({
            id: "notHas",
            beadServiceName: '未找到符合这要求的搜索项'
          })
        }
        self.setData({
          seachItem: res.data.data
        })
      });
     
    } else if (this.data.seachtype == 2) {
      var severdata = { keywords: value, "ident": 1}
      request.getFuwuList(severdata ).then(function(res){
        var seait = res.data.data;
        if (seait.length == 0 && value) {
          seait.push({
            id: "notHas",
            beadServiceName: '未找到符合这要求的搜索项'
          })
        }
        self.setData({
          seachItem: res.data.data
        })
      });
   
    } else if (this.data.seachtype == 3) {
      var newsdata = { words: value,"ident":1};
      request.getNewsList(newsdata).then(function(res){
        var seait = res.data.data;
        if (seait.length == 0 && value) {
          seait.push({
            id: "notHas",
            beadServiceName: '未找到符合这要求的搜索项'
          })
        }
        self.setData({
          seachItem: res.data.data
        })     
         })
    }
  }, 
  blurhandle:function(e){ 
    this.setData({ "focus": false, bnum: this.data.bnum+1});
  },
  focusHandle:function(e){
    this.setData({ "focus": true });
  },
  Trim:function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  chSeach:function(evt){
    this.setData({
      seachtype: evt.target.id,
      placehold: evt.target.dataset.placehold,
      seachItem:[]
    });
    var historylist='';
    var cityCode = citys.nowCityCode;
    var self=this;
    wx.getStorage({
      key: cityCode,
      success: function (res) {
        historylist = res.data;
        // console.log('res', res);
        if (self.data.seachtype == 1) {
          self.setData({
            history: historylist[0]
          })
        } else if (self.data.seachtype == 2){
          self.setData({
            history: historylist[1]
          })
        }else{
          self.setData({ history:[]});
        }
      },
    });
  
  },
  goToItem(evt){//点击自动填充补充 跳转详情页
      var id = evt.currentTarget.id;
      var value = evt.currentTarget.dataset.value;
      console.log(value);
      this.setHistory({ value: value })
    if (id !='notHas'){
      if (this.data.seachtype == 1) {
        //跳转养老机构详情
        wx.navigateTo({
          url: './../../pages/organization/details/details?id=' + id,
        })       
      } else if (this.data.seachtype == 2) {
        //跳转养老服务
        wx.navigateTo({
          url: './../../pages/services/details/details?serviceId=' + id,
        })
      } else {
        //跳转咨询详情
        wx.navigateTo({
          url: './../../pages/news/details/details?id=' + id,
        })
      }
    }
  },
  goahead:function(evt){
    var keyWords = this.data.keyWords;
    console.log(this.data.keyWords)
    var cityCode = citys.nowCityCode;
    var historylist = '';
    this.setHistory({ value: keyWords })
    if (this.data.seachtype == 1) {
      //跳转养老机构详情
      wx.redirectTo({
        url: './../../pages/organization/list/list?keywords=' + keyWords,
      })
    } else if (this.data.seachtype == 2) {
      //跳转养老服务
      wx.redirectTo({
        url: './../../pages/services/list/list?keywords=' + keyWords,
      })
    } else {
      //资讯列表暂时不跳转了   
    }
  },
  clearInput:function(evt){
    
    this.setData({ 
      seachFocus:false,
      seachValue: '',
      seachItem:[],
      isnoNull:false
    })
  },
  setHistory(history){
    var cityCode = citys.nowCityCode;
    var self=this;
    console.log(self.data.seachtype);
    var historyList={};
    historyList = wx.getStorageSync(cityCode)
    var sle = historyList?historyList.length:0;
    if (sle == 0) {
      historyList = [[],[]]
    }
    if (self.data.seachtype == 1) {
      var ishas = false;
      var _index=0;
      historyList[0].forEach((item,key)=>{
        if (item.value == history.value){
          ishas=true;
           _index=key;
        }
      })
      if (ishas){
        historyList[0].splice(_index, 1);
        historyList[0].unshift(history);
        wx.setStorageSync(
          cityCode,
          historyList
        )
          return;
      }
      historyList[0].unshift(history);
      if (historyList[0].length > 10) {
        historyList[0].pop();
      }
      historyList = historyList;
      wx.setStorageSync(
        cityCode,
        historyList
      )
    } else if (self.data.seachtype == 2) {
      var ishas=false;
      var _index = 0;
      historyList[1].forEach((item,key )=> {
        if (item.value == history.value) {
          ishas=true;
          _index = key;
        }
      })
      if (ishas){
        historyList[1].splice(_index, 1);
        historyList[1].unshift(history);
        wx.setStorageSync(
          cityCode,
          historyList
        )
        return;
      }
      historyList[1].unshift(history);
      if (historyList[1].length > 10) {
        historyList[1].pop();
      }
      historyList = historyList;
      wx.setStorageSync(
        cityCode,
        historyList
      )
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.seachType){
      this.setData({
        seachtype: options.seachType
      }) 
    } 
    
    var cityCode = this.data.cityCode;
    var history = wx.getStorageSync(cityCode);
    if (history && history.length != 0) {
      if (this.data.seachtype == 1) {
        this.setData({ history: history[0] })
      } else if (this.data.seachtype == 2) {
        this.setData({ history: history[1] })

      }
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