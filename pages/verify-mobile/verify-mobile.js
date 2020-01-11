// pages/system-set/system-set.js
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
    mobile:'',
    code:'',
    time:0,
    timer:null
  },
  next() {
    if(this.data.code && this.data.code.length>0) {
      wx.navigateTo({
        url: '/pages/change-mobile/change-mobile',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function (data) {
            console.log(data)
          },
          someEvent: function (data) {
            console.log(data)
          }
        },
        success: (res) => {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: this.data.code })
        }
      })
    } else {
      wx.showToast({
        title: '请输入验证码',
        icon:'none',
        duration:3000
      })
    }
    
  },
  get_code() {
    if (this.data.time !== 0) return
    wx.showLoading()
    const data = {
      mobile: this.data.mobile
    }
    service('/RequestCode', data)
      .then(r => {
        if (r.data.error_code !== 0) {
          wx.showToast({
            title: r.data.message,
            duration: 2000,
            icon: 'none'
          })
          return
        }
        wx.showToast({
          title: '发送成功',
          duration: 2000,
        })
        wx.hideLoading()
        this.set_timer()
      })
      .catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: err,
          duration: 2000,
          icon: 'none'
        })
      })

  },
  //设置计时器
  set_timer() {
    if (this.data.time === 0) {
      let t = 30
      this.setData({
        time: t
      }, () => {
        const timer = setInterval(() => {
          this.setData({
            timer: timer
          })
          t--
          this.setData({
            time: t
          })
          if (t === 0) {
            clearInterval(timer)
          }
        }, 1000)
      })
    }
  },
  set_code(e) {
    this.setData({
      code: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mobile:wx.getStorageSync('user').mobile
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
    clearInterval(this.data.timer)
    this.setData({
      timer: null
    })
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