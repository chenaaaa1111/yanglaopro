// components/recorder/recorder.js
const RECORD_READY = 0;
const RECORD_PLAYING = 1;
const RECORD_OVER = 2;
var app = getApp();
var curPage;
var api=require('./../../utils/api.js');
const recorderManager = wx.getRecorderManager();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    status: RECORD_READY
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchRecord: function (e) {
      let status = this.data.status;
      let eDetails={};
      let eOptions={};
      let t=this;
      if (status === RECORD_PLAYING) {
        this.setData({
          status: RECORD_OVER
        });
        recorderManager.stop();
        curPage.switchScroll(true);
      } else {
        wx.getSetting({
          success:(res)=>{
            console.log("res:",res);
            if (res && res.authSetting && res.authSetting['scope.record']){
              t.setData({
                status: RECORD_PLAYING
              });
              recorderManager.start({
                duration: 6000,
                sampleRate: 16000,
                frameSize: 1,
                format:'mp3'
              });
              t.triggerEvent('start', eDetails, eOptions);
              curPage.switchScroll(false);
            }else{
              let denyRecord = res.authSetting['scope.record']===false;
              wx.authorize({
                scope: 'scope.record',
                success: (res) => {
                  console.log("authorize.scope.record.success", res);
                  t.setData({
                    status: RECORD_PLAYING
                  });
                  recorderManager.start({
                    duration: 6000,
                    sampleRate: 16000,
                    frameSize: 1,
                    format: 'mp3'
                  });
                  t.triggerEvent('start', eDetails, eOptions);
                  curPage.switchScroll(false);
                },
                fail: (err) => {
                  console.log("authorize.scope.record.fail", err);
                  if (denyRecord){
                    wx.openSetting({
                      success: (res) => {
                        console.log("openSetting.success", res);
                      },
                      fail: (err) => {
                        console.log("openSetting.fail", res);
                      }
                    });
                  }
                }
              });
            }
          },
          fail:(err)=>{
            console.log("getSetting.scope.record.fail", err);
          }
        })
      }
    }
  },
  detached:function(){
    curPage=null;
  },
  ready:function(){
    let pages = getCurrentPages();
    curPage = pages.slice(-1)[0];
    curPage.switchScroll=function(enable){
      if (enable){
        this.setData({
          pageInfo: {
            height: 'auto',
            overflow: 'auto'
          }
        });
      }else{
        this.setData({
          pageInfo: {
            height: '100%',
            overflow: 'hidden'
          }
        });
      }
    }
    recorderManager.onStart((res) => {
      console.log("onStart:", res);
    });
    recorderManager.onPause((res) => {
      console.log("onPause:", res);
    });
    recorderManager.onResume((res) => {
      console.log("onResume:", res);
    });
    recorderManager.onStop((res) => {
      console.log("onStop:", res);
      this.setData({
        status: RECORD_OVER
      });
      curPage.switchScroll(true);
      let eDetails={};
      let eOptions={};
      if (res && res.tempFilePath){
        api.uploadVoice({
          name: 'voice',
          filePath: res.tempFilePath
        }).then((res) => {
          console.log("res:",res);
          if (res && res.data && res.statusCode == '200') {
            let resData = JSON.parse(res.data);
            if (resData.code == 0){
              this.triggerEvent('end', { result: resData.data}, eOptions);
            }else{
              wx.showToast({
                title: '语音识别失败，请再说一次！',
                icon:'none'
              });
              this.triggerEvent('end', eDetails, eOptions);
            }
          } else {
            wx.showToast({
              title: '语音识别失败，请再说一次！',
              icon: 'none'
            });
            this.triggerEvent('end', eDetails, eOptions);
          }
        }, (err) => {
          console.log(err);
          wx.showToast({
            title: '语音识别失败，请再说一次！',
            icon: 'none'
          });
          this.triggerEvent('end', eDetails, eOptions);
        });
      }else{
        wx.showToast({
          title: '语音识别失败，请再说一次！',
          icon: 'none'
        });
        this.triggerEvent('end', eDetails, eOptions);
      }
    });
    recorderManager.onFrameRecorded((res) => {
      console.log("onFrameRecorded:", res, );
      console.log("onFrameRecorded:", typeof res.frameBuffer);
      console.log("onFrameRecorded:", res.isLastFrame);
    });
  }
})
