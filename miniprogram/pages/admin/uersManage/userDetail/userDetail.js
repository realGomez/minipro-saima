// pages/admin/uersManage/userDetail/userDetail.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this;
    console.log('options',options);

    const _ = db.command
    db.collection('users').where({
      _id: _.eq(options.id)
    }).get({
     success: function(res) {
       // res.data 包含该记录的数据
       console.log(res.data)

       if(res.data.length>0){
         that.setData({
             ...res.data[0]
         })
       }
      
       console.log(that.data);
     }
   })
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
  async formSubmit(e) {

    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    const that = this;
   
    if(this.data._id){
      db.collection('users').doc(this.data._id).update({
        data: {
          ...e.detail.value
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

    }else{
      
        db.collection('users').add({
          data: {
            ...e.detail.value
           
          },
          success: res => {
            // 在返回结果中会包含新创建的记录的 _id
            this.setData({
              _id:res._id
            })
            wx.showToast({
              title: '添加成功',
            })
            // console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '添加失败'
            })
            // console.error('[数据库] [新增记录] 失败：', err)
          }
        })
      // }

      

    }
    
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },
  handleDiscount(e){
    
    console.log('e.detail.value',e.detail.value);
  },

})