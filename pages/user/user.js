// pages/user/user.js
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
    fnList:[{
      name:'我的钱包',
      img:'',
      auth:1
    }, {
        name: '推广任务',
        img: '',
        auth: 1
      }, {
        name: '微课培训',
        img: '',
        auth: 0
      }, {
        name: '我的消费',
        img: '',
        auth: 1
      }, {
        name: '会员管理',
        img: '',
        auth: 0
      }, {
        name: '联系我们',
        img: '',
        auth: 1
      }],
    baseInfo:{},
    moneyInfo:{}
  },
  toset() {
    wx.navigateTo({
      url: '/pages/set-user-info/set-user-info',
    })
  },
  get_base_info() {
    service('/GetUserInfo', { Token:wx.getStorageSync('user').Token})
      .then(r => {
        if (r.data.error_code===6) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } 
        if (r.data.error_code !==0) {
          console.log(r.data.message)
          return 
        }
        this.setData({
          baseInfo:r.data.data
        })
      })
      .catch(err=> {

      })
  },
  get_money_info() {
    service('/StcBonus', { Token: wx.getStorageSync('user').Token})
      .then(r => {
        if (r.data.error_code === 6) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
        if (r.data.error_code !== 0) {
          console.log(r.data.message)
          return
        }
        r.data.data.total = r.data.data.xf + r.data.data.fx + r.data.data.zs
        this.setData({
          moneyInfo: r.data.data
        })
      })
      .catch(r => {

      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_base_info()
    this.get_money_info()
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