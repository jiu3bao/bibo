import service from '../../utils/api.js'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_src: '',
    time:0,
    timer:null,
    mobile:'',
    code:'',
    reference_id: '',
    reference_info:{},
    canback:false
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
      wx.showToast({
        title: '手机号违法',
        duration: 2000,
        icon:'none'
      })
      return 
    }
    if(this.data.time !==0) return
    wx.showLoading({mask:true})
    const data = {
      mobile:this.data.mobile
    }
    service('API/RequestCode',data)
      .then (r => {
        if (r.data.error_code !==0) {
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
          title: '网络错误',
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
  //登录
  login() {
    const checked = this.check()
    console.log(this.data.reference_id)
    if(!checked) return 
    const data = {
      mobile:this.data.mobile,
      code: this.data.code,
      reference_id: this.data.reference_id
    }
    service('API/LoginByMobile',data)
      .then(r=>{
        if (r.data.error_code!==0) {
          wx.showToast({
            title: r.data.message,
            duration: 2000,
            icon: 'none'
          })
          // console.log(r.data.message)
          return 
        }
        wx.showToast({
          title: '登录成功',
          duration: 2000
        })
        wx.setStorageSync('user', r.data.data)
        this.is_shop()
        if(this.data.canback) {
          wx.navigateBack()
        } else {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
        
        
      })
      .catch(r => {
        wx.showToast({
          title: '网络错误',
          duration: 2000,
          icon: 'none'
        })
      })
  },
  //check
  check() {
    if (this.data.mobile.length!==11) {
      // console.log('手机号违法')
      wx.showToast({
        title: '手机号违法',
        duration: 2000,
        icon: 'none'
      })
      return false
    }
    if(this.data.code.length===0) {
      // console.log('没有验证码')
      wx.showToast({
        title: '没有验证码',
        duration: 2000,
        icon: 'none'
      })
      return false
    }
    return true
  },
  get_reference_info() {
    service('API/GetReferenceInfo', { id: wx.getStorageSync('scene')})
    .then(r => {
      console.log(r)
      if(r.data.error_code!==0) {
        this.setData({
          reference_id:null
        })
        return 
      }
      this.setData({
        reference_info:r.data.data,
        reference_id: wx.getStorageSync('scene')
      },()=>{
        console.log(this.data.reference_id)
      })
    })
    .catch(err => {
      wx.showToast({
        title: err,
        icon:'none',
        duration:3000
      })
    })
  },
  is_shop() {
    service('ShopAPI/GetMyShop', { Token: wx.getStorageSync('user').Token})
    .then(r => {

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('scene')) {
      
      this.get_reference_info()
    }
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      console.log(data)
      this.setData({
        canback: data.canBack,
      })
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