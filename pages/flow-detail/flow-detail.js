// pages/flow-detail/flow-detail.js
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
    list:[],
    page:1,
    pagesize:120,
    islastpage:false
  },
  get_list(p) {
    const data = {
      Token:wx.getStorageSync('user').Token,
      Page:this.data.page,
      PageSize:this.data.pagesize
    }
    return new Promise((resolve,reject) => {
      service('/GetMyBonusRecord',data)
      .then(r => {
        resolve(r)
      })
      .catch(err => {
        reject(err)
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_list(1)
    .then(r => {
      this.setData({
        list:r.data.data
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
    if(this.data.islastpage) return 
    const p =this.data.page+1
    this.setData({
      page:p
    })
    this.get_list(p)
      .then(r => {
        if(r.data.data.length===0) {
          this.setData({
            islastpage:true
          })
          return 
        }
        this.setData({
          list: [...this.data.list,...r.data.data]
        })
      })
      .catch(err => {

      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})