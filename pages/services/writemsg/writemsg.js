var api = require('./../../../utils/api.js');
var city = require('./../../../utils/city.js');
var config = require('./../../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: true,
    phone: '',
    comment: '',
    placeholdP: '请留下您的手机号码，方便我们联系您',
    placeholdC: '请写下您的留言，最多200字',
    msgStatus: '2',
    grayStar: 5,
    lightStar: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let postid = options.id;
    let title = options.title;
    this.setData({
      itemId: postid,
      title: title
    })
  },
  chooseGrayStar: function (event) {
    let idx = event.currentTarget.dataset.idx + 1;
    this.setData({
      grayStar: this.data.grayStar - idx,
      lightStar: this.data.lightStar + idx
    })

  },
  chooseLightstar: function (event) {
    let idx = event.currentTarget.dataset.idx + 1;
    let lightStar = this.data.lightStar;
    if (lightStar != idx) {
      this.setData({
        lightStar: idx,
        grayStar: 5 - idx
      })
    }
  },
  cancel: function (event) {
    let that = this;
    wx.showModal({
      content: '确认放弃您的留言？',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            phone: '',
            comment: '',
            grayStar: 5,
            lightStar: 0
          })
          wx.navigateBack({
            delta: 1
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  formSubmit: function (event) {
    var that = this;
    var phone;
    var comment = event.detail.value.textarea;
    if (this.data.loginStatus) {
      phone = this.data.phone;
    } else {
      phone = event.detail.value.input;
      if (phone.length == 0) {
        wx.showToast({
          title: "请输入手机号！",
          icon: 'none'
        })
        return false;
      }
      if (phone.length != 11) {
        wx.showToast({
          title: "手机号长度有误！",
          icon: 'none'
        })
        return false;
      }
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!myreg.test(phone)) {
        wx.showToast({
          title: '手机号有误！',
          icon: 'none'
        })
        return false;
      }
    }
    let star = this.data.lightStar;
    if (star === 0) {
      wx.showToast({
        title: "请选择您对该机构的总体评价！",
        icon: 'none'
      })
      return false;
    }
    let commentVal = comment.replace(/(^\s*)|(\s*$)/g, "");
    this.setData({
      commentVal: commentVal,
      phone: phone
    })
    let itemId = this.data.itemId;
    let itemType = '2';
    let phoneVal = this.data.phone;
    let commentValnew = this.data.commentVal;
    if (commentVal == " " || commentVal == "") {
      wx.showToast({
        title: '内容不能为空！',
        icon: 'none'
      })
      return false;
    }

    api.addComments({
      'phone': phoneVal,
      'itemId': itemId,
      'itemType': itemType,
      'star': star,
      'comment': commentValnew
    }).then((res) => {
      console.log(res);
      let statusCode = res.statusCode.toString();
      console.log(statusCode);
      if (statusCode.startsWith('2')) {
        that.setData({
          msgStatus: '1',
          phone: '',
          comment: '',
          grayStar: 5,
          lightStar: 0
        })
        console.log(res);
      }
    }).catch((err) => {
      that.setData({
        msgStatus: '0',
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
    let userLoginInfo = wx.getStorageSync('userLoginInfo');
    if (!userLoginInfo || !userLoginInfo.token) {
      //未登录
      this.setData({
        loginStatus: false
      })
    } else {
      //已登录
      let phone = userLoginInfo.phone;
      this.setData({
        loginStatus: true,
        phone: phone
      })
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
  onShareAppMessage: function () {

  }
})