// pages/admin/orderManage/orderManage.js

const app = getApp();
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    availeblePickedDate:[],
    today:'',
    selectedStatus:'',
    orderList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {


  const that = this;


       this.filterOrder();
   
   
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
    if(!app.globalData.userInfo.hasUserInfo ){
      wx.navigateTo({
        url: '../login/login',
      })
    }
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


// pickDateAction:function(event){
   

//     const pickYear = event.currentTarget.dataset.pickYear;
//     const pickMonth = event.currentTarget.dataset.pickMonth;
//     const pickDate = event.currentTarget.dataset.pickDate;



//     this.setData({
//       selectedYear:pickYear,
//       selectedMonth:pickMonth,
//       selectedDay:pickDate,
//       selectedAllDay:false,
//       selectedHorseNumber:'',
//       selectedBusinessHours:[],
//       orderTotal:0
//     })

//     this.filterOrder();

// },

// pickAllDateAction:function(event){

//   this.setData({
//     selectedYear:'',
//     selectedMonth:'',
//     selectedDay:'',
//     selectedAllDay:true
//   })

//   this.filterOrder();
// },

pickStatusAction:async function(event){
  const pickStatus = event.currentTarget.dataset.status;

  this.setData({
    selectedStatus:pickStatus
  })


  this.filterOrder();
},
filterOrder:function(){

  const that = this;

  if(!this.data.selectedStatus){
    db.collection('order_manage').get({
      success: function(res) {
        // res.data 包含该记录的数据
        that.setData({
          orderList:res.data
        })
      }
    })
  }else if(this.data.selectedStatus){
    db.collection('order_manage').where({
      status: _.eq(this.data.selectedStatus),
     
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