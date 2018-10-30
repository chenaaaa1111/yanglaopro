// pages/news/index.js
var apirequest=require('./../../../utils/api.js');
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    isActive:true,
    num:1,
    isHas:true,
    keywords:'',
    selected:3,
    newsTypes:[],
    newList:[{}],
    pageIndex:0,
    pageNumber:20,
    imageFormat: "172x160",
    title:'大事记',
    toView:'s0',
    tuinview:"",
    sleft:0
  },
  changeActive: function (event){
    var activeNum = event.currentTarget.dataset.current;
    var title=event.currentTarget.dataset.title;
    wx.showLoading({
      title: '加载中',
    });
    var pageNumber = this.data.pageNumber;
    var imageFormat = this.data.imageFormat;
    this.setData({ selected: activeNum, title: title, isHas: true});
    var self=this;
    var sendData = { pageIndex: 1, pageNumber: pageNumber, imageFormat: imageFormat, newsTypeId: activeNum };
    apirequest.getNewsList(sendData).then(function (res) {
      var resdata = res.data.data;
      self.setData({ pageIndex:1})
      for (var se in resdata) {
        var dateTime = resdata[se].createtime;
        var  starttime = dateTime.replace(new RegExp("-", "gm"), "/");
        var starttimeHaoMiao = (new Date(dateTime)).getTime(); //得到毫秒数
        var nowTime=(new Date()).getTime();
        var lastTime = parseInt(nowTime - starttimeHaoMiao)/(1000*3600);

        console.log('starttimeHaoMiao', lastTime);

        var createtime = resdata[se].createtime.split(" ")[0];
        console.log(createtime);
        if (lastTime<1){
          resdata[se].createtime = '刚刚';
        }else{
          resdata[se].createtime = createtime;
        }
      }
      self.setData({
        newList: resdata,
        pageIndex:1
      })
      wx.hideLoading();
    })
  },
  gotoItem:function(evt){
    var self=this;
    var mti = self.data.title;
       wx.navigateTo({
         url: '/pages/news/details/details?id=' + evt.currentTarget.id + "&title=" + mti
       })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options',options);
    var sele = options.id? options.id :0;  
    var tovie = 's' + sele;
    console.log('toView',tovie);
    this.setData({ toView: tovie})
      this.setData({ selected: sele});
    var self=this;
    wx.showLoading({
      title: '加载中'  
    });
    //请求资讯类型
    apirequest.getNewsType({}).then(res=>{ 
        var newsTypes=res.data.data;
        var selected = options.id ? options.id: newsTypes[0].id;
        self.setData({
          newsTypes: newsTypes,
          selected: selected,
         
        });
      var selfto = self.data.toView
        self.setData({
          toView: selfto
        })
        var sendData = { pageIndex: 1, pageNumber: pageNumber, imageFormat: imageFormat, newsTypeId: selected };
        apirequest.getNewsList(sendData).then(function (res) {
          self.setData({ pageIndex:1})
          var resdata = res.data.data;
          for (var se in resdata) {
            var dateTime = resdata[se].createtime;
            var starttime = dateTime.replace(new RegExp("-", "gm"), "/");
            var starttimeHaoMiao = (new Date(dateTime)).getTime(); //得到毫秒数
            var nowTime = (new Date()).getTime();
            var lastTime = parseInt(nowTime - starttimeHaoMiao) / (1000 * 3600);

            console.log('starttimeHaoMiao', lastTime);

            var createtime = resdata[se].createtime.split(" ")[0];
            console.log(createtime);
            if (lastTime < 1) {
              resdata[se].createtime = '刚刚';
            } else {
              resdata[se].createtime = createtime;
            }
          }
          self.setData({
            newList: resdata
          })
          wx.hideLoading();
        })
    });
    var pageIndex = this.data.pageIndex + 1;
    var pageNumber = this.data.pageNumber;
    var imageFormat = this.data.imageFormat;
    var sendData = { pageIndex: pageIndex, pageNumber: pageNumber, imageFormat: imageFormat, newsTypeId: self.data.selected };
 
  },
  scrolltolowerHandle:function(e){
    var self=this;
    if(this.data.isHas){
      wx.showLoading({
        title: '加载中',
      })
      var pageIndex = this.data.pageIndex + 1;
      var pageNumber = this.data.pageNumber;
      var imageFormat = this.data.imageFormat;
      var senddata = { pageIndex: pageIndex, pageNumber: pageNumber, imageFormat: imageFormat, newsTypeId: self.data.selected};
      apirequest.getNewsList(senddata).then(res => {
        // console.log(res);
        wx.hideLoading();
        var newData=res.data.data;
        if (newData.length==0){
            self.setData({
              isHas:false
            })
        }
        var oldList = self.data.newList;
        var resdata = res.data.data;
        for (var se in resdata) {
          var dateTime = resdata[se].createtime;
          var starttime = dateTime.replace(new RegExp("-", "gm"), "/");
          var starttimeHaoMiao = (new Date(dateTime)).getTime(); //得到毫秒数
          var nowTime = (new Date()).getTime();
          var lastTime = parseInt(nowTime - starttimeHaoMiao) / (1000 * 3600);

          console.log('starttimeHaoMiao', lastTime);

          var createtime = resdata[se].createtime.split(" ")[0];
          console.log(createtime);
          if (lastTime < 1) {
            resdata[se].createtime = '刚刚';
          } else {
            resdata[se].createtime = createtime;
          }
        }
        self.setData({
          newList: resdata
        })
        wx.hideLoading();
        var newList = oldList.concat(resdata);
        self.setData({ pageIndex: pageIndex,
          newList: newList
        })
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