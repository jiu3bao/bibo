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
    src_url: app.globalData.src_url,
    completed:true,
    fnList:[{
      name:'我的钱包',
      img:'../../img/qianbao@2x.png',
      auth:1,
      redirect:'/pages/wallet/wallet'
    }, {
        name: '我的推广码',
        img: '../../img/tuiguangma@2x.png',
        auth: 1,
        redirect: '/pages/qrcode/qrcode'
      },{
        name: '推广中心',
        img: '../../img/tuiguangrenwu@2x.png',
        auth: 1,
        redirect:'/pages/extension-service/extension-service'
      }, {
        name: '微课培训',
        img: '../../img/weike@2x.png',
        auth: 0,
        redirect:'/pages/more-class/more-class'
      }, {
        name: '我的消费',
        img: '../../img/xiaofei@2x.png',
        auth: 1,
        redirect: "/pages/my-pay-detail/my-pay-detail"

      }, {
        name: '会员管理',
        img: '../../img/guanli@2x.png',
        auth: 0,
        redirect: "/pages/member-manage/member-manage"

      }, {
        name: '联系我们',
        img: '../../img/lianxi@2x.png',
        auth: 1,
        redirect:'/pages/connect/connect'
      } , {
        name: '设置',
        img: '../../img/shezhi@2x.png',
        auth: 1,
        redirect: '/pages/system-set/system-set'
      }],
    baseInfo:{},
    moneyInfo:{}
  },
  toset() {
    if (wx.getStorageSync('user') && wx.getStorageSync('user').Token) {
      wx.navigateTo({
        url: '/pages/set-user-info/set-user-info',
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
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: this.data.baseInfo })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '交费注册成为会员或合伙人后，即可使用',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/join-partner/join-partner',
            })
            // wx.navigateTo({
            //   url: '/pages/login/login',
            //   events: {
            //     // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            //     acceptDataFromOpenedPage: function (data) {
            //       console.log(data)
            //     },
            //     someEvent: function (data) {
            //       console.log(data)
            //     }
            //   },
            //   success: (res) => {
            //     // 通过eventChannel向被打开页面传送数据
            //     res.eventChannel.emit('acceptDataFromOpenerPage', { canBack: true })
            //   }
            // })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    
  },
  redirect(e) {
    if (wx.getStorageSync('user') && wx.getStorageSync('user').Token && (wx.getStorageSync('user').is_member>0||type>0)) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
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
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: this.data.moneyInfo })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '交费注册成为会员或合伙人后，即可使用',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/join-partner/join-partner',
            })
            // wx.navigateTo({
            //   url: '/pages/login/login',
            //   events: {
            //     // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            //     acceptDataFromOpenedPage: function (data) {
            //       console.log(data)
            //     },
            //     someEvent: function (data) {
            //       console.log(data)
            //     }
            //   },
            //   success: (res) => {
            //     // 通过eventChannel向被打开页面传送数据
            //     res.eventChannel.emit('acceptDataFromOpenerPage', { canBack: true })
            //   }
            // })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    
  },
  get_base_info() {
    service('/GetUserInfo', { Token:wx.getStorageSync('user').Token})
      .then(r => {
        if (r.data.error_code===6) {
          // wx.navigateTo({
          //   url: '/pages/login/login',
          // })
          this.setData({
            baseInfo: { default_head: '../../img/default.png' }
          })
          return 
        } 
        if (r.data.error_code !==0) {
          reject(r.data.message)
          return 
        }
        r.data.data.notover = new Date(r.data.data.member_expire.replace(' ', 'T')).getTime()>Date.now()
        const {name,head,sex,birthday,sfzh,wx} = r.data.data
        console.log({ ...r.data.data, default_head: '../../img/default.png'})
        this.setData({
          baseInfo: { ...r.data.data, default_head: '../../img/default.png'},
          completed:name.length>0&&head.length>0&&sex.length>0&&birthday.length>0&&sfzh.length>0&&wx.length>0
        })
      })
      .catch(err=> {
        wx.showToast({
          title: err,
          duration: 2000,
          icon: 'none'
        })
      })
  },
  get_money_info() {
    service('/StcBonus', { Token: wx.getStorageSync('user').Token})
      .then(r => {
        if (r.data.error_code === 6) {
          this.setData({
            // baseInfo: { default_head:'../../img/default.png'},
            moneyInfo:{}
          })
          // wx.navigateTo({
          //   url: '/pages/login/login',
          // })
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
        r.data.data.total = r.data.data.xf + r.data.data.fx + r.data.data.zs
        this.setData({
          moneyInfo: r.data.data
        })
      })
      .catch(r => {
        wx.showToast({
          title: err,
          duration: 2000,
          icon: 'none'
        })
      })
  },
  tologin() {
    wx.navigateTo({
      url: '/pages/login/login',
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
        res.eventChannel.emit('acceptDataFromOpenerPage', { canBack: true })
      }
    })
  },
  errImg() {
    // this.setData({
    //   baseInfo: { ...this.data.baseInfo, default_head:'../../img/default.png'}
    // })    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.get_base_info()
    this.get_money_info()
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