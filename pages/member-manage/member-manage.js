// pages/member-manage/member-manage.js
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
    type: [{
      type: 0,
      name: '会员'
    },
    {
      type: 1,
      name: '合伙人/高级合伙人'
    }],
    now_at_type: 0,
    vipList:[],
    partnerList:[],
  },
  slide(e) {
    const type = this.data.type[e.detail.current].type
    this.change_type(null, type)
  },
  change_type(e, type) {
    const t = e ? e.target.dataset.type : type
    //没做切换直接return
    if (this.data.now_at_type === t) return
    this.setData({ now_at_type: t })
  },
  get_list(data) {
    return new Promise((resolve, reject) => {
      service('/GetMyMember', data)
        .then(r => {
          resolve(r)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  todetail(e) {
    const id = e.currentTarget.dataset.id
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/member-detail/member-detail?id='+id,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: item })
      }
    })
  },
  topartner_detail(e) {
    const id = e.currentTarget.dataset.id
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/partner-detail/partner-detail?id=' + id,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: item })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const data = {
      Token: wx.getStorageSync('user').Token
    }
    this.get_list(data)
      .then(r => {
        if (r.data.error_code) {
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        if (r.data.error_code !== 0) {
          wx.showToast({
            title: r.data.message,
            duration: 2000,
            icon: 'none'
          })
          return
        }
        let vip=[],partner=[]
        r.data.data.map(item => {
          item.default_head='../../img/default.png'
          if(item.type===2||item.type===3) {
            partner.push(item)
          }
          if (item.is_member === 0) {
            // if (item.type !== 2 && item.type !== 3) {
            //   item.notover = new Date(item.member_expire).getTime() > Date.now()
            //   vip.push(item)
            // }
          } else {
            item.notover = new Date(item.member_expire).getTime() > Date.now()
            vip.push(item)
          }
        })
        this.setData({
          vipList: vip,
          partnerList: partner
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