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
    qrcode:'eyJNZXNzYWdlIjoi5q2k6LWE5rqQ5LiN5pSv5oyB6K+35rGC5a6e5L2T55qE5aqS5L2T57G75Z6L4oCcaW1hZ2UvanBlZ+KAneOAgiJ9'
  },
  get_qrcode() {
    const data = { Param:'id='+wx.getStorageSync('user').id}
    return new Promise((resolve,reject) => {
      wx.request({
        url:'https://ym.bibo80s.com/API/API/GetXcxUnlimited',
        method: "POST",
        data,
        responseType: 'arraybuffer', 
        header: { 'content-type':'image/jpeg'},
        success(r){
          resolve(r)
          
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  base64_to_file(base64) {
    return new Promise((resolve,reject) => {
      wx.getFileSystemManager().writeFile({
        filePath: filePath,
        data: base64,
        encoding: 'binary',
        success: () => {
          console.log('写入成功, 路径: ', filePath);
          resolve(filePath);
        },
        fail: err => {
          reject('写入失败：', err);
        },
      });
    })
  },
  draw_in_canvas(filePath) {
    return new Promise((resolve,reject) => {
      var ctx = wx.createCanvasContext('canvas');
      ctx.drawImage(filePath, 0, 0, 300, 300);
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId: 'canvas',
          success: res => {
            let saveFilePath = res.tempFilePath;
            console.log(res.tempFilePath)
            // /// 删除写入的数据
            // wx.getFileSystemManager().unlink({
            //   filePath: filePath,
            //   success: res => {
            //     console.log('删除成功, 路径: ', filePath);
            //     resolve(saveFilePath);
            //   },
            //   fail: err => {
            //     reject('删除失败：', err);
            //   }
            // })
          },
          fail: err => {
            reject('保存图片到本地失败：', err);
          }
        })
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_qrcode()
    .then(r => {
      console.log(r.data, wx.arrayBufferToBase64(r.data))
      const src =  wx.arrayBufferToBase64(r.data)
      // this.setData({
      //   qrcode: src
      // })
      return this.base64_to_file(r.data)
    })
    .then(r1 => {
      this.draw_in_canvas(r1)
    })
    .catch(err => {
      
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