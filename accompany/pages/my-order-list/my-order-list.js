// accompany/pages/my-order-list/my-order-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actab:1
  },
  switch(e) {
    this.setData({
      actab:e.currentTarget.dataset.type
    })
  },
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