// pages/login/login.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;

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
  getPhoneNumber (e) {
    console.log(e.detail.code)
  },
  getUserProfile() {

    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          ...res.userInfo,
          hasUserInfo: true,
          admin_role:0
        })

        app.globalData.userInfo={
          ...res.userInfo,
          hasUserInfo: true,
          admin_role:0,
          _openid: app.globalData.openid
         }
         
          db.collection('users').add({
            data: {
              nickName: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl,
              gender:res.userInfo.gender,
              // _openid: app.globalData.openid
              admin_role:0
            },
            success: res => {
              // 在返回结果中会包含新创建的记录的 _id
            
              wx.showToast({
                title: '新增记录成功',
              })
              console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
              wx.navigateBack();
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '新增记录失败'
              })
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
      },
      fail:(error)=>{
         console.log(error);
      }
    })
  },
 
  onGetOpenid: function() {

    const that = this;

    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {

        app.globalData.openid = res.result.openid;

        db.collection('users').where({
          _openid: _.eq(res.result.openid)
        }).get({
         success: function(res) {
           // res.data 包含该记录的数据
    
           if(res.data.length){

            that.setData({
              ...res.data[0],
              hasUserInfo: true,
            })

             app.globalData.userInfo={
              hasUserInfo: true,
              ...res.data[0]
             }

           }else{
            app.globalData.userInfo={
              hasUserInfo: false,
             }
           }
          
         }
       })
       
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
})