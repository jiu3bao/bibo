// components/extend-info/extend-info.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    money:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    todetail() {
      if(!wx.getStorageSync('user').Token) {
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
        return 
      }
      wx.navigateTo({
        url: '/packageA/pages/flow-detail/flow-detail',
      })
    },
  }
})
