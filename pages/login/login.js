// pages/login/login.js
import service from '../../utils/api.js'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '登录', //导航栏 中间的标题
    },
    navbarHeight: app.globalData.navbarHeight,
    time:0,
    timer:null,
    mobile:'',
    code:'',
    reference_id:''
  },
  //双向绑定
  set_mobile(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  set_code(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //获取验证码
  get_code() {
    if (this.data.mobile.length!==11) {
      console.log('手机号违法')
      return 
    }
    if(this.data.time !==0) return
    const data = {
      mobile:this.data.mobile
    }
    service('/RequestCode',data)
      .then (r => {
        if (r.data.error_code !==0) {
          console.log(r.data.message)
          return 
        }
        this.set_timer()
      })
      .catch(err => {

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
  //登录
  login() {
    const checked = this.check()
    if(!checked) return 
    const data = {
      mobile:this.data.mobile,
      code: this.data.code,
      reference_id: this.data.reference_id
    }
    service('/LoginByMobile',data)
      .then(r=>{
        console.log(r)
        if (r.data.error_code!==0) {
          console.log(r.data.message)
          return 
        }
        wx.setStorageSync('user', r.data.data)
        wx.switchTab({
          url: '/pages/index/index'
        })
      })
      .catch(r => {

      })
  },
  //check
  check() {
    if (this.data.mobile.length!==11) {
      console.log('手机号违法')
      return false
    }
    if(this.data.code.length===0) {
      console.log('没有验证码')
      return false
    }
    return true
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
    clearInterval(this.data.timer)
    this.setData({
      timer:null
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