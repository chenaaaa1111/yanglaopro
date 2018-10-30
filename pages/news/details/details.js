
// pages/news/newsItem/index.js
var WxParse = require('./../../../libs/wxParse/wxParse.js');
var request = require('./../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newContent:{},
    newsdata:{},
    article:"<div></div>" 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self=this;
    var sendData={}
    wx.showLoading({
      title: '加载中',
    })
    wx.setNavigationBarTitle({
      title: options.title||"资讯详情"//页面标题为路由参数
    })
    request.getNewsDetail({}, options.id).then(function(res){
      var resArray = res.data.data;
      var createtime = resArray.createtime.split(" ")[0];
      resArray.createtime = createtime;

      self.setData({
        newsdata: res.data.data,
        article: res.data.data.newsContent
      })
      var shtml = res.data.data.newsContent
      WxParse.wxParse("article", "html", self.data.article, self, 1)
      wx.hideLoading();
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