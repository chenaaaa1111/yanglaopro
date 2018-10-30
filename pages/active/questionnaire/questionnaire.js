var questionnaire = require('./../../../models/questionnaire.js');
var api = require('./../../../utils/api.js');
var city = require('./../../../utils/city.js');
var config = require('./../../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startup: false,
    onaStartup: false,
    pubshow: 0,
    currentPage: 1,
    selectedOption: [],
    questionIndex: 0,
    notRequired: false,
    isQuestionextData: false,
    postData: {},
    userName: '',
    age: '',
    textareaValue:'',
    otherValue:'',
    phone: '',
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getQuestionList();
  },
  onStartup() { 
    if (this.data.onaStartup) {
      this.revampData();
      this.setData({
        startup: true,
        pubshow: 1
      })
    }
  },
  onAnswerChanged(e) {
    console.log(e);
    let qId = e.detail.qId;
    let selectedOption = e.detail.selectedOption;
    qId = Number(qId);
    this.data.postData[qId] = selectedOption;
    this.setData({
      selectedOption: selectedOption
    })
    console.log(this.data.selectedOption);
  },
  stepNext(e) {
    this.setData({
      textareaValue: '',
      otherValue:''
    })
    if (this.data.maxNum || this.data.maxNum != null) {
      if (this.data.selectedOption.length > this.data.maxNum) {
        this.setData({
          showModal: true
        })
        return false;
      }
    }

    if (this.data.selectedOption.length == 0 && this.data.required == true) {
      wx.showToast({
        title: "此题为必填项！",
        icon: 'none'
      })
      return false;
    } else {
      console.log(this.data.postData);
      if (this.data.currentPage < this.data.dataLen) {
        this.setData({
          currentPage: this.data.currentPage + 1,
          questionIndex: this.data.questionIndex + 1
        })
        this.revampData();
        if (this.data.postData[this.data.questionIndex] == undefined) {
          this.data.postData[this.data.questionIndex] = null;
        }
        if (this.data.postData[this.data.dataLen] == undefined) {
          this.data.postData[this.data.dataLen] = null;
        }   
        console.log(this.data.postData[this.data.questionIndex]);
      } else {
        this.setData({
          startup: true,
          pubshow: 2
        })
      }
    }
  },
  onSubmit(e) {
    let userName = e.detail.value.userName;
    let age = e.detail.value.age;
    let phone = e.detail.value.phone;
    let genter = this.data.genter;
    let postData = JSON.stringify(this.data.postData);
    //去除空格;
    userName = userName.replace(/(^\s*)|(\s*$)/g, '');
    age = age.replace(/(^\s*)|(\s*$)/g, '');
    phone = phone.replace(/(^\s*)|(\s*$)/g, '');
    if (userName == '' || userName == undefined || userName == null) {
      wx.showToast({
        title: "姓名不能为空！",
        icon: 'none'
      }, 1500)
      this.setData({
        userName: ''
      })
      return false;
    }
    if (genter == undefined) {
      wx.showToast({
        title: "请选择您的性别！",
        icon: 'none'
      }, 1500)
      return false;
    }
    if (age == '' || age == undefined || age == null) {
      wx.showToast({
        title: "请填写您的年龄！",
        icon: 'none'
      }, 1500)
      this.setData({
        age: ''
      })
      return false;
    }
    if (phone == '' || phone == undefined || phone == null) {
      wx.showToast({
        title: "电话号码不能为空！",
        icon: 'none'
      }, 1500)
      this.setData({
        phone: ''
      })
      return false;
    }
    let reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-9]))\d{8}$|^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-9]))\d{8}$|^0\d{2,3}-?\d{7,8}$/;
    if (!reg.test(phone)) {
      wx.showToast({
        title: "请填写正确的电话！",
        icon: 'none'
      }, 1500)
      return false;
    }
    this._postSurvey(userName, phone, genter, age, postData, '1');
    this.setData({
      pubshow: 3
    })
  },
  goHome() {
    wx.switchTab({
      url: '../../index/index',
    })
  },
  chooseGender(e) {
    let genter = e.currentTarget.dataset.genter;
    let id = e.currentTarget.id;
    this.setData({
      genterId: id,
      genter: genter
    });
  },
  getQuestionList() {
    this.setData({
      selectedOption: []
    })
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    api.getSurvey().then((res) => {
      let statusCode = res.statusCode.toString();
      if (statusCode.startsWith('2')) {
        wx.hideLoading();
        this.setData({
          onaStartup: true
        })
        let data = res.data.data;
        let len = data.length;
        that.setData({
          getsurvey: data,
          dataLen: len
        })
      }
    })
  },
  revampData(){
    let that = this;
    let getsurvey = that.data.getsurvey;
    console.log('------------------',getsurvey);
    this.setData({
      selectedOption: []
    })
    let question = getsurvey.map(function (item, index) {
      var uiType, remark, other, chooseNum, isRequired;
      let maxNum = item.chooseNum;
      if (item.chooseNum || item.chooseNum != null) {
        chooseNum = '，最多' + maxNum + '项';
      } else {
        chooseNum = '';
      }
      item.required ? isRequired = '' : isRequired = "(非必填)";
      switch (item.uiType) {
        case 1:
          uiType = 'single';
          remark = '此题为：单选' + isRequired + chooseNum;
          other = false;
          break;
        case 2:
          uiType = 'single';
          remark = '此题为：单选' + isRequired + chooseNum;
          other = true;
          break;
        case 3:
          uiType = 'multi';
          remark = '此题为：多选' + isRequired + chooseNum;
          other = false;
          break;
        case 4:
          uiType = 'multi';
          remark = '此题为：多选' + isRequired + chooseNum;
          other = true;
          break;
        case 5:
          uiType = 'textarea';
          if (item.required == false) {
            remark = '此题为：非必填' + chooseNum;
          }
          other = false;
          break;
        case 6:
          uiType = 'single';
          if (item.required == false) {
            remark = '此题为：非必填' + chooseNum;
          }
          other = false;
          break;
        default:
          uiType = 'single';
          remark = '此题为：单选' + chooseNum;
          other = false;
      }

      let answer = item.answer ? item.answer.split(',') : '';
      let options = [];
      let lastItem = answer[answer.length - 1];
      if (lastItem == '其他') {
        answer.pop();
      }
      for (let i = 0; i < answer.length; i++) {
        options.push({
          value: answer[i],
          label: answer[i],
          extra: '',
          selected: false
        })
      }
      let temp = {
        // qId: item.id,
        qId: index + 1,
        title: item.subject,
        remark: remark,
        type: uiType,
        uitype: item.uiType,
        other: other,
        required: item.required,
        maxNum: maxNum,
        options: options,
        answer: []
      }
      return temp;
    })
    console.log(question);
    that.setData({
      isQuestionextData: false,
      question: question[that.data.questionIndex],
      required: question[that.data.questionIndex].required,
      maxNum: question[that.data.questionIndex].maxNum
    });
    if (that.data.question.uitype == 6) {
      let qId = that.data.question.qId;
      let title = that.data.question.title;
      let options = that.data.question.options;
      let required = that.data.question.required;
      let questionextData = that.testData( qId, title, required);
      that.setData({
        isQuestionextData: true,
        question: questionextData
      })
      console.log(this.data.question);
    }
  },
  testData: function (qId, title, required, options) {
    let optionValues = ['5分', '4分', '3分', '2分', '1分'];
    let len = optionValues.length;
    let total = 3;
    let remark ;
    if (required == false) {
      remark = '此题为：非必填';
    }else{
      remark = '';
    }
    let questionext = {
      qId: qId,
      title: title,
      remark: remark,
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
      question.title = ['机构', i + 1, '：'].join('');
      question.options = options;
      questionext.options.push(question);
    }
    console.log("questionext:", questionext);
    return questionext;
  },
  _postSurvey(userName, phone, gender, age, answerContent, noteType) {
    api.addSurvey({
      'name': userName,
      'phone': phone,
      'sex': gender,
      'age': age,
      'answerContent': answerContent,
      'type': noteType
    }).then((res) => {
      let statusCode = res.statusCode.toString();
      if (statusCode.startsWith('2')) {
        console.log(res.data);
      }
    })
  },
  closeModal() {
    this.setData({
      showModal: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})