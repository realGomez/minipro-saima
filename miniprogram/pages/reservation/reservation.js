//index.js
import * as THREE from '../../libs/three.weapp.js';
import { OrbitControls } from '../../jsm/controls/OrbitControls';
import { RGBELoader } from '../../jsm/loaders/RGBELoader.js';


// jsm/loaders/OrbitControls
const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
     bannerCollection:[],
     monthList:['01','02','03','04','05','06','07','08','09','10','11','12'],
     additionalDays:["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"],
     businessHours:[],
     today:'',
     selectedYear:'',
     selectedMonth:'',
     selectedDay:'',
     availeblePickedDate:[],
     availebleHorses:[],
     selectedBusinessHours:[],
     selectedHorseNumber:'',
     orderTotal:0
  },

  onLoad: function () {



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


    console.log('availeblePickedDate-ww-',availeblePickedDate);


    this.setData({
      availeblePickedDate:availeblePickedDate,
      today:availableFirstDay,
      selectedYear:pickYear,
      selectedMonth:pickMonth,
      selectedDay:availableFirstDay
    })

// ---- date end



  this.initOptions();

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
    // const {pickYear,pickMonth,selectedDay} = PickedDate;

    
    // console.log('pickYear',event.currentTarget.dataset.pickYear);
    // console.log('pickMonth',event.currentTarget.dataset.pickMonth);
    // console.log('selectedDay',event.currentTarget.dataset.pickDate);

    const pickYear = event.currentTarget.dataset.pickYear;
    const pickMonth = event.currentTarget.dataset.pickMonth;
    const pickDate = event.currentTarget.dataset.pickDate;



    this.setData({
      selectedYear:pickYear,
      selectedMonth:pickMonth,
      selectedDay:pickDate,
      selectedHorseNumber:'',
      selectedBusinessHours:[],
      orderTotal:0
    })

    this.initOptions();
},
  
initOptions:async function(){

  const _ = db.command

  const templateDate = new Date();

  const currentYear = templateDate.getFullYear();

  const currentMonth = templateDate.getMonth()+1;

  const currentDay = templateDate.getDate();

  const currentHour = templateDate.getHours();

  const orderData = await db.collection('order_manage').where({
    order_year: _.eq(Number(this.data.selectedYear)),
    order_month: _.eq(Number(this.data.selectedMonth)),
    order_date: _.eq(Number(this.data.selectedDay)),
  }).get();

  const businessHoursData = await db.collection('business_hours').get();

  const horseData = await db.collection('horses_manage').where({status:true}).get();

  const orderHistory = orderData.data;

  const horse = horseData.data;

  const businessHours = businessHoursData.data;

  // console.log('order',orderHistory);
  // console.log('horse',horse);
  // console.log('businessHours',businessHours);

  const availebleHorses = [];

  horse.forEach((item)=>{
     const {horse_number,name,status:horseStatus} = item;

     const businessHoursForThisHorse = [];

     businessHours.forEach((businessHour)=>{

      const {value,label,status,price,isEnd,_id} = businessHour;

      const matchItem =   orderHistory.find(order=>{
          return order.order_time_interval == value && horse_number == order.horse_number && order.status != 'cancelled';
       })

       if(!isEnd){
          businessHoursForThisHorse.push({
            timeInterval:value,
            price:price,
            businessHoursId:_id,
            horse_number:horse_number,
            status:matchItem ||!status|| (this.data.selectedMonth==currentMonth && this.data.selectedDay==currentDay && currentHour > value ) ? false:true
        })
       }
      
     })


     availebleHorses.push({
      horse_number,
      name,
      status:horseStatus,
      businessHours:businessHoursForThisHorse
     })


    //  console.log('availebleHorses',availebleHorses);

     this.setData({
      availebleHorses:availebleHorses,
      businessHours:businessHours
     })

     console.log('this.data----',this.data);
  })

},

// pick business hour
pickBusinessHourAction:function(event){

  const timeInterval = event.currentTarget.dataset.timeInterval;
  const horseNumber = event.currentTarget.dataset.horseNumber;
  const businessHoursId = event.currentTarget.dataset.businessHoursId;
  const status = event.currentTarget.dataset.status;

  // const horseBusinessHoursId = horseNumber+'-'+businessHoursId;


  if(!status){
    return
  }

  if(status){
    // console.log('timeInterval',timeInterval);
    // console.log('horseNumber',horseNumber);
    // console.log('businessHoursId',businessHoursId);
    // console.log('status',status);

    const arrBusinessHours = this.data.selectedBusinessHours;

    let exist = false;
    let existIndex = -1;
    arrBusinessHours.forEach((item,index)=>{
        if(item.horseNumber == horseNumber&& item.businessHoursId== businessHoursId){
          exist = true;
          existIndex = index;
        }
    });

    if(!exist){

      if(this.data.selectedBusinessHours.length>=4){
        wx.showToast({
          title: '非常抱歉，每次限购4个时段',
          icon: 'none',
          duration: 2000
        })
    
        return
      }

      arrBusinessHours.push({
        horseNumber:horseNumber,
        businessHoursId:businessHoursId
      })

    }else{
      arrBusinessHours.splice(existIndex,1);

    }

    this.setData({
      selectedBusinessHours:arrBusinessHours,
      selectedHorseNumber:horseNumber
    })
  }
  console.log('-this.data',this.data);

  this.calculateOrderTotal();
},
calculateOrderTotal:function(){

  let total = 0;
  this.data.selectedBusinessHours.forEach(({businessHoursId})=>{

    
  const matchItem =  this.data.businessHours.find(({_id})=>{
      return businessHoursId == _id;
    })
    if(matchItem){
      const {price} = matchItem;
      total = total + price
   }
  })

  this.setData({
    orderTotal:total
  })
}


})
