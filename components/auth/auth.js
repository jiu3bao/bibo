// components/auth/auth.js
import service from '../../utils/api'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    wx_get_info() {
      return new Promise((resolve, reject) => {
        wx.getUserInfo({
          success(res) {
            resolve(res)
          },
          fail(error) {
            // reject(error)
            wx.showModal({
              title: '用户未授权',
              content: '未授权将不能正常使用小程序功能！请同意授权。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
          }
        })
      })
    },
    getUserInfo(e) { 
      wx.showLoading({
        title: '正在授权...',
        icon: 'none'
      })
      this.wx_get_info()
      .then(res => {
        const userInfo = res.userInfo
        console.log(encodeURIComponent(userInfo.nickName))
        const data = {
          name:encodeURIComponent(userInfo.nickName),
          head:userInfo.avatarUrl,
          Token:wx.getStorageSync('user').Token,
        }
        if (!data.name || !data.head ) {
          wx.hideLoading()
          wx.showToast({
            title: '授权失败，请重新授权',
            duration: 2000,
            icon: 'none'
          })
          return Promise.reject()
        } 
        service('/SetMyInfo',data)//保存获取到的信息
        .then(r => {
          wx.hideLoading()
          if (r.data.error_code===6){
            wx.navigateTo({
              url: '/pages/login/login',
            })
            return
          }
          if(r.data.error_code!==0) {
            wx.showToast({
              title: r.data.message,
              duration: 2000,
              icon: 'none'
            })
            return
          }
          this.triggerEvent("closeshadow", true )
        })
        .catch(err => {
          this.triggerEvent("closeshadow", true )
          wx.showToast({
            title: err,
            duration: 2000,
            icon: 'none'
          })
        })
  
      })
    },
    close() {
      this.triggerEvent("closeshadow", true )
    }
  }
})
