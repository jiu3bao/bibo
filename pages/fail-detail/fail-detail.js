// pages/fail-records/fail-records.js
import service from '../../utils/api.js'
const app = getApp()

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
    img_root: app.globalData.src_url,
    item: {},
  },
  change(e) {
    this.setData({
      item:{...this.data.item,money:e.detail.value}
    })
  },
  save() {
    const data = {
      Token:wx.getStorageSync('user').Token,
      id:this.data.item.id,
      money:this.data.item.money
    }
    service('/UpdateProRecord',data)
    .then(r => {
      if (r.data.error_code === 6) {
        wx.navigateTo({
          url: "/pages/employee-login/employee-login",
        })
        return
      }
      if (r.data.error_code !== 0) {
        wx.showToast({
          title: r.data.message,
          icon: 'none',
          duration: 3000
        })
        return
      }
      wx.showToast({
        title: 保存成功,
        icon: 'none',
        duration: 3000
      })
      wx.navigateBack()
    })
    .catch(err => {
      wx.showToast({
        title: err,
        icon: 'none',
        duration: 3000
      })
    })
    console.log(data)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.item))
    this.setData({
      item: JSON.parse(options.item)
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