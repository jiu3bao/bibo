// accompany/pages/user-center/user-center.js
import service from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    moneyInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      info:wx.getStorageSync('user')
    })
  },
  //获取钱
  get_money_info() {
    service('API/StcBonus', { Token: wx.getStorageSync('user').Token})
      .then(r => {
        if (r.data.error_code === 6) {
          this.setData({
            // baseInfo: { default_head:'../../img/default.png'},
            moneyInfo:{}
          })
          // wx.navigateTo({
          //   url: '/pages/login/login',
          // })
          return 
        }
        if (r.data.error_code !== 0) {
          wx.showToast({
            title: r.data.message,
            duration: 2000,
            icon: 'none'
          })
          return
        }
        r.data.data.total = (r.data.data.xf + r.data.data.fx + r.data.data.zs).toFixed(2)
        this.setData({
          moneyInfo: r.data.data
        })
      })
      .catch(r => {
        wx.showToast({
          title: err,
          duration: 2000,
          icon: 'none'
        })
      })
  },
  applyed() {
    this.get_money_info()
  },
  get_user_info() {
    service('/API/GetUserInfo',{Token:wx.getStorageSync('user').Token})
    .then(r => {
      this.setData({
        info:{...r.data.data,Token:wx.getStorageSync('user').Token}
      },
      () => {
        wx.setStorageSync('user', this.data.info)
      })
    })
  },
  toset() {
    wx.navigateTo({
      url: '/packageA/pages/set-sys/set-sys?showapply=0',
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
    this.get_user_info()
    this.get_money_info()
    wx.hideHomeButton({
      success() {
        
      }
    })
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