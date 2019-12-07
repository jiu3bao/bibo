// pages/article-detail/article-detail.js
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
    detail: {}
  },
  get_detail(id) {
    service('/GetArticlesDetail', { id: id })
      .then(r => {
        var that = this;
        const html = that.htmlEscape(r.data.data.detail)
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
    const reg = /(&lt;)|(&gt;)|(&amp;)|(&quot;)|(&nbsp;)/g;
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
          return "\""

      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_detail(options.id)
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