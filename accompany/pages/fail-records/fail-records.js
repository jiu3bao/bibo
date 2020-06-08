// pages/fail-records/fail-records.js
import service from '../../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:1,
    pagesize:10,
    islastpage:false
  },
  get_list(p) {
    const data = {
      Token:wx.getStorageSync('user').Token,
      Page:p,
      PageSize:this.data.pagesize
    }
    service('/GetFailedProRecordList',data)
    .then(r => {
      if(r.data.error_code===6) {
        wx.showToast({
          title: '登录已过期，请重新登录',
          icon:"none"
        })
        wx.navigateTo({
          url: "/pages/employee-login/employee-login",
        })
        return 
      }
      if(r.data.error_code!==0) {
        wx.showToast({
          title: r.data.message,
          icon:'none',
          duration:3000
        })
        return 
      }
      if(r.data.data.length===0) {
        this.setData({
          islastpage:true
        })
        return
      }
      r.data.data.map(item => {
        item.item_list = JSON.parse(item.item)
        item.time = item.time.split(' ')[0]
      })
      this.setData({
        list: r.data.data
      })
    })
    .catch(err => {
      wx.showToast({
        title: err,
        icon:'none',
        duration:3000
      })
    })
  },
  to_detail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/staff-page/staff-page?item=' + JSON.stringify(item) ,
    })
  },
  torecord() {
    wx.navigateTo({
      url: '/pages/staff-page/staff-page',
    })
  },
  qh() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.setData({
      list: []
    },() => {
      this.get_list(1)
    })
    // if(this.data.list.length>0) return
    
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
    const p = this.data.page+1
    this.setData({
      page:p
    })
    this.get_list(p)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})