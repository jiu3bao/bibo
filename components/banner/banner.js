// components/banner/banner.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bannerList:{
      type:Array,
      value:[],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    src_url:app.globalData.src_url
  },

  /**
   * 组件的方法列表
   */
  methods: {
    todetail(e) {
      const item = e.currentTarget.dataset.item
      if(item.to_link==1) {
        wx.navigateTo({
          url: '/packageA/pages/member-center/member-center',
        })
      }
    }
  }
})
