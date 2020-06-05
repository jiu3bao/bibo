// components/user-head-info/user-head-info.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type:Number,
      value:1
    },
    info:{
      type:Object,
      value:{}
    },
    isshop:{
      type:Boolean,
      value:false
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
    toedit() {
      if(wx.getStorageSync('user').Token) {
        wx.navigateTo({
          url: '/packageA/pages/user-info/user-info'
        })
      } else {
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
      }
     
    }
  }
})
