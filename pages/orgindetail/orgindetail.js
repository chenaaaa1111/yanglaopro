import apis from '../../utils/api.js';
import xlStorage from '../../models/xlStorage';
import formfilter from '../../models/formfilter';
const fileManager = wx.getFileSystemManager();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    step: 1,
    butMsg: '获取验证码',
    xlOrgInfo: {},
    errorNum: 0,
    email:'',
    id: '',
    showSuccessModule: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    xlStorage.getOrgInfoFromStorage().then((res)=>{
      if(!res){ res = xlStorage.removeOrgInfoConfig(); };
      res.type = options.type || 1;
      this.setData({
        xlOrgInfo: res
      });
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
    xlStorage.saveOrgInfoFromStorage(this.data.xlOrgInfo);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    xlStorage.saveOrgInfoFromStorage(this.data.xlOrgInfo);
    // wx.showModal({
    //   content: '入驻信息还未提交，确认放弃填写吗？',
    //   showCancel: true,
    //   cancelText: '放弃',
    //   confirmText: '继续填写',
    //   success: function(res) {
    //     if (res.confirm) {
    //       wx.navigateTo({
    //         url: '/pages/orgindetail/orgindetail'
    //       });
    //     } else if (res.cancel) {
    //     }
    //   }
    // });
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
  
  },
  xlSubmit() {
    let that = this;
    if(that.data.xlOrgInfo.orgName) {
      if(that.data.xlOrgInfo.contactName) {
        if(formfilter.checkPhoneNum(that.data.xlOrgInfo.contactPhone)) {
          if(that.data.xlOrgInfo.contactCertificate.datas.length) {
            if(that.data.xlOrgInfo.orgLicense.datas.length) {
              if(that.data.xlOrgInfo.orgAddr) {
                if(that.data.xlOrgInfo.orgIntroduce) {
                  if(that.data.xlOrgInfo.orgTell) {
                    wx.showLoading({
                      title: '信息提交中...',
                    });
                    apis.pensionReside(that.getSubmitData()).then((res) => {
                      wx.hideLoading();
                      if(res.data.code === 0){
                        wx.showModal({
                            content: '入驻信息保存成功！',
                            showCancel: false,
                            confirmText: '确定',
                            success: function () {
                              that.setData({
                                step: 3,
                                id: res.data.data.id,
                                xlOrgInfo: xlStorage.removeOrgInfoConfig()
                              });
                            }
                        });
                      }else {
                        wx.showModal({
                            content: res.data.msg,
                            showCancel: false,
                            confirmText: '确定',
                            success: function (res) {
                            }
                        });
                      }
                    })
                  }else {
                    wx.showModal({
                      content: '您有必填内容没有写(机构对外联系电话)',
                      showCancel: false,
                      confirmText: '确认',
                      success: function(res) { that.setData({ errorNum: 10 }); }
                    });
                  }
                }else {
                  wx.showModal({
                    content: '您有必填内容没有写(机构简介)',
                    showCancel: false,
                    confirmText: '确认',
                    success: function(res) { that.setData({ errorNum: 9 }); }
                  });
                }
              }else {
                wx.showModal({
                  content: '您有必填内容没有写(机构地址)',
                  showCancel: false,
                  confirmText: '确认',
                  success: function(res) { that.setData({ errorNum: 8 }); }
                });
              }
            }else {
              wx.showModal({
                content: '您有必填内容没有写(机构营业执照)',
                showCancel: false,
                confirmText: '确认',
                success: function(res) { that.setData({ errorNum: 7, step: 1 }); }
              });
            }
          }else {
            wx.showModal({
              content: '您有必填内容没有写(联系人证照)',
              showCancel: false,
              confirmText: '确认',
              success: function(res) { that.setData({ errorNum: 6, step: 1 }); }
            });
          }
        }else {
          wx.showModal({
            content: '您有必填内容没有写(联系人手机电话)',
            showCancel: false,
            confirmText: '确认',
            success: function(res) { that.setData({ errorNum: 4, step: 1 }); }
          });
        }
      }else {
        wx.showModal({
          content: '您有必填内容没有写(联系人姓名)',
          showCancel: false,
          confirmText: '确认',
          success: function(res) { that.setData({ errorNum: 2, step: 1 }); }
        });
      }
    }else {
      wx.showModal({
        content: '您有必填内容没有写(机构名称)',
        showCancel: false,
        confirmText: '确认',
        success: function(res) { that.setData({ errorNum: 1, step: 1 }); }
      });
    }
  },
  xlCancel() {
    wx.showModal({
      content: '确认放弃填写吗？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确认',
      success: function(res) {
        if (res.confirm) {
          wx.navigateBack({ delta: 1 });
        } else if (res.cancel) {
        }
      }
    });
  },
  inputEmail(e) {
    this.setData({
      email: e.detail.value
    })
  },
  xlGetInfoTabelFile() {
    let that = this;
    if(formfilter.checkEmail(this.data.email)) {
      wx.showLoading({
        title: '提交中...',
      });
      apis.pensionEmail({id	:that.data.id,email: that.data.email}).then(res=>{
        wx.hideLoading();
        if(res.data.code === 0){
          wx.showModal({
              content: '邮件已发送到您的邮箱！',
              showCancel: false,
              confirmText: '确定',
              success: function (res) {
                that.setData({
                  showSuccessModule: true
                })
              }
          });
        }else {
          wx.showModal({
              content: res.data.msg,
              showCancel: false,
              confirmText: '确定',
              success: function (res) {
              }
          });
        }
      }).catch(err=>{
        wx.hideLoading();
        wx.showToast({title:"提交失败",icon:'none'});
      });
    }else {
      wx.showModal({
        content: '邮箱格式不正确！',
        showCancel: false,
        confirmText: '确认',
        success: function(res) {}
      });
    }
  },
  xlgoStep1(){
    this.setData({
      step: 1
    });
  },
  xlgoStep2(){
    this.setData({
      step: 2
    });
  },
  xlInputBox1(e) {
    let xlOrgInfo = this.data.xlOrgInfo;
    xlOrgInfo[e.currentTarget.dataset.inputname] = e.detail.value;
    this.setData({
      xlOrgInfo
    });
  },
  xlGetSMSCode() {
    let that = this;
    if(formfilter.checkPhoneNum(that.data.xlOrgInfo.contactPhone)) {
      if(this.data.butMsg == "获取验证码") {
        let time = 30;
        wx.showLoading({
          title: '加载中...',
        });
        let timer = setInterval(function(){
          if(time > 0) {
            that.setData({
              butMsg: time-- + 's后重新获取'
            })
          }else {
            that.setData({
              butMsg: "获取验证码"
            });
            clearInterval(timer);
          };
        },1000)
        /*** 发送请求 */
        apis.sendSMS({tel:that.data.xlOrgInfo.contactPhone}).then(res=>{
          wx.hideLoading();
          wx.showToast({title:"获取验证码成功！",icon:'none'});
        }).catch(err=>{
          wx.hideLoading();
          wx.showToast({title:"获取验证码失败！",icon:'none'});
        })
      }
    }else {
      wx.showModal({
        content: '手机号码错误！',
        showCancel: false,
        confirmText: '确认',
        success: function(res) { that.setData({ errorNum: 4 }); }
      });
    }
  },
  xlFileBox1Remove(e) {
    let xlOrgInfo = this.data.xlOrgInfo;
    xlOrgInfo[e.currentTarget.dataset.inputname].datas.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      xlOrgInfo
    });
  },
  xlFileBox1Add(e) {
    let that = this;
    let nowLength = that.data.xlOrgInfo[e.currentTarget.dataset.inputname].datas.length;
    let maxLength = that.data.xlOrgInfo[e.currentTarget.dataset.inputname].max;
    if(nowLength < maxLength) {
      wx.chooseImage({  
        count: 1,
        success: function (res) {
          let xlOrgInfo = that.data.xlOrgInfo;
          xlOrgInfo[e.currentTarget.dataset.inputname].datas.push(res.tempFilePaths[0]);
          that.setData({
            xlOrgInfo
          });
        },
        fail: function(){
          wx.showModal({
            content: '获取图片失败，请重试！',
            showCancel: false,
            confirmText: '确认',
            success: function(res) {
            }
          });
        }
      })
    }else {
      wx.showModal({
        content: '本栏目最多只能上传' + maxLength + '张图片',
        showCancel: false,
        confirmText: '确认',
        success: function(res) {
        }
      });
    }
  },
  getImgBase64(url) {
    return 'data:image/jpg;base64,' + fileManager.readFileSync(url, 'base64');
  },
  getSubmitData() {
    let that = this;
    let data = JSON.parse(JSON.stringify(that.data.xlOrgInfo));
    Object.keys(data).forEach((item) => {
      if(item == 'contactCertificate' || item == 'orgLicense' || item == 'orgLogo' || item == 'orgPhotots' || item == 'orgService') {
        data[item].datas.forEach((item2,index2) => {
          data[item].datas[index2] = that.getImgBase64(item2);
        });
      }
    })
    return data;
  }
})