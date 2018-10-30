// pages/active/alzheimer/alzheimer.js
var apis = require('./../../../utils/api.js');
var careType = require('../../../models/caretype.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArray:{},
    desc:{ isSHowAll:false, data:[' 阿尔茨海默病（AD）是一种起病隐匿的进行性发展的神经系统退行性疾病。临床上以记忆障碍、失语、失     用、失认… … ',
    '阿尔茨海默病（AD）是一种起病隐匿的进行性发展的神经系统退行性疾病。临床上以记忆障碍、失语、失用、失认、视空间技能损害、执行功能障碍以及人格和行为改变等全面性痴呆表现为特征，病因迄今未明。'
    ]},
    

  },
  showall(){
    var desc=this.data.desc;
    desc.isSHowAll = !this.data.desc.isSHowAll;
    this.setData({
      desc: desc
    })
  },
  zece(){
      wx.navigateTo({
        url: './../../selftest/selftest',
      })
  },
 gotonew(e){
    console.log(e.currentTarget.dataset.id);
    var id = e.currentTarget.dataset.id;
     wx.navigateTo({
       url: './../../news/details/details?id='+id,
     }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var sef=this;
    var sendData = { 'serviceType	': '6', pageIndex: 1, pageNumber:2}
    apis.getOrganizationWithFilters(sendData).then((res) => {
      console.log(res.data.data);
      let responseData=res.data.data;
      let listsData = responseData.map(function (item, index) {
        let careTypeValues = item.beadhouseServiceType ? item.beadhouseServiceType.split(',') : '';
        let temp = {
          key: item.id,
          imgable: 1,
          img: item.pensionImages && item.pensionImages[0] ? item.pensionImages[0].imgUrl : "/images/img@2x.png",
          title: item.beadhouseName,
          address: item.beadhouseAddress,
          price: item.beadhouseCostRangeMin && item.beadhouseCostRangeMax ? [item.beadhouseCostRangeMin, item.beadhouseCostRangeMax].join('-') : parseInt(item.beadhouseCostRangeMin) || parseInt(item.beadhouseCostRangeMax) || 0,
          hospital: item.beadhouseHospital,
          medical: item.isMedical == '是',
          cooperateHospital: item.cooperateHospital,
          types: careType.idsGetCareLabels(careTypeValues),
          status: item.businessState
        };
        return temp;
      })
      console.log('listdata',listsData);
      sef.setData({
        listArray: listsData

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