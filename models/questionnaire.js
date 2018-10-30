var uuid=require('./../utils/util.js').uuid;
var questionnaire=[
  {
    qId: '',
    title: '判断力出现问题',
    remark: '在解决日常生活问题、经济问题有困难，如不会算账了，做出的决定经常出错；辨不清方向或容易迷路',
    type: '',
    other:false,
    options: [],
    answer: []
  },
  {
    qId: '',
    title: '缺乏兴趣、爱好，活动减少了',
    remark: '比如：几乎整天和衣躺着看电视；平时厌恶外出，常闷在家里，身体懒得活动，无精打采',
    type: '',
    other: false,
    options: [],
    answer: []
  },
  {
    qId: '',
    title: '不断重复同一件事',
    remark: '比如：总是提相同的问题，一句话重复多遍等',
    type: '',
    other: false,
    options: [],
    answer: []
  },
  {
    qId: '',
    title: '学习使用某些日常工具或者家用电器有困难',
    remark: '比如遥控器、微波炉、VCD等',
    type: '',
    other: false,
    options: [],
    answer: []
  },
  {
    qId: '',
    title: '记不清当前的月份或者年份',
    remark: '',
    type: '',
    other: false,
    options: [],
    answer: []
  }, {
    qId: '',
    title: '处理个人财务困难',
    remark: '忘了如何使用存折，忘了付水、电、煤气账单等',
    type: '',
    other: false,
    options: [],
    answer: []
  },
  {
    qId: '',
    title: '记不住和别人的约定',
    remark: '如忘记和家人已约好的聚会，拜访亲朋好友的计划',
    type: '',
    other: false,
    options: [],
    answer: []
  },
  {
    qId: '',
    title: '日常记忆和思考能力出现问题',
    remark: '比如：自己放置的东西经常找不着；经常忘了服药；想不起熟人的名字；忘记要买的东西；忘记看过的电视、书籍的主要内容；',
    type: '',
    other: false,
    options: [],
    answer: []
  },
];
var options={
  id:'',
  value:'',
  label:'',
  extra:'',
  selected:false
};
var question={
  qId:'',
  title:'',
  remark:'',
  type:'',
  other: false,
  options:[],
  answer:[]
};

var quesConfig={
  index:0,
  total:0,
  hasNext:false,
  inited:false
};

function initQuestions(){
  quesConfig.index=0;
  quesConfig.total = questionnaire.length;
  quesConfig.hasNext=quesConfig.index<quesConfig.total;
  if(!quesConfig.inited){
    initQuestionnaireData();
    quesConfig.inited=true;
  }
}
function initQuestionnaireData(){
  let optionValues = ['是', '不是','无法判断'];
  let len = optionValues.length;
  let total = questionnaire.length;
  questionnaire.forEach((question,index)=>{
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
    question.qId ='questionnaire'+index;
    question.type = 'single';
    question.options=options;
    question.answer=[];
  });
  return questionnaire;
}

function getNextQuestion(){
  console.log("fff", quesConfig.hasNext);
  if (!quesConfig.hasNext){
    return;
  }
  let curQuestion = questionnaire[quesConfig.index];
  console.log("fff", quesConfig.hasNext);
  quesConfig.index++;
  quesConfig.hasNext = quesConfig.index < quesConfig.total;
  return curQuestion;
}

function answerQuestion(id,answer){
  
}

function resetQuestionnaire(){
  quesConfig.index=0;
  quesConfig.total=questionnaire.length;
  quesConfig.hasNext=true;
  questionnaire.forEach((question,index)=>{
    while (question.answer.length){
      question.answer.pop();
    }
    question.answer=[];
  });
}
module.exports={
  questionnaire,
  initQuestions,
  quesConfig,
  getNextQuestion,
  resetQuestionnaire
}