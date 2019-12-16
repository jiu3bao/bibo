// components/notice/notice.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    noticeList:{
      type:Array,
      value:[],
      observer:function(newv,oldv) {
        console.log(newv)
        if (newv === oldv) return
        this.setData({
          notice:newv
        })
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

  }
})
