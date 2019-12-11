// pages/goods-detail/goods-detail.js
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
    detail: {},
    src_url: app.globalData.src_url,
    id:''
  },
  get_detail(id) {
    const data = {
      id:id,
      Token:wx.getStorageSync('user').Token
    }
    service('/GetGoodsDetail',data)
      .then(r => {
        if (r.data.error_code===6) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
          return
        } 
        if (r.data.error_code !==0) return 
        var that = this;
        const html = that.htmlEscape(r.data.data.introduce)
        console.log(html)
        this.setData({
          detail: r.data.data
        })
        WxParse.wxParse('article', 'html', html, that, 5);
      })
      .catch(err => {

      })
  },
  htmlEscape(html) {
    console.log(html)
    const reg = /(&lt;)|(&gt;)|(&amp;)|(&quot;)|(&nbsp;)|(src=\")|(src=\')/g;
    return html.replace(reg, function (match) {
      switch (match) {
        case "&lt;":
          return "<";
        case "&gt;":
          return ">";
        case "&amp;":
          return "&";
        case "&nbsp;":
          return " ";
        case "&quot;":
          return "\"";
        case "src=\"":
          return "src=\""+app.globalData.src_url;
        case "src=\'":
          return "src=\'" + app.globalData.src_url;
      }
    });
  },
  create_order() {
    Promise.all([this.get_order_id(),this.get_openid()])
    .then(res => {
      return this.get_pay_param(...res)
    })
    .then(r => {
      console.log(r)
      wx.requestPayment({
        timeStamp: r.timestamp,
        nonceStr: r.nonceStr,
        package: r.prepay_id,
        signType: r.signType,
        paySign: r.paySign,
        success(res) { 
          console.log(res)
        },
        fail(res) { 
          console.log(res)
        }
      })
    })
    .catch(err=> {

    })
  },
  get_order_id() {
    return new Promise((resolve,reject) => {
      const data = {
        Token: wx.getStorageSync('user').Token,
        goods_id: this.data.id
      }
      service('/CreateOrder', data)
        .then(r => {
          if (r.data.error_code === 6) {
            wx, wx.navigateTo({
              url: '/pages/login/login',
            })
            return
          }
          if (r.data.error_code !== 0) {
            console.log(r.data.message)
            return
          }
          resolve(r.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  get_openid() {
    return new Promise((resolve,reject) => {
      wx.login({
        success(res) {
          if (res.code) {
            service('/GetWXXcxOpenid', {
              code: res.code
            })
            .then(r => {
              resolve(r.data.data.openid)
            })
          } else {
            console.log('登录失败！' + res.errMsg)
            reject(res.errMsg)
          }
        }
      })
    })
    
  },
  get_pay_param(order_id,openid) {
    return new Promise((resolve,reject) => {
      const data = {
        Token: wx.getStorageSync('user').Token,
        OrderID: order_id,
        OpenID:openid
      }
      service('/GetWXXcxPayParam', data)
        .then(r => {
          if (r.data.error_code === 6) {
            wx, wx.navigateTo({
              url: '/pages/login/login',
            })
            return
          }
          if (r.data.error_code !== 0) {
            console.log(r.data.message)
            return
          }
          resolve(r.data.data)
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
    this.get_detail(options.id)
    this.setData({
      id: options.id
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})