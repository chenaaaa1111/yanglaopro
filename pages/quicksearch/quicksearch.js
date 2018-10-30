// pages/quickSearch/index.js
var request = require('./../../utils/api.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    serverType:"s0",
    checkedServicItem:[],
    serviceTypeItems:[],
    houseTypeArray:[],
    min: '',
    max: '',
    scopeArray:[],
    fees:"",
    feesArray:[],
    serverData:[{title:"","itemArray":[{"ss":11}]}],
    area:"",
    house:"",
    scopeArray:[],
    houseType:''

  },
  chanserver(evt){
    var that=this;
    var id = parseInt(evt.currentTarget.id);
      var sarray = this.data.serviceTypeItems;
      var stya = this.data.serviceTypeItems;
      var isHas=false;
      var index='';
      var isChecked='';
      for(var sid in stya){
          if(stya[sid].id==id){
            stya[sid].isCheck=!stya[sid].isCheck;
            isChecked = stya[sid];
            break;
          };
      }
      var checkedArr = this.data.checkedServicItem;
      if (checkedArr.length==0){
        checkedArr.push(isChecked.id)
      }else{
        for (var ch in checkedArr) {
          if (checkedArr[ch]== (id)) {
            isHas=true;
            index=ch;        
          }         
        }
        if (isHas) {
          checkedArr.splice(index, 1)
        } else {
          checkedArr.push(isChecked.id)
        }
      }
      this.setData({
        serverType: evt.target.id,
        serviceTypeItems: stya,
        checkedServicItem: checkedArr
      })

  },
  changeHouse(evt){
    if (this.data.house == evt.target.id){
      this.setData({
        house: '',
        houseType: ''
      })
      return;
    }
    this.setData({
      house: evt.target.id,
      houseType: evt.currentTarget.dataset.parameter
    })
  },
  chooseFee(evt){
  
    if (evt.currentTarget.id==this.data.fees){
      this.setData({
        fees: ''
      })
      return
    }
    this.setData({
      fees: evt.currentTarget.id
    })
    if (evt.currentTarget.id=='all'){

    }else{
      var val = evt.currentTarget.dataset.val;
      var min = val.split('-')[0];
      var max = val.split('-')[1];
      if (max == undefined){
        if(min.indexOf('下')>0){
          max = parseInt(min);
          this.setData({
            max: max,
            min:'0'
          })
        }else{
          min=parseInt(min);
          this.setData({
            min: min,
            max:9999999
          })
        }
      }else{
        this.setData({
          min: min,
          max: max
        })
      }
     
    }
   
  
  },
  choosearea(evt){
    if (evt.currentTarget.id == this.data.area){
      this.setData({
        area: ''
      })
      return;
    }
    this.setData({
      area: evt.target.id
    })
  },
  refrush(evt){
    var sud = this.data.serviceTypeItems;
    for (var i in sud){
      if (sud[i].isCheck==true){
        sud[i].isCheck = false;
      }  
    }
    var sudla = new Array();
    sudla = sud;
    this.setData({
      serverType: "",
      fees: "",
      area: "",
      house: "",
      min:'',
      max:'',
      houseType:'',
      checkedServicItem:[],
      serviceTypeItems: sudla
    })  
  },
  makeSure(evt){
    var self=this;
    var uldata ='?isFrom=1';
    if (self.data.checkedServicItem.length!=0){
      uldata += '&serviceType=' + self.data.checkedServicItem;
    }
    if (this.data.fees == "all" || this.data.fees==''){
    }else{
      if (this.data.min){
        uldata += "&minAmt=" + this.data.min
      }
      if (this.data.max){
        uldata += "&maxAmt=" + this.data.max;
      }
    }
    if (self.data.area == 'a1' || self.data.area==''){
    }else{
      if (self.data.area){
        uldata += "&firstPY=" + self.data.area
      }
    }
    if (self.data.houseType!=''){
      uldata += "&houseType=" + self.data.houseType;

    }
    var service = self.data.checkedServicItem.join(",");
      wx.navigateTo({
        url: '/pages/organization/list/list'+uldata
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var self=this;
    var sendData={'type':'1'}
    request.getCityArea(sendData).then(function(res){
      self.setData({
          scopeArray:res.data.data
        })
    })
    request.getDictInfo({"type":'1'}).then(function(res){//照护类型
        var serv =res.data;
        for(var se in serv){
            serv[se].isCheck=false;
        }
        self.setData({
          serviceTypeItems:res.data
        })
    })
    request.getDictInfo({ "type": '3' }).then(function (res) {//房型   
          self.setData({
            houseTypeArray:res.data
          })
    })
    request.getDictInfo({ "type": '6' }).then(function (res) {//房型   
      self.setData({
        feesArray: res.data
      })
    })
       
  
 
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
  onPullDownRefresh: function ( e) {
  
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