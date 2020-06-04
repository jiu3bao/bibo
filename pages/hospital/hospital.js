// pages/hospital/hospital.js
import service from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBanner()
  },
  getBanner() {
    service('API/GetBannersList',{})
    .then(r => {
      this.setData({
        bannerList:r.data.data
      })
    })
    .catch(e => {
      wx.showToast({
        title: '网络错误',
        duration: 2000,
        icon: 'none'
      })
    })
  },
  to_design() {
    wx.navigateTo({url:'/packageA/pages/setdesign/setdesign'})
  },
  to_feedback() {
    wx.navigateTo({url:'/packageA/pages/design-feedback/design-feedback'})
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