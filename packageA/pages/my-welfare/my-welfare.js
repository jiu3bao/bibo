// pages/my-welfare/my-welfare.js
import service from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    list:[]
  },
  todetail() {
    wx.navigateTo({
      url: '/packageA/pages/my-welfare-detail/my-walfare-detail',
    })
  },
  get_list() {
    const data = {
      Token:wx.getStorageSync('user').Token
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      info:wx.getStorageSync('user')
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