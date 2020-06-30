// components/chose-design/chose-design.js
import service from '../../utils/api'
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
    ],
    activeType:'眼部',
    subject_list:[1,1,1,1,1,1,1,1,1,1],
    showbigpic:false,
    imgsrc:''
  },
  created() {
    this.get_example()
  },  
  /**
   * 组件的方法列表
   */
  methods: {
    openimg(e) {
      const url = e.currentTarget.dataset.src 
      wx.previewImage({
        current:url,
        urls: [url],
      })
      // this.setData({
      //   showbigpic:true,
      //   imgsrc:url
      // })
    },
    // closeimg() {
    //   this.setData({
    //     showbigpic:false,
    //     imgsrc:''
    //   })
    // },
    checkitem(e) {
      this.setData({
        activeType:e.currentTarget.dataset.item.name,
        subject_list:e.currentTarget.dataset.item.list
      })
    },
    //获取案例
    get_example() {
      service('API/GetCaseShow')
      .then(r => {
        const mm = new Map()
        r.data.data.map(i => {
          if(mm.has(i.case_name)) {
            mm.get(i.case_name).push(i)
          } else {
            mm.set(i.case_name,[i])
          }  
        })
        const arr = []
        mm.forEach((val,key) => {
          arr.push({
            name:key,
            list:val
          })
        })
        this.setData({
          program_list:arr,
          activeType:arr[0].name,
          subject_list:arr[0].list
        })
      })
    },
  }
})
