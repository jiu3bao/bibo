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
    src_url: app.globalData.src_url,
    qrcode:'',
    width:0,
    height:0,
    bg_list:[],
    bg_index:0,
    qr_local_path:'',
    head_local_path:'',
    head:'',
    name:''
  },
  get_bg() {
    return new Promise((resolve,reject) => {
      service('/GetPopularizeImg', {
        "Page": 1,
        "PageSize": 100
      })
      .then(r => {
        if(r.data.error_code!==0) {reject(r.data.message)}
        resolve(r.data.data)
      })
      .catch(err => {
        reject(err)
      })
    })
  },
  get_qrcode() {
    return new Promise((resolve,reject) => {
      const data = {
        Param: wx.getStorageSync('user').id,
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
            reject(r.data.message)
            return 
          }
          resolve(app.globalData.src_url +r.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
    
  },
  downLoadImg(url) {
    console.log(url)
    if(/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
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
    } else {
      return new Promise((resolve,reject) => {
        console.log(url)
        resolve(url) 
      })
    }
    
  },
  made_canvas_img(path) {
    const that = this
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(0,0,this.data.width,this.data.height);
    ctx.save()
    // 设置矩形边框
    // ctx.setStrokeStyle('#fff')
    // 设置矩形宽高
    // ctx.strokeRect(0, 0, 400, 200)
    // ctx.rect(0,0,this.data.width,this.data.height)
    // ctx.setFillStyle('white')
    // ctx.fillRect(0,0,this.data.width,this.data.height)
    // ctx.draw()
    let background = path[0]
    const top_height = this.data.height - 150
    ctx.drawImage(background, 0, 0, this.data.width, top_height)
    // 设置文字大小
    ctx.setFontSize(22)
    // 设置文字颜色
    ctx.fillStyle = '#000'

    const name = this.data.name&&this.data.name.length>0?this.data.name:'xxx'
    ctx.fillText(name, 180, top_height+120)
    ctx.drawImage(path[1], 20, top_height+15, 120, 120)
    ctx.drawImage(path[2], 180,  top_height+15, 60, 60)
    ctx.beginPath();//开始一个新的路径
    ctx.moveTo(160,top_height+15);//路径的起点
    ctx.lineTo(160,that.data.height);//路径的终点
    ctx.setLineWidth(2)
    ctx.setStrokeStyle('black')
    ctx.stroke();//对当前路径进行描边
    ctx.closePath();//关闭当前路径
    ctx.draw(false, function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success (res) {
          that.setData({
            qrcode: res.tempFilePath,
            hidden: false
          })
          wx.hideLoading()
        },
        fail(err) {
          wx.showToast({
            title: err,
            icon: 'none',
            duration: 3000
          })
          wx.hideLoading()
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
  prepic() {
    if (this.data.bg_index===0) return 
    wx.showLoading()
    this.setData({
      bg_index: this.data.bg_index-1
    },() =>{
      this.downLoadImg(this.data.bg_list[this.data.bg_index].pic_url)
      .then(r => {
        this.made_canvas_img([r, this.data.qr_local_path,this.data.head_local_path])
        })
      .catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: err,
          icon: 'none',
          duration: 3000
        })
      })
    })
  },
  nextpic() {
    if (this.data.bg_index === this.data.bg_list.length-1) return 
    wx.showLoading()
    this.setData({
      bg_index: this.data.bg_index + 1
    }, () => {
      this.downLoadImg(this.data.bg_list[this.data.bg_index].pic_url)
        .then(r => {
          this.made_canvas_img([r, this.data.qr_local_path,this.data.head_local_path])
        })
        .catch(err=> {
          wx.hideLoading()
          wx.showToast({
            title: err,
            icon:'none',
            duration:3000
          })
        })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    const app_info = wx.getSystemInfoSync()
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      console.log(data.data)
      this.setData({
        head:data.data.head.length>0?data.data.head:data.data.default_head,
        name:data.data.name
      },() => {
        this.setData({
          width: app_info.windowWidth,
          height: app_info.windowHeight
        })
        console.log(456456)
        Promise.all([this.get_bg(), this.get_qrcode()])
        .then(r => {
          this.setData({
            bg_list:r[0],
          })
          return Promise.all([this.downLoadImg(r[0][0].pic_url), this.downLoadImg(r[1]), this.downLoadImg(this.data.head)])
        })
        .then(r1 => {
          console.log(r1)
          this.setData({
            qr_local_path: r1[1],
            head_local_path: r1[2]
          })
          this.made_canvas_img(r1)
        })
        .catch(err => {
          wx.hideLoading()
          wx.showToast({
            title: err,
            duration: 2000,
            icon: 'none'
          })
        })
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