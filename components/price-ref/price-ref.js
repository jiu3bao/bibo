// components/price-ref/price-ref.js
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
    showmask:true,
    subject_list:[{
      name:'耳软骨鼻综合',
      isfold:false,
      subject_detail:[1,1]
    },{
      name:'耳软骨鼻综合1',
      isfold:false,
      subject_detail:[1,1]
    },{
      name:'耳软骨鼻综合2',
      isfold:false,
      subject_detail:[1,1]}]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    checkitem(e) {
      console.log(e)
      this.setData({
        activeType:e.currentTarget.dataset.item
      })
    },
    fold(e) {
      const list = [...this.data.subject_list]
      const index = e.currentTarget.dataset.index
      list[index].isfold = !list[index].isfold 
      this.setData({
        subject_list:list
      })
    }
  }
})
