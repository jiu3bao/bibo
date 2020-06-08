// pages/user-info/user-info.js
import service from '../../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    nowdate:'',
    code:'',
    time:0,
    timer:null
  },
  bindKeyInput(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      info:{...this.data.info,
          [type]: e.detail.value
          }
    })
  },
  opensex() {
    const that = this
    wx.showActionSheet({
      itemList:["女","男"],
      success (res) {
        that.setData({
          info: {
            ...that.data.info,
            sex: res.tapIndex===0?"女":"男"
          }
        })
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  set_birthday(e) {
    this.setData({
      info: {
        ...this.data.info,
        birthday: e.detail.value
      }
    })
  },
  get_code() {
    if (this.data.time !== 0) return
    if(!this.data.info.mobile||this.data.info.mobile.length===0) return 
    wx.showLoading({mask:true})
    const data = {
      mobile: this.data.info.mobile
    }
    service('API/RequestCode', data)
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
  submit() {
    const data = {
      ...this.data.info,
      Token:wx.getStorageSync('user').Token,
    }
    service('API/SetMyInfo',data)
    .then(r => {
      if (r.data.error_code===6){
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
        return
      }
      if(r.data.error_code!==0) {
        console.log(r.data.message)
        return
      }
      wx.navigateBack()
    })
    .catch(err => {
      wx.showToast({
        title: err,
        duration: 2000,
        icon: 'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      info:{...wx.getStorageSync('user'),iszxs:true}
    })
    const now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth()+1
    let day = now.getDate()
    month = month<10?'0'+month:month
    day = day<10?'0'+day:day
    this.setData({
      nowdate:year+'-'+month+'-'+day
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