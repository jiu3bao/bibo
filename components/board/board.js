import service from "../../utils/api"

// components/board/board.js
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
    list:[],
  },
  created() {
    this.get_list()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    get_list() {
      service('API/GetSubsidy')
      .then(r => {
        this.setData({
          list:r.data.data
        })
      })
    }

  }
})
