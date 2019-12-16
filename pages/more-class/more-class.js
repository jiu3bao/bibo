// pages/more-notice/more-notice.js
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
    navbarHeight: app.globalData.navbarHeight,
    src_url: app.globalData.src_url,
    classList: [],
    page: 1,
    pageSize: 10,
    islastpage: false
  },
  get_notice(page = 1, pagesize = 10) {
    return new Promise((resolve, reject) => {
      const data = {
        page: page,
        pageSize: pagesize,
        Param: 1
      }
      service('/GetPublicArticlesList', data)
        .then(r => {
          resolve(r)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  set_notice(page = 1) {
    this.get_notice(page)
      .then(r => {
        if (r.data.data.length === 0) {
          wx.showToast({
            title: '已经到底了',
            duration: 2000,
            icon: 'none'
          })
          this.setData({
            islastpage: true
          })
          return
        }
        const oldarr = this.data.classList
        this.setData({
          classList: [...oldarr, ...r.data.data]
        })
      })
      .catch(err => {
        wx.showToast({
          title: '网络错误',
          duration: 2000,
          icon: 'none'
        })
      })
  },
  todetail(e) {
    const id = e.currentTarget.dataset.id
    console.log(e)
    wx.navigateTo({
      url: '/pages/class-detail/class-detail?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.set_notice()
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
    if (this.data.islastpage) {
      console.log('no more')
      return
    }
    let p = this.data.page
    p++
    this.set_notice(p)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})