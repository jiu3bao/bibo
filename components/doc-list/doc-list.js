import service from "../../utils/api"

// components/doc-list/doc-list.js
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
    showbigpic:false,
    imgsrc:'',
    left:0,
    timer:null
  },
  created() {
    this.get_list()
    this.scrolling()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    scrolling(e) {
      const timer = setInterval(() => {
        if(this.data.showbigpic) return 
        this.setData({
          left:this.data.left+10
        })
      },500)
      this.setData({
        timer
      })
    },
    backleft() {
      this.setData({
        left:0
      })
    },
    get_list() {
      service('API/GetDoctorShow')
      .then(r => {
        this.setData({
          list:r.data.data
        })
      })
    },
    openimg(e) {
      const url = e.currentTarget.dataset.src 
      this.setData({
        showbigpic:true,
        imgsrc:url
      })
    },
    closeimg() {
      this.setData({
        showbigpic:false,
        imgsrc:''
      })
    }
  }
})
