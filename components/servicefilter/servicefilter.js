const apis = require('../../utils/api.js');
let {getAndSaveCityConfig} = require('../../models/xlStorage');

Component({
    data: {
        filterAreaList: [],
        filterserviceList: [],
        filterDistanceList: [],
        filterArea: '',
        filterservice: [],
        filterDistance: '',
        activeFilter: 0,
        activeFilter2: 1
    },
    attached: function(){
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        getAndSaveCityConfig().then((data)=>{
            wx.hideLoading();
            that.setData({
                filterserviceList: data.services,
                filterDistanceList: [{id : 0 ,name : "不限" ,sort : 1 ,type : 12 ,value : ""},...data.dictances],
                filterAreaList: data.cityArea
            });
            that.initStorageData();
        });
    },
    methods: {
        initStorageData(){
            let that = this;
            let serviceFilterObj = wx.getStorageSync('serviceFilterObj');
            if(serviceFilterObj) {
                let filterservice = [];
                that.data.filterserviceList.map((item2)=>{
                    let res = false;
                    serviceFilterObj.serviceProject.split(',').forEach((item,index)=>{
                        if(item2.value == item) { res = true; };
                    });
                    filterservice.push(res);
                });
                let filterArea = '';
                this.data.filterAreaList.forEach((item,index)=>{
                    if(item.firstPY == serviceFilterObj.firstPY) {
                        filterArea = item.gscopeName;
                    }
                });
                this.setData({
                    filterArea: filterArea || '',
                    filterservice: filterservice || [],
                    filterDistance: serviceFilterObj.distance || ''
                });
            }else {
                this.xlResetData();
            }
        },
        xlResetData(){
            let filterservice = [];
            this.data.filterserviceList.forEach((item,index) => {
              filterservice.push(false);
            });
            this.setData({
                filterArea: '',
                filterservice: filterservice,
                filterDistance: ''
            });
        },
        /** 多选 */
        xlPickBox2Btn(event){
            let that = this;
            let resArr = this.data[event.target.dataset.pickboxnum];
            resArr[event.target.dataset.picklistnum] = !resArr[event.target.dataset.picklistnum];
            // if(!resArr.find((n)=>{return n})){resArr[event.target.dataset.picklistnum] = !resArr[event.target.dataset.picklistnum];}
            this.setData({
                [event.target.dataset.pickboxnum]: resArr
            });
        },
        /** 单选 */
        xlPickBox1Btn(event){
            this.setData({ [event.target.dataset.pickboxnum]: this.data[event.target.dataset.pickboxnum + 'List'][event.target.dataset.picklistnum].gscopeName });
            this.xlSubmitTap();
        },
        xlPickBox1Btn2(event){
            this.setData({ [event.target.dataset.pickboxnum]: this.data[event.target.dataset.pickboxnum + 'List'][event.target.dataset.picklistnum].value });
            this.xlSubmitTap();
        },
        xlResetTap(){
            wx.removeStorageSync('serviceFilterObj');
            this.xlResetData();
        },
        xlSubmitTap(){
            let that = this;
            let filterservice = [];
            this.data.filterserviceList.forEach((item,index)=>{
                if(that.data.filterservice[index]) {
                    filterservice.push(item.value);
                };
            });
            let filterArea = '';
            this.data.filterAreaList.forEach((item,index)=>{
                if(that.data.filterAreaList[index].gscopeName == that.data.filterArea) {
                    filterArea = that.data.filterAreaList[index].firstPY
                };
            });
            let data = {
                firstPY: filterArea,
                serviceProject: filterservice.join(','),
                distance: that.data.filterDistance 
            };
            this.setData({
                activeFilter: 0
            });
            wx.setStorage({
                key: 'serviceFilterObj',
                data,
                success: function(res) {
                    that.triggerEvent('customevent', {});
                }
            });
        },
        xlFiterMenuBtnTap(event){
            this.initStorageData();
            this.setData({
                activeFilter: event.target.dataset.menunum - 0
            });
        },
        xlHideFilter(){
            this.setData({
                activeFilter: 0
            });
        },
        xlNoneToDo(){

        },
        xlFilterChangeItem(event){
            this.setData({
                activeFilter2: event.target.dataset.tapnum
            });
        }
    }
  })