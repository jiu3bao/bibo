// pages/member-detail/member-detail.js
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
    img_root: app.globalData.src_url,
    list: [],
    id: '',
    info: {},
    money: 0,
    page: 1,
    pagesize: 10,
    islastpage: false
  },
  get_list() {
    const data = {
      Page: this.data.page,
      PageSize: this.data.pagesize,
      Token: wx.getStorageSync('user').Token,
      id: this.data.id
    }
    service('/GetMemberBonusList', data)
      .then(r => {
        r.data.data.list.map(i => {
          if(i.order_type=="2"){
            i.type='合伙人'
          } else if (i.order_type == "3") {
            i.type='高级代理'
          }
        })
        this.setData({
          list: [...this.data.list, ...r.data.data.list],
          money: r.data.data.sum_bonus
        })
        if (r.data.data.list.length === 0) {
          this.setData({
            islastpage: true
          })
        }
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
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      this.setData({
        info: data.data
      })
    })
    this.setData({
      id: options.id
    }, () => {
      this.get_list()
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
    if (this.data.islastpage) return
    this.setData({
      page: this.data.page + 1
    }, () => {
      this.get_list()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})