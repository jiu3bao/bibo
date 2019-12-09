// pages/qrcode/qrcode.js
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

  },
  get_access_token() {
    return new Promise((resolve,reject) => {
      wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/token', //仅为示例，并非真实的接口地址
        data: {
          grant_type:'client_credential',
          appid:'wxa95f4d38ecc653d5',
          secret:''
        },
        method:'GET',
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
    
  },
  get_qrcode(access_token) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit', //仅为示例，并非真实的接口地址
        data: {
          access_token: access_token,
          scene:{reference_id:wx.getStorageSync('user').id}
        },
        method: 'POST',
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
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