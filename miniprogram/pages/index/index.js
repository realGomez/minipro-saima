const app = getApp();
const db = wx.cloud.database();
const _ = db.command;


const customCallout1 = {
  id: 4,
  latitude: 19.660917,
  longitude: 109.262601,
  // iconPath: '/image/location.png',
  // 109.268601,19.665917
  callout: {
    content: '赛马牧场',
    color: '#ff0000',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  },
}
const allMarkers = [customCallout1]

Page({
  data:{
    latitude: 19.660993,
    longitude: 109.264703,
    markers:allMarkers
  },
  // 109.265206,19.667521
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    

    this.onGetOpenid();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  getPhoneNumber (e) {
  },
  getUserProfile(e) {
    // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {

        app.globalData.userInfo={
          hasUserInfo: true,
          ...res.userInfo
         }
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