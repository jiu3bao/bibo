// pages/goods-detail/goods-detail.js
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
    list: [],
    page0:1,
    page1:1,
    islastpage1:false,
    islastpage0:false,
    type: [{
      type: 0,
      name: '未完成'
    },
    {
      type: 1,
      name: '已完成'
    }],
    now_at_type: 0,
    notdone_list:[],
    done_list:[]
  },
  change_type(e, type) {
    const t = e ? e.target.dataset.type : type
    //没做切换直接return
    if (this.data.now_at_type === t) return
    this.setData({ now_at_type: t })
    if(t===0) {
      if (this.data.notdone_list.length===0) {
        this.get_not_done_list(1)
      } 
    } else {
      if (this.data.done_list.length === 0) {
        this.get_done_list(1)
      } 
    }
  },
  get_not_done_list(p) {
    const data = {
      Page: p,
      PageSize: 10,
      Token: wx.getStorageSync('user').Token
    }
    service('/GetMissonList', data)
      .then(r => {
        if(r.data.error_code===6) {
          wx.navigateTo({
            url: 'pages/login/login',
          })
          return 
        } 
        if (r.data.error_code!==0) {
          wx.showToast({
            title: r.data.message,
            duration: 2000,
            icon: 'none'
          })
          return
        }
        if (!!!r.data.data.length) {
          this.setData({
            islastpage: true
          })
          return
        }
        const arr = this.data.list
        this.setData({
          notdone_list: [...arr, ...r.data.data]
        })
      })
      .catch(err => {
        wx.showToast({
          title: err,
          duration: 2000,
          icon: 'none'
        })
      })
  },
  get_done_list(p) {
    const data = {
      Page:p,
      PageSize:10,
      Token:wx.getStorageSync('user').Token
    }
    service('/GetMissCompleteList', data)
      .then(r => {
        if (r.data.error_code === 6) {
          wx.navigateTo({
            url: 'pages/login/login',
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
        if(!!!r.data.data.length) {
          this.setData({
            islastpage:true
          })
          return 
        } 
        const arr = this.data.list
        this.setData({
          done_list: [...arr,...r.data.data]
        })
      })
      .catch(err => {
        wx.showToast({
          title: err,
          duration: 2000,
          icon: 'none'
        })
      })
  },
  todetail(e) {
    const id=e.currentTarget.dataset.id  
    const type = e.currentTarget.dataset.type  
    wx.navigateTo({
      url: '/pages/extension-detail/extension-detail?id=' + id + '&isdone=' + type,
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
    this.get_not_done_list(1)
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
    if (this.data.now_at_type===0) {
      if (this.data.islastpage0) return
      const p = this.data.page0 + 1
      this.setData({
        page0: p
      })
      this.get_not_done_list(p)
    } else {
      if (this.data.islastpage1) return
      const p = this.data.page1 + 1
      this.setData({
        page1: p
      })
      this.get_done_list(p)
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})