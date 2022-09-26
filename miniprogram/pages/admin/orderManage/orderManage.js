// pages/admin/orderManage/orderManage.js

const app = getApp();
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    monthList:['01','02','03','04','05','06','07','08','09','10','11','12'],
    additionalDays:["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"],
    availeblePickedDate:[],
    today:'',
    selectedYear:'',
    selectedMonth:'',
    selectedDay:'',
    selectedAllDay:false,
    selectedStatus:'',
    orderList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {


  const that = this;

      // ---- date start
      const templateDate = new Date();

      const pickYear = templateDate.getFullYear().toString();
   
      const pickMonth = templateDate.getMonth()+1<10?'0' + (templateDate.getMonth()+1):(templateDate.getMonth()+1).toString;
     //  const pickMonth = '09';
      const availableFirstDay = templateDate.getDate()<10?'0'+ templateDate.getDate():templateDate.getDate().toString();
   
       const availableDays = this.getAvailableDay(pickMonth);
       const availableFirstDayIndex = availableDays.indexOf(availableFirstDay);
   
       const availableReserve = 7;
   
       const availeblePickedDate = [];
   
       for (let index = availableFirstDayIndex; index < availableDays.length ; index++) {
         const element = availableDays[index];
   
         availeblePickedDate.push({
           pickYear:pickYear,
           pickMonth:pickMonth,
           pickDate:element,
           weekDay:this.getweekDay(pickYear,pickMonth,element)
         })
         
       }
   
   
       if(availeblePickedDate.length>7){
         availeblePickedDate.length = 7;
       }
   
   
       if(availeblePickedDate.length<7){
   
       const additional = availableReserve - availeblePickedDate.length;
   
       const additionalMonth = Number(pickMonth) + 1<10? '0' + (Number(pickMonth) + 1):(Number(pickMonth) + 1).toString();
         for (let index = 0; index < additional ; index++) {
           const element = availableDays[index];
       
           const pickYearAdditional = additionalMonth=='13'?(Number(pickYear) + 1).toString():pickYear;
           const pickMonthAdditional = additionalMonth=='13'?'01':additionalMonth
           availeblePickedDate.push({
             pickYear:pickYearAdditional,
             pickMonth:pickMonthAdditional,
             pickDate:element,
             weekDay:this.getweekDay(pickYearAdditional,pickMonthAdditional,element)
           })
           
         }
       }
       this.setData({
         availeblePickedDate:availeblePickedDate,
         today:availableFirstDay,
         selectedYear:pickYear,
         selectedMonth:pickMonth,
         selectedDay:availableFirstDay
       })
   
   // ---- date end

    
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getAvailableDay:function(pickMonth){

    const templateDate = new Date();
    let isRunYear = false;
    const pickYear = templateDate.getFullYear;
    if(pickYear % 100 != 0 && pickYear % 4 == 0 || pickYear % 400 == 0){
        isRunYear = true;
    }
    const days = [];
    if(pickMonth=='01'|| pickMonth=='03' || pickMonth=='05'|| pickMonth=='07'|| pickMonth=='08' || pickMonth=='10'||pickMonth=='12'){ 
        for(let i=1;i<=31;i++){
            const valueDay = i<10?'0'+i:i.toString();
            days.push(valueDay);
        }
    }else if(pickMonth=='04'|| pickMonth=='06' || pickMonth=='09'|| pickMonth=='11'){ 
        for(let i=1;i<=30;i++){
            const valueDay = i<10?'0'+i:i.toString();
            days.push(valueDay);
        }
    }else if(pickMonth=='02' && isRunYear){
        for(let i=1;i<=29;i++){
            const valueDay = i<10?'0'+i:i.toString();
            days.push(valueDay);
        }
    }else if(pickMonth=='02' && !isRunYear){
        for(let i=1;i<=28;i++){
            const valueDay = i<10?'0'+i:i.toString();
            days.push(valueDay);
        }
    }
    return days;
},
  
  
getweekDay:function(pickYear,pickMonth,pickDate){

  const templateDate = new Date(pickYear+'-'+pickMonth+'-'+pickDate);


  const weekDay = templateDate.getDay();
   
  let weekDayText = '';
  switch (weekDay) {
    case 1:
    weekDayText = '一';
    break;
    case 2:
    weekDayText = '二';
    break;
    case 3:
    weekDayText = '三';
    break;
    case 4:
    weekDayText = '四';
    break;
    case 5:
    weekDayText = '五';
    break;
    case 6:
    weekDayText = '六';
    break;
    case 0:
    weekDayText = '日';
    break;
   
  }

  return weekDayText;

},

pickDateAction:function(event){
   

    const pickYear = event.currentTarget.dataset.pickYear;
    const pickMonth = event.currentTarget.dataset.pickMonth;
    const pickDate = event.currentTarget.dataset.pickDate;



    this.setData({
      selectedYear:pickYear,
      selectedMonth:pickMonth,
      selectedDay:pickDate,
      selectedAllDay:false,
      selectedHorseNumber:'',
      selectedBusinessHours:[],
      orderTotal:0
    })

    this.filterOrder();

},

pickAllDateAction:function(event){

  this.setData({
    selectedYear:'',
    selectedMonth:'',
    selectedDay:'',
    selectedAllDay:true
  })

  this.filterOrder();
},

pickStatusAction:async function(event){
  const pickStatus = event.currentTarget.dataset.status;

  this.setData({
    selectedStatus:pickStatus
  })


  this.filterOrder();
},
filterOrder:function(){

  const that = this;

  if(this.data.selectedStatus=='' && this.data.selectedAllDay){
    db.collection('order_manage').get({
      success: function(res) {
        // res.data 包含该记录的数据
        that.setData({
          orderList:res.data
        })
      }
    })
  }else if(this.data.selectedStatus==''  && !this.data.selectedAllDay){
    db.collection('order_manage').where({
      order_year: _.eq(Number(this.data.selectedYear)),
      order_month: _.eq(Number(this.data.selectedMonth)),
      order_date: _.eq(Number(this.data.selectedDay))
    }).get({
      success: function(res) {
        // res.data 包含该记录的数据
        that.setData({
          orderList:res.data
        })
      }
    })
  }else if(this.data.selectedStatus!=''  && this.data.selectedAllDay){
    db.collection('order_manage').where({
      status: _.eq(this.data.selectedStatus)
    }).get({
      success: function(res) {
        // res.data 包含该记录的数据
        that.setData({
          orderList:res.data
        })
      }
    })
  }else if(this.data.selectedStatus!=''  && !this.data.selectedAllDay){
    db.collection('order_manage').where({
      order_year: _.eq(Number(this.data.selectedYear)),
      order_month: _.eq(Number(this.data.selectedMonth)),
      order_date: _.eq(Number(this.data.selectedDay)),
      status: _.eq(this.data.selectedStatus)
    }).get({
      success: function(res) {
        // res.data 包含该记录的数据
        that.setData({
          orderList:res.data
        })
      }
    })
  }
  
}

})