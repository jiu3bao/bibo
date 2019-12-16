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

    newsList: [],
    page: 1,
    pageSize: 10,
    islastpage: false
  },
  get_notice(page = 1, pagesize = 10) {
    return new Promise((resolve, reject) => {
      const data = {
        page: page,
        pageSize: pagesize,
        Param: 0
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
          console.log('no more')
          this.setData({
            islastpage: true
          })
          return
        }
        const result = this.format_news_by_day(r.data.data)
        const oldarr = this.data.newsList
        this.setData({
          newsList: [...oldarr, ...result]
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
  format_news_by_day(arr) {
    let result=[]
    const daymap = new Map()
    arr.map(item => {
      const day = item.time.split(' ')[0]
      const d = this.format_day(day)
      console.log(d)
      item.day = d
      const dayarr = daymap.get(day)
      if(dayarr) {
        dayarr.push(item)
      } else {
        daymap.set(day,[item])
      }
    })
    daymap.forEach(v => {
      result.push(v)
    })
    
    return result
  },
  format_day(time) {
    console.log(time)
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + 1 < 10 ? '0' + now.getMonth() : now.getMonth()
    const d = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
    let today = y + '-' + m + '-' + d
    if (time === today){
      today ='今天'
    }
    return today 
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