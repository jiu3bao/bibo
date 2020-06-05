// accompany/pages/my-order-list/my-order-list.js
import service from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actab:1,
    page1:1,
    page2:1,
    pageSize:15
  },
  get_vip_list() {
    const data = {
      Token:wx.getStorageSync('user').Token,
      Page:this.data.page1,
      PageSize:this.data.pageSize,
      Param:0
    }
    service('ConsultAPI/GetZXSCustomCaseList',data)
    .then(r => {

    })
    .catch(err => {
      wx.showToast({
        title: '发生错误',
        icon:'none'
      })
    })
  },
  get_public_list() {
    const data = {
      Token:wx.getStorageSync('user').Token,
      Page:this.data.page2,
      PageSize:this.data.pageSize,
    }
    service('ConsultAPI/GetPublicCustomCaseList',data)
    .then(r => {

    })
    .catch(err => {
      wx.showToast({
        title: '发生错误',
        icon:'none'
      })
    })
  },
  //切换tab
  switch(e) {
    this.setData({
      actab:e.currentTarget.dataset.type
    })
  },
  //复制微信号
  copyText(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success (res) {
        wx.getClipboardData({
          success (res) {
            wx.showToast({
              title: '复制成功'
            })
          },
          fail(err) {
            console.error(err)
            wx.showToast({
              title: '复制失败',
              icon:"none"
            })
          }
        })
      },
      fail(err) {
        console.error(err)
        wx.showToast({
          title: '复制失败',
          icon:"none"
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_vip_list()
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
    wx.hideHomeButton({
      success() {
        
      }
    })
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