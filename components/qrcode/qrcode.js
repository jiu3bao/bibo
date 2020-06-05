// components/qrcode/qrcode.js
import service from '../../utils/api'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info:{
      type:Object,
      value:{}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    img:''
  },
  created() {
    this.get_qrcode()
    .then(r => {
      this.setData({
        img:"https://ym.bibo80s.com"+r
      })
    })
    .catch(err => {
      wx.showToast({
        title: '生成二维码失败，请联系员工或稍后重试',
        icon:"none"
      })
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    get_qrcode() {
      return new Promise((resolve,reject) => {
        const data = {
          Param: wx.getStorageSync('user').id,
          Token: wx.getStorageSync('user').Token
        }
        service('API/GetXcxUnlimited', data)
          .then(r => {
            if (r.data.error_code === 6) {
              wx.navigateTo({
                url: '/packageA/pages/login/login',
              })
              return
            }
            if (r.data.error_code !== 0) {
              reject(r.data.message)
              return 
            }
            resolve(r.data.data)
          })
          .catch(err => {
            reject(err)
          })
      })
      
    },
    save_img() {
      wx.saveImageToPhotosAlbum({
        filePath:this.data.img,
        success(res) {
          wx.showToast({
            title: '保存成功',
            duration:2000
          })
         }
      })
    },
  }
})
