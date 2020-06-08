// pages/my-welfare/my-welfare.js
import service from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    nouse_l:[],
    used_l:[],
    page1:1,
    page2:1,
    list:[],
    actab:1
  },
  //切换tab
  switch(e) {
    const actab = e.currentTarget.dataset.type
    this.setData({
      actab:actab
    })
    if(actab==1) {
      if(this.data.nouse_l.length==0) {
        this.get_nouse_list()
      }
      this.setData({
        list:[...this.data.nouse_l]
      })
    } else {
      if(this.data.used_l.length==0) {
        this.get_used_list()
      }
      this.setData({
        list:[...this.data.used_l]
      })
    }
  },
  todetail() {
    wx.navigateTo({
      url: '/packageA/pages/my-welfare-detail/my-walfare-detail',
    })
  },
  get_nouse_list() {
    const data = {
      Token:wx.getStorageSync('user').Token,
      Param:'1',
      Page:this.data.page1,
      PageSize:15
    }
    service('ShopAPI/GetUserOrderList',data)
    .then(r => {
      if(r.data.error_code==6) {
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
        return 
      }
      this.setData({
        nouse_l:[...this.data.nouse_l,...r.data.data],
        list:[...this.data.nouse_l,...r.data.data],
      })
    })
  },
  get_used_list() {
    const data = {
      Token:wx.getStorageSync('user').Token,
      Param:'5',
      Page:this.data.page2,
      PageSize:15
    }
    service('ShopAPI/GetUserOrderList',data)
    .then(r => {
      if(r.data.error_code==6) {
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
        return 
      }
      this.setData({
        used_l:[...this.data.used_l,...r.data.data],
        list:[...this.data.used_l,...r.data.data],
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      info:wx.getStorageSync('user')
    })
    this.get_nouse_list()
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