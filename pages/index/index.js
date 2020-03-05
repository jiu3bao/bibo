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
    src_url: app.globalData.src_url,
    //
    bannerList:[],

    //
    articleType:[{
      type:0,
      name:'众诺动态'
    }, 
    {
      type: 3,
      name: '通知公告'
    }, 
    {
      type: 1,
      name: '微课堂'
    }],
    now_at_type:0,

    newsList:[],
    noticeList:[],
    classList:[],

    isAgent:false
  },
  get_banner() {
    service('/GetBannersList',{})
    .then(r => {
      this.setData({
        bannerList:r.data.data
      })
    })
    .catch(e => {
      wx.showToast({
        title: '网络错误',
        duration: 2000,
        icon: 'none'
      })
    })
  },
  todetail(e) {
    console.log(e.currentTarget.dataset)
    const item = e.currentTarget.dataset.item
    if (item.to_link.length>0) {
      console.log(item.to_link.split('?'))
      const id = item.to_link.split('?')[1]
      wx.navigateTo({
        url: '/pages/goods-detail/goods-detail?'+id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/class-detail/class-detail?id=' + item.id,
      })
    }
  },
  change_type(e,type) {
    const t = e?e.target.dataset.type:type
    //没做切换直接return
    if (this.data.now_at_type === t) return
    this.setData({now_at_type:t})
    //有数据则不再获取
    if (t === 0 && this.data.newsList.length!==0)return
    if (t === 3 && this.data.noticeList.length !== 0) return
    if (t === 1 && this.data.classList.length !== 0) return
    //获取数据
    this.get_article(t)
      .then(r => {
        if(t===0) {
          this.setData({
            newsList: r.data.data
          })
        } else if(t ===3) {
          this.setData({
            noticeList: r.data.data
          })
        } else if(t===1) {
          this.setData({
            classList: r.data.data
          })
        }
        
      })
      .catch(err => {
        wx.showToast({
          title: '网络错误',
          duration: 2000,
          icon: 'none'
        })
      })

  },
  slide(e) {
    const type = this.data.articleType[e.detail.current].type
    this.change_type(null,type)
  },
  get_article(type) {
    return new Promise((resolve,reject) => {
      const data = {
        page: 1,
        pageSize: 4,
        Param: type
      }
      service('/GetPublicArticlesList', data)
        .then(r => {
          resolve(r)
        })
        .catch(err => {
          reject(err)
        })
    })
    
  },
  to_more() {
    if(this.data.now_at_type===0) {
      wx.navigateTo({
        url: '/pages/more-news/more-news',
      })
    } else if (this.data.now_at_type === 3) {
      wx.navigateTo({
        url: '/pages/more-notice/more-notice',
      })
    } else if (this.data.now_at_type === 1) {
      wx.navigateTo({
        url: '/pages/more-class/more-class',
      })
    }
  },
  onLoad(options) {
    const scene = options.scene
    wx.setStorageSync('scene', scene)
    
    this.get_banner()
    this.get_article(this.data.now_at_type)
      .then(r => {
        this.setData({
          newsList: r.data.data
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
  onShow() {
    this.setData({
      // isAgent:true
      isAgent: wx.getStorageSync('user').type > 1
    })
  }
})
