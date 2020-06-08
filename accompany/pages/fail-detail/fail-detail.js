// pages/fail-records/fail-records.js
import service from '../../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
        title: '保存成功',
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