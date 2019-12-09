// pages/goods-detail/goods-detail.js
import service from '../../utils/api.js'
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的主页', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    navbarHeight: app.globalData.navbarHeight,
    detail: {}

  },
  get_detail(id) {
    const data = {
      id:id,
      Token:wx.getStorageSync('user').Token
    }
    service('/GetGoodsDetail',data)
      .then(r => {
        if (r.data.error_code===6) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } 
        if (r.data.error_code !==0) return 
        this.setData({
          detail:r.data.data
        })
      })
      .catch(err => {

      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_detail(options.id)
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