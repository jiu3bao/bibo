// components/class/class.js
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
