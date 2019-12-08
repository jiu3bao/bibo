// pages/member-manage/member-manage.js
import service from '../../utils/api.js'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '登录', //导航栏 中间的标题
    },
    navbarHeight: app.globalData.navbarHeight,
    type:0,
    vipList:[],
    partnerList:[]
  },
  slide(e) {
    this.setData({
      type: e.detail.current
    })
  },
  changetype(e) {
    this.setData({
      type: e.currentTarget.dataset.type
    })
  },
  get_member_list() {
    service('/GetMyMember',{Token:wx.getStorageSync('user').Token})
      .then(r => {
        if (r.data.error_code === 6) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } 
        let total_arr = r.data.data
        //区分两种会员
      })
      .catch(err => {

      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_member_list()
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