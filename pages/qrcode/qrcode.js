// pages/qrcode/qrcode.js
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
    qrcode:'',
    width:0,
    height:0,
  },
  get_qrcode() {
    return new Promise((resolve,reject) => {
      const data = {
        Param: 'id=' + wx.getStorageSync('user').id,
        Token: wx.getStorageSync('user').Token
      }
      service('/GetXcxUnlimited', data)
        .then(r => {
          if (r.data.error_code === 6) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
            return
          }
          if (r.data.error_code !== 0) {
            console.log(r.data.message)
          }
          resolve(app.globalData.src_url +r.data.data)
        })
        .catch(err => {
          console.log(err)
        })
    })
    
  },
  downLoadImg(url) {
    return new Promise((resolve,reject) => {
      wx.getImageInfo({
        src: url,    //请求的网络图片路径
        success(res) {
          resolve(res.path)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  made_canvas_img(path) {
    const that = this
    
    console.log(123)
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.save()
    // 设置矩形边框
    ctx.setStrokeStyle('#fff')
    // 设置矩形宽高
    ctx.strokeRect(0, 0, 400, 200)
    let background = '../../img/qrbg.jpg'
    console.log(that.data.width, that.data.height)
    ctx.drawImage(background, 0, 0, that.data.width, that.data.height)
    // 设置文字大小
    ctx.setFontSize(24)
    // 设置文字颜色
    ctx.fillStyle = '#fff'

    const str = "hhhhhh"
    ctx.fillText(str, 180, 200)
    ctx.fillText('hufisuh', 180, 250)
    ctx.drawImage(path, 160, 370, 200, 200)
    console.log(ctx)
    ctx.draw(false, function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success (res) {
          console.log(res.tempFilePath)
          that.setData({
            qrcode: res.tempFilePath,
            hidden: false
          })
        },
        fail(err) {
          console.log(err)
        }
      })
    })
  },
  save_img() {
    wx.saveImageToPhotosAlbum({
      filePath:this.data.qrcode,
      success(res) {
        wx.showToast({
          title: '保存成功',
          duration:2000
        })
       }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app_info = wx.getSystemInfoSync()
    this.setData({
      width: app_info.windowWidth,
      height: app_info.windowHeight
    })
    this.get_qrcode()
    .then(r => {
      return this.downLoadImg(r)
    })
    .then(r1 => {
      this.made_canvas_img(r1)
    })
    .catch(err => {
      wx.showToast({
        title: '网络错误',
        duration: 2000,
        icon: 'none'
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