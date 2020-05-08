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

  }
})
