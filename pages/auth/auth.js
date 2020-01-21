// pages/auth/auth.js
import service from '../../utils/api.js'
const app = getApp()

var WxParse = require('../../wxParse/wxParse.js');

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
  },
  wx_get_info() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success(res) {
          resolve(res)
        },
        fail(error) {
          // reject(error)
          wx.showModal({
            title: '用户未授权',
            content: '未授权将不能正常使用小程序功能！请同意授权。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        }
      })
    })
  },
  getUserInfo(e) { 
    this.wx_get_info()
    .then(res => {
      wx.showLoading({
        title: '正在授权，请稍后',
        icon: 'none'
      })
      const userInfo = res.userInfo
      console.log(userInfo)
      const data = {
        name:userInfo.nickName,
        head:userInfo.avatarUrl,
        Token:wx.getStorageSync('user').Token,
      }
      if (!data.name || !data.head ) {
        wx.hideLoading()
        wx.showToast({
          title: '授权失败，请重新授权',
          duration: 2000,
          icon: 'none'
        })
        return Promise.reject()
      } 
      console.log(data)
      service('/SetMyInfo',data)//保存获取到的信息
      .then(r => {
        wx.hideLoading()
        if (r.data.error_code===6){
          wx.navigateTo({
            url: '/pages/login/login',
          })
          return
        }
        if(r.data.error_code!==0) {
          console.log(r.data.message)
          return
        }
        wx.navigateBack()
      })
      .catch(err => {
        wx.showToast({
          title: err,
          duration: 2000,
          icon: 'none'
        })
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