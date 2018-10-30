// pages/test/test.js
var questionnaire=require('./../../models/questionnaire.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question:{} 
  },
  testData: function () {
    let optionValues = ['1分', '2分', '3分', '4分', '5分'];
    let len = optionValues.length;
    let total = 3;
    let questionext = {
      qId: '',
      title: '请列举您印象深刻的养老机构，并进行满意度打分',
      remark: '此题为：非必填',
      type: 'single',
      options: []
    };
    for (let i = 0; i < total; i++) {
      let question = {};
      let options = [];
      for (let j = 0; j < len; j++) {
        let option = {
          id: j,
          value: optionValues[j],
          label: optionValues[j],
          selected: false
        };
        options.push(option);
      }
      question.qId = 'questionext' + i;
      question.type = 'single';
      question.title = ['机构', i + 1, ':'].join('');
      question.options = options;
      questionext.options.push(question);
    }
    console.log("questionext:", questionext);
    return questionext;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    questionnaire.initQuestions();
    let question={
      qId: '',
      title: '您在养老方面，或者使用「北京养老地图 - 小程序」的时候，有哪些困扰 / 不方便？',
      remark: '此题为：单选',
      type: 'multi',
      maxSelected:3,
      textareaValue:'',
      other:false,
      otherValue:'',
      options: [{
        id: '0',
        value: '乐意接受',
        label: '乐意接受',
        extra: '有专业的照料，生活更轻松，积蓄和养老金可支付',
        selected: false
      }, {
          id: '0',
          value: '比较愿意接受',
          label: '比较愿意接受',
          extra: '不想/不需要麻烦子女，自己的养老金可支付',
          selected: false
        },{
          id: '2',
          value: '可以接受',
          label: '可以接受',
          extra: '子女在外或无力照料',
          selected: false
        }, {
          id: '3',
          value: '勉强接受，但不情愿',
          label: '勉强接受，但不情愿',
          extra:'身体实在不能自理的情况',
          selected: false
        }, {
          id: '4',
          value: '完全不接受',
          label: '完全不接受',
          extra:'养儿防老',
          selected: false
        }],
      answer: []
    }
    let questionextData =this.testData();
    // console.log('questionnaire:', questionnaire);
    this.setData({
      question,
      questionextData
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
  
  },
  onRadioButtonTap:function(e){
    console.log("onRadioButtonTap:",e);
  },
  onAnswerChanged:function(e){
    console.log("onAnswerChanged:",e);
  },
  stepNext:function(e){

  },
  speechStart:function(e){
    console.log("speechStart:",e);
  },
  speechEnd:function(e){
    console.log("speechEnd:", e);
  }
})