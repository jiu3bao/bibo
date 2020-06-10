import service from "../../../utils/api"

// pages/my-shaping/my-shaping.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    actab:1,
    noend_l:[],
    end_l:[],
    page1:1,
    page2:1
  },
  //切换tab
  switch(e) {
    const actab = e.currentTarget.dataset.type
    this.setData({
      actab:actab
    })
    if(actab==1) {
      if(this.data.noend_l.length==0) {
        this.get_noend()
      }
    } else {
      if(this.data.end_l.length==0) {
        this.get_end()
      }
    }
  },
  get_noend() {
    const data ={
      Page:this.data.page1,
      PageSize:15,
      Param:0,
      Token: wx.getStorageSync('user').Token
    }
    service('API/GetMyMedicalRecordList', data)
    .then(r => {
      if (r.data.error_code === 6) {
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
        return
      }
      if (r.data.error_code !== 0) {
        wx.showToast({
          title: r.data.message,
          duration: 2000,
          icon: 'none'
        })
        return
      }
      r.data.data.map(i => {
        try {
          i.item_list = JSON.parse(i.item)
        } catch (e) {
          // i.item_list = i.item
        }
      })
      this.setData({
        noend_l:r.data.data
      })
    })
  },
  get_end() {
    const data ={
      Page:this.data.page2,
      PageSize:15,
      Param:1,
      Token: wx.getStorageSync('user').Token
    }
    service('API/GetMyMedicalRecordList', data)
    .then(r => {
      if (r.data.error_code === 6) {
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
        return
      }
      if (r.data.error_code !== 0) {
        wx.showToast({
          title: r.data.message,
          duration: 2000,
          icon: 'none'
        })
        return
      }
      r.data.data.map(i => {
        try {
          i.item_list = JSON.parse(i.item)
        } catch (e) {
          // i.item_list = i.item
        }
      })
      this.setData({
        end_l:r.data.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      info:wx.getStorageSync('user')
    })
    this.get_noend()
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