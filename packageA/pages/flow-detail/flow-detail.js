// pages/flow-detail/flow-detail.js
import service from '../../../utils/api.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:1,
    pagesize:120,
    islastpage:false,
    istuiguang:false
  },
  get_list(p) {
    const data = {
      Token:wx.getStorageSync('user').Token,
      Page:this.data.page,
      PageSize:this.data.pagesize
    }
    return new Promise((resolve,reject) => {
      service('API/GetMyBonusRecord',data)
      .then(r => {
        if(r.data.error_code === 6) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
          reject(r.data.message)
          return
        }
        if (r.data.error_code!==0) {
          reject(r.data.message)
          return
        }
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
    this.setData({
      istuiguang:options.tg
    })
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