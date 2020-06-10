// pages/hospital/hospital.js
import service from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    consult_list:[],
    page:1,
    islastpage:false
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
  get_consult_list() {
    if(this.data.islastpage) return 
    const data = {
      Token:wx.getStorageSync('user').Token,
      Page:this.data.page,
      PageSize:5,
      status:1
    }
    service('ConsultAPI/GetMyCaseList',data)
    .then(r => {
      if(r.data.error_code!=0) {
        wx.showToast({
          title: r.data.message,
          icon:'none',
        })
        return 
      }
      if(r.data.data.length<5) {
        this.setData({
          islastpage:true
        })
      }
      this.setData({
        consult_list:r.data.data
      })
    })
  },
  to_design() {
    wx.navigateTo({url:'/packageA/pages/setdesign/setdesign'})
  },
  to_feedback(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({url:'/packageA/pages/design-feedback/design-feedback?caseid='+item.custom_case_id})
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
    this.get_consult_list()
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
    this.setData({
      page:this.data.page+1
    },() => {
      this.get_consult_list()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})