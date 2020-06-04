// accompany/components/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    nowtab:{type:Number,value:1}
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
    nav(e) {
      const type = e.currentTarget.dataset.type 
      if(type===this.properties.nowtab) return 
      const url=['/accompany/pages/my-vip/my-vip','/accompany/pages/my-order-list/my-order-list','/accompany/pages/user-center/user-center']
      wx.reLaunch({
        url: url[type-1],
      })
    }
  }
})
