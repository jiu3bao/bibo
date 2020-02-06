// pages/article-detail/article-detail.js
import service from '../../utils/api.js'
const app = getApp()

var WxParse = require('../../wxParse/wxParse.js');

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
    id:'',
    detail: {},
    pic: '',
    video_list:[],
    img_list:[],
    isdone:'notdone'

  },
  get_detail(id) {
    service('/GetMissonDetail', { id: id,Token:wx.getStorageSync('user').Token })
      .then(r => {
        var that = this;
        const html = that.htmlEscape(r.data.data.detail)
        const videoReg = /<video.*?(?:>|\/>)/gi
        const video = r.data.data.detail.match(videoReg)
        const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        const imgReg = /<img.*?(?:>|\/>)/gi
        const img = r.data.data.detail.match(imgReg)
        const video_list = video?video.map(i => i.match(srcReg)):[]
        const img_list = img?img.map(i => i.match(srcReg)):[]
        this.setData({
          video_list: video_list,
          img_list: img_list,
          pic: r.data.data.misson_pic_url
        })
        this.setData({
          detail: r.data.data
        })
        WxParse.wxParse('article', 'html', html, that, 5);
      })
      .catch(err => {
        wx.showToast({
          title: err,
          duration: 2000,
          icon: 'none'
        })
      })
  },
  htmlEscape(html) {
    const reg = /(&lt;)|(&gt;)|(&amp;)|(&quot;)|(&nbsp;)|(src=\")|(src=\')/g;
    return html.replace(reg, function (match) {
      switch (match) {
        case "&lt;":
          return "<";
        case "&gt;":
          return ">";
        case "&amp;":
          return "&";
        case "&nbsp;":
          return " ";
        case "&quot;":
          return "\"";
        case "src=\"":
          return "src=\"" + app.globalData.src_url;
        case "src=\'":
          return "src=\'" + app.globalData.src_url;
      }
    });
  },
  save_video() {
     
    function wxsave(path) {
      return new Promise((resolve,reject) => {
        wx.saveVideoToPhotosAlbum({
          filePath: path,
          success() { resolve()},
          fail(e) { reject(e)}
        })
      })
    }
    const promisarr = this.data.video_list.map(i => {
      this.downloadVideo(this.data.img_root + i[1])
      .then(path => {
        return wxsave(path)
      })
      .catch(e =>{
        console.log(e)
      })   
    })
    Promise.all(promisarr)
    .then(r => {
      console.log('chengg')
    })
    .catch(e => {
      console.log(e)
    })
  },
  save_img() {
    if(this.data.img_list.length === 0 && this.data.video_list.length===0) return
    function wxsave(path) {
      return new Promise((resolve, reject) => {
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success() { resolve() },
          fail(e) { reject(e) }
        })
      })
    }
    let imgarr =[],videoarr=[]
    if (this.data.img_list.length !== 0) {
      imgarr = this.data.img_list.map(i => {
        this.downloadImg(this.data.img_root + i[1])
          .then(path => {
            return wxsave(path)
          })
          .catch(e => {
            console.log(e)
          })
      })
    } 
    if (this.data.video_list.length!==0) {
      videoarr = this.data.video_list.map(i => {
        this.downloadVideo(this.data.img_root + i[1])
        .then(path => {
          return wxsave(path)
        })
        .catch(e =>{
          console.log(e)
        })   
      })
      
    } 
    Promise.all([...imgarr,...videoarr])
      .then(r => {
        wx.showToast({
          title: '保存成功',
        })
      })
      .catch(e => {
        wx.showToast({
          title: e,
          icon:'none'
        })
      })
  },
  downloadVideo(path) {
    return new Promise((resolve,reject) => {
      wx.downloadFile({
        url:path,
        success(res) {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath)
          } else {
            reject(res)
          }
        },
        fail(e) {
          reject(e)
        }
      })
    })
  },
  downloadImg(path) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: path,    //请求的网络图片路径
        success(res) {
          resolve(res.path)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  chooseimage() {
    if(this.data.isdone==='done') return 
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success(res) {
        that.up_img(res.tempFilePaths)
          .then(r => {
            const i = that.data.info
            that.setData({
              pic: JSON.parse(r.data).file_url
            })
            return that.update(JSON.parse(r.data).file_url)
          })
          .then(r1 => {
            if (r1.data.error_code===6) {
              wx.navigateTo({
                url:'/pages/login/login'
              })
              return 
            }
            if (r1.data.error_code !==0) {
              wx.showToast({
                title:r.data.message,
                icon:'none',
                duration:3000
              })
              return
            }
            wx.showToast({
              title:'任务状态已更新',
              icon:'none',
              duration:2000
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
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: 'https://ym.bibo80s.com/Main/UploadFile',
        filePath: path[0],
        name: 'img',
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
  update(path) {
    return new Promise((resolve,reject) =>{
      const data = {
        Token:wx.getStorageSync('user').Token,
        articles_id:this.data.id,
        pic_url:path
      }
      service('/SaveMissonRecord',data)
      .then(r => {
        if(r.data.error_code===0) {
          resolve(r)
        } else if (r.data.error_code===6){
          wx.navigateTo({
            url:'pages/login/login'
          })
          reject(r.data.message)
        } else {
          reject(r.data.message)
        }
        
      })
      .catch(err =>{
        reject(err)
      })
    })
  },
  errImg() {
    this.setData({
      pic:'../../img/add.png'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      isdone:options.isdone
    })
    this.get_detail(options.id)
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