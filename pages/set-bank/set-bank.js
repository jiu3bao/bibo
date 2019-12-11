// pages/set-bank/set-bank.js
import service from '../../utils/api.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '登录', //导航栏 中间的标题
    },
    navbarHeight: app.globalData.navbarHeight,
    bank_name:'',
    bank_card:'',
    account_name:''
  },
  input(e) {
    console.log(e)
    const type = e.currentTarget.dataset.type
    const val = e.detail.value
    console.log(type,val)
    this.setData({
      [type]:val
    })
  },
  save() {
    const data = {
      Token:wx.getStorageSync('user').Token,
      bank_name: this.data.bank_name,
      bank_card: this.data.bank_card,
      account_name: this.data.account_name
    }
    console.log(data)
    service('/SetUserBank',data)
    .then(r => {
      if (r.data.error_code===6) {
        wx.navigateTo({
          url: '/pages/login/login',
        })
        return 
      }
      if (r.data.error_code !== 0) return 
      const user = wx.getStorageSync('user')
      user.bank_name = this.data.bank_name
      user.bank_card = this.data.bank_card
      user.account_name = this.data.account_name
      wx.setStorageSync('user', user)
      wx.navigateBack()
    })
    .catch(err => {
      console.log(err)
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