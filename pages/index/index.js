//index.js
//获取应用实例
import service from '../../utils/api.js'

const app = getApp()

Page({
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的主页', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    navbarHeight: app.globalData.navbarHeight,
    //
    bannerList:[],

    //
    articleType:[{
      type:0,
      name:'新闻'
    }, 
    {
      type: 3,
      name: '通知公告'
    }, 
    {
      type: 1,
      name: '微课堂'
    }],
    now_at_type:0
  },
  get_banner() {
    service('/GetBannersList',{}).then(r => {
      this.setData({
        bannerList:r.data.data
      },() => {
        
      })
    })
  },
  change_type(e) {
    if (this.data.now_at_type === e.target.dataset.type) return
    this.setData({now_at_type:e.target.dataset.type})

  },
  get_article(type) {
    service('/')
  },
  onLoad() {
    this.get_banner()
    // service('/RequestCheckToken',{Token:'123465'}).then(r => {

    // })
  },
  to() {
    wx.navigateTo({
      url: '/pages/next/next',
    })
  }
})
