//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'gmz-sili0',
        traceUser: true,
      })
    }
    
    const that = this;
      // 获取系统信息
      const systemInfo = wx.getSystemInfoSync();
      // 胶囊按钮位置信息
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
      // 导航栏高度 = 状态栏高度 + 44
      if(systemInfo.model.indexOf('iPad')!=-1){
        that.globalData.navBarHeight = systemInfo.statusBarHeight + 60;
      }else{
        that.globalData.navBarHeight = systemInfo.statusBarHeight + 44;
      }

      that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
      that.globalData.menuTop= menuButtonInfo.top;
      that.globalData.menuHeight = menuButtonInfo.height;


  },
  globalData: {
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuTop: 0, // 胶囊距顶部间距
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    userInfo:{
      hasUserInfo:false
    }
}

})

