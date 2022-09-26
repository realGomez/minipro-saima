// pages/admin/orderManage/orderDetail/orderDetail.js
const app = getApp();
  const db = wx.cloud.database();
  const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    statusList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    const that = this;
     console.log('options',options);

     that.setData({
      orderId:options.id
     })

     this.initDetail();
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
  initDetail:async function(){

    const orderData = await  db.collection('order_manage').where({ 
      _id: _.eq(this.data.orderId)
    }).get();

    console.log('data',orderData);

  if(orderData.data.length>0){
    this.setData({
        ...orderData.data[0]
    })
  }


  const statusData = await  db.collection('order_status').get();

  console.log('data',this.data);
  this.setData({
    statusList:statusData.data
  })
  },
  bindPickerChange:function(){

  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    let selectedStatus = '';

    const items = this.data.statusList
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].status_code === e.detail.value

      if(items[i].status_code === e.detail.value){
         selectedStatus = items[i].status_code;
      }
    }

    this.setData({
      statusList:items,
      status:selectedStatus

    })

    console.log('data--',this.data)
  },
  async formSubmit(e) {

    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    const that = this;
   
    if(this.data._id){
      db.collection('order_manage').doc(this.data._id).update({
        data: {
          status:that.data.status
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          wx.showToast({
            title: '更新成功',
          })
          // console.log('[数据库] [更新记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '更新失败'
          })
          // console.error('[数据库] [更新记录] 失败：', err)
        }
      })

    }
  }
  
})