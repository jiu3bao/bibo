// accompany/pages/user-center/user-center.js
import service from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      info:wx.getStorageSync('user')
    })
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