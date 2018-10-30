// components/questionext/questionext.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    remark: String,
    qId: String,
    gtype: String,
    other: Boolean,
    type: {
      type: String,
      value: 'single',
      observer: function (oldVal, newVal) {

      }
    },
    options: {
      type: Array,
      value: [],
      observer: function (oldVal, newVal) {
      }
    },
    total:{
      type:Number,
      value:3,
      observer: function (oldVal, newVa){

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    answers:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onAnswerChanged:function(e){
      console.log('onAnswerChanged',e,this.data.options);
      let newAns=e.detail;
      let answers=this.data.answers;
      let hasMat=answers.some((answer,index)=>{
        return answer.qId === newAns.qId;
      });
      if (hasMat){
        answers.forEach((answer, index) => {
          if(answer.qId === newAns.qId){
            answer.selectedOption=newAns.selectedOption;
          };
        });
      }else{
        answers.push(newAns);
      }
      this.setData({
        answers
      });
      console.log("answers:",answers);
      var eventDetail = {
        qId: this.data.qId,
        selectedOption: answers.map((item,index)=>item.selectedOption).join('|')
      };
      var eventOptions = {};
      this.triggerEvent('change', eventDetail, eventOptions);
    }
  },
  ready:function(){
    // let optionValues = ['1分', '2分', '3分','4分','5分'];
    // let len = optionValues.length;
    // let total =this.data.total;
    // for(let i=0;i<total;i++){
    //   let question={};
    //   let options = [];
    //   for (let j = 0; j < len; j++) {
    //     let option = {
    //       id: j,
    //       value: optionValues[j],
    //       label: optionValues[j],
    //       selected: false
    //     };
    //     options.push(option);
    //   }
    //   question.qId = 'questionext' + i;
    //   question.type = 'single';
    //   question.title=['机构',i+1,':'].join('');
    //   question.options = options;
    //   this.setData({
    //     questions
    //   });
    //   console.log("questions:", this.data.questions);
    // }
  }
})
