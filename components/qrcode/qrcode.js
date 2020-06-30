// components/qrcode/qrcode.js
import service from '../../utils/api'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    img: ''
  },
  created() {
    this.get_qrcode()
      .then(r => {
        this.setData({
          img: "https://ym.bibo80s.com" + r
        })
      })
      .catch(err => {
        wx.showToast({
          title: '生成二维码失败，请联系员工或稍后重试',
          icon: "none"
        })
      })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    get_qrcode() {
      return new Promise((resolve, reject) => {
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
    download_img() {
      const _this = this
      return new Promise((resovle,reject) => {
        wx.downloadFile({
          url:_this.data.img,
          success:(res) => {
            if (res.statusCode === 200) {
              resovle(res.tempFilePath)
            } else {
              reject('失败')
            }
          }
        })
      })
    },
    save_img() {
      this.download_img()
      .then(r => {
        wx.saveImageToPhotosAlbum({
          filePath: r,
          success(res) {
            wx.showToast({
              title: '保存成功',
              duration: 2000
            })
          },
          fail(err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
              // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: modalSuccess => {
                  wx.openSetting({
                    success(settingdata) {
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击图片即可保存',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                    fail(failData) {
                      console.log("failData", failData)
                    },
                    complete(finishData) {
                      console.log("finishData", finishData)
                    }
                  })
                }
              })
            } else {
              wx.showToast({
                title: '保存出错',
                duration: 2000,
                icon: 'none'
              })
            }
  
          }
        })
      })
      .catch(e => {
        wx.showToast({
          title: '保存出错',
          duration: 2000,
          icon: 'none'
        })
      })
    },
    close() {
      this.triggerEvent('closecode')
    }
  }
})