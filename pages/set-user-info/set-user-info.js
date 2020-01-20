// pages/set-user-info/set-user-info.js

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
    info:{},
    head_img:'',
    nowdate:''
  },
  set_info(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      info:{...this.data.info,
          [type]: e.detail.value
          }
    })
  },
  radioChange(e) {
    this.setData({
      info: {
        ...this.data.info,
        sex: e.detail.value
      }
    })
  },
  chooseimage() {
    const that = this
    wx.chooseImage({
      count:1,
      sizeType: ['compressed'],
      success(res) {
        console.log(res)
        that.setData({
          head_img: res.tempFilePaths
        })
        that.up_img(res.tempFilePaths)
        .then(r => {
          console.log(r)
          const i = that.data.info
          that.setData({
            info: { ...i, head: JSON.parse(r.data).file_url}
          })
        })
        .catch(err => {
          wx.showToast({
            title: '网络错误',
            duration: 2000,
            icon: 'none'
          })
        })
      },
      fail(err) {
        wx.showToast({
          title: '选择图片失败',
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
  up_img(path) {
    console.log(path)
    return new Promise((resolve,reject) => {
      wx.uploadFile({
        url: 'https://ym.bibo80s.com/Main/UploadFile',
        filePath: path[0],
        name:'img',
        success(res) {
          resolve(res)
        },
        fail(err) {
          console.log(err)
          reject(err)
        }
      })
    })
    
  },
  set_birthday(e) {
    console.log(e.detail)
    this.setData({
      info: {
        ...this.data.info,
        birthday: e.detail.value
      }
    })
  },
  save() {
    console.log(this.data.info,789798)
    // this.data.info.birthday = new Date().getFullYear()-this.data.info.birthday
    const data = {
      ...this.data.info,
      Token:wx.getStorageSync('user').Token,
    }
    service('/SetMyInfo',data)
    .then(r => {
      if (r.data.error_code===6){
        wx.navigateTo({
          url: '/pages/login/login',
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
    const eventChannel = this.getOpenerEventChannel()
    // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
    // eventChannel.emit('someEvent', { data: 'test' });
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', (data) =>{
      this.setData({
        head_img: data.data.head && data.data.head.length>0?data.data.head:data.data.default_head
      })
      this.setData({
        info: data.data
      })
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