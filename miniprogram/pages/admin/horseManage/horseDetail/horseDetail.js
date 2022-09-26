// pages/admin/horseManage/horseDetail/horseDetail.js
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


    const id = options.id;
    if(id){
      db.collection('horses_manage').where({
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
    }

    
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
      db.collection('horses_manage').doc(this.data._id).update({
        data: {
          main_image_src:that.data.main_image_src,
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

      
      // const exitProduct = await db.collection('horses_manage').where({
      //   _id: e.detail.value._id
      // }).get();

      // console.log('exitProduct',exitProduct);

      // if(exitProduct.data.length>0){
      //   wx.showToast({
      //     title: ' 已经存在，更新失败。请修改id!',
      //   })
      // }else{
        db.collection('horses_manage').add({
          data: {
            main_image_src:that.data.main_image_src,
            ...e.detail.value
           
          },
          success: res => {
            // 在返回结果中会包含新创建的记录的 _id
            that.setData({
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
  uploadImg() {
    wx.showLoading({
      title: '',
    })
    // 让用户选择一张图片
    wx.chooseImage({
      count: 1,
      success: chooseResult => {
        // 将图片上传至云存储空间

        const template = new Date();

        const filePath = chooseResult.tempFilePaths[0];
        const cloudPath = `${template.getFullYear()}-${template.getMonth()+1}-${template.getDate()}-${template.getHours()}-${template.getMinutes()}-${template.getSeconds()}${filePath.match(/\.[^.]+?$/)[0]}`;

        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: cloudPath,
          // 指定要上传的文件的小程序临时文件路径
          filePath: filePath,
          config: {
            env: this.data.envId
          }
        }).then(res => {
          console.log('上传成功', res)
          this.setData({
            haveGetImgSrc: true,
            main_image_src: res.fileID
          })
          wx.hideLoading()
        }).catch((e) => {
          console.log(e)
          wx.hideLoading()
        })
      },
      fail:()=>{
        wx.hideLoading();
      }
    })
  },

   // 上传图片
  //  uploadImg: function () {
  //   // 选择图片
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {
  //       wx.showLoading({
  //         title: '上传中',
  //       })

  //       const filePath = res.tempFilePaths[0]
        
  //       // 上传图片
  //       const cloudPath = `my-image${filePath.match(/\.[^.]+?$/)[0]}`
  //       wx.cloud.uploadFile({
  //         cloudPath,
  //         filePath,
  //         success: res => {
  //           console.log('[上传文件] 成功：', res)

  //           app.globalData.fileID = res.fileID
  //           app.globalData.cloudPath = cloudPath
  //           app.globalData.imagePath = filePath
            
  //           wx.navigateTo({
  //             url: '../storageConsole/storageConsole'
  //           })
  //         },
  //         fail: e => {
  //           console.error('[上传文件] 失败：', e)
  //           wx.showToast({
  //             icon: 'none',
  //             title: '上传失败',
  //           })
  //         },
  //         complete: () => {
  //           wx.hideLoading()
  //         }
  //       })
  //     },
  //     fail: e => {
  //       console.error(e)
  //     }
  //   })
  // },
  clearImgSrc() {
    this.setData({
      haveGetImgSrc: false,
      main_image_src: ''
    })
  }
})