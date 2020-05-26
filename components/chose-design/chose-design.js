// components/chose-design/chose-design.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    program_list:[
      '眼部',
      '鼻部',
      '胸部',
      '脂肪',
      '其他'
    ],
    activeType:'眼部',
    subject_list:[1,1,1,1,1,1,1,1,1,1]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkitem(e) {
      this.setData({
        activeType:e.currentTarget.dataset.item
      })
    }
  }
})
