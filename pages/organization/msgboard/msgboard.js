import apis from '../../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    scrollHeight: 0,
    pageIndex: 1,
    pageNumber: 10,
    searchLoading: false,
    searchLoadingComplete: false,
    msgboards: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let postid = options.id;
    this.setData({
      postid: postid
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    console.log(this.data.scrollHeight);
    this.loadMore();
  },
  searchScrollLower: function (event) {
    let dataLen = this.data.msgboards.length;
    let pageNum = parseFloat(this.data.pageNumber);
    let that = this;
    pageNum = pageNum + 10;
    let pageLen = pageNum;
    this.setData({
      pageNumber: pageNum,
      searchLoading: true,
      searchLoadingComplete: false
    })
    this.loadMore();
    if (dataLen + 10 < pageLen) {
      this.setData({
        searchLoading: false,
        searchLoadingComplete: true
      })
    }
  },
  loadMore: function (event) {
    let that = this;
    apis.getComments({
      'itemId': this.data.postid,
      'itemType': '1',
      'pageIndex': this.data.pageIndex,
      'pageNumber': this.data.pageNumber
    }).then((res) => {
      if (res.data.code == 0) {
        let msgboards = res.data.data;
        let msgboardsarr = [];
        let msgData = msgboards.forEach(function (item, index) {
          let phone = item.phone;
          let createTime = item.createTime;
          let comment = item.comment;
          let star = parseFloat(item.star);
          let updateTime = item.updateTime;
          let replyComment = item.replyComment;
          let replyShow = false
          if (item.updateTime != null && item.replyComment != null){
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
        console.log(that.data.msgboards);
      }
    });
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