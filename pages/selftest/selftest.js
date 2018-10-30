// pages/selftest/selftest.js
var questionnaire= require('./../../models/questionnaire.js');
import { addSurvey} from './../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: [],
    testing:false,
    ended:false,
    answers:[],
    num:0,
    end:false,
    healthy:true,
    isChange:false,
    showPhone:false
  },
  start:function(event){
      this.setData({testing:true})
  },
  gotoactive:function(e){
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    questionnaire.initQuestions();
    let questData = questionnaire.getNextQuestion();
    this.setData({
      question: questData
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
       console.log(111);
 


       return;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log(222);
    return;

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
  onAnswerChanged: function (e) {
    var self=this;
    console.log("onAnswerChanged:", e);
    var anser = e.detail.selectedOption[0];
    if(anser=='是'){
      this.setData({ num: self.data.num+1})
    }
    this.setData({ isChange:true })
  },
  stepNext: function (e) {
    if (!this.data.isChange) {
      return;
    }
    if (questionnaire.quesConfig.hasNext){
      let question=questionnaire.getNextQuestion();
      console.log('isch',this.data.isChange==false);
     
      this.setData({
        question: question, isChange:false
      });
    }else{
      console.log(this.data.num);
      this.setData({ testing:false,end:true})
      if (this.data.num>=2){
        this.setData({ healthy:false})
        var sendData = { 'answerContent': '1', 'type':2}
        addSurvey(sendData).then((res)=>{
          
        })
       }else{
        var sendData = { 'answerContent': '2', 'type': 2 }
        addSurvey(sendData).then((res) => {
       
        })
       }
    }
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
  onUnload:function(e){
    questionnaire.resetQuestionnaire();
  }
})