// pages/check-token/check-token.js
import service from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  get_openid() {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          if (res.code) {
            service('/GetWXXcxOpenid', {
              code: res.code
            })
              .then(r => {
                resolve(r.data.data.openid)
              })
          } else {
            console.log('登录失败！' + res.errMsg)
            reject(res.errMsg)
          }
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_openid()
    .then(r => {
      wx.setStorageSync('openid', r)
      const userinfo = wx.getStorageSync('user')
      if (userinfo.Token) {
        service('/RequestCheckToken',
          { Token: userinfo.Token })
          .then(r => {
            if (r.data.error_code !== 0) {
              // console.log(r.data.message)
              wx.showToast({
                title: r.data.message,
                duration: 2000,
                icon: 'none'
              })
            }
            if(wx.getStorageSync('user').pop==100) {
              wx.navigateTo({
                url: '/pages/staff-page/staff-page'
              })
            } else {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
            
          })
          .catch(e => {
            wx.showToast({
              title: '网络错误',
              duration: 2000,
              icon: 'none'
            })
          })
      } else {
        try {
          wx.removeStorageSync('user')
        } catch (e) {
          // Do something when catch error
        }
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    })
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})