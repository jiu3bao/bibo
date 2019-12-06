// components/news/news.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    newsList:{
      type:Array,
      value:[],
      observer: function(newVal, oldVal){ 
        if (!!!newVal.length) return
        const [first, ...another] = newVal
        this.setData({
          first: first,
          another: [...another]
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    first:{},
    another:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    todetail(e) {
      const id = e.currentTarget.dataset.id
      console.log(e)
      wx.navigateTo({
        url: '/pages/article-detail/article-detail?id=' + id,
      })
    },
  }
})
