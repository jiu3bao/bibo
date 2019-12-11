// components/class/class.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    classList: {
      type: Array,
      value: [],
      observer: function (newv, oldv) {
        console.log(newv)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    src_url: app.globalData.src_url,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    todetail(e) {
      const id = e.currentTarget.dataset.id
      console.log(e)
      wx.navigateTo({
        url: '/pages/class-detail/class-detail?id=' + id,
      })
    },
  }
})
