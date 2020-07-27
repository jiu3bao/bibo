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
    timer:null,
    x:0
  },
  created() {
    this.get_list()
    // this.scrolling()
  },
  pageLifetimes:{
    show() {
      // this.restart()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    scrolling(e) {
      const timer = setInterval(() => {
        if(this.data.showbigpic) return 
        this.setData({
          left:this.data.left+1
        })
      },50)
      this.setData({
        timer
      })
    },
    stopscroll(e) {
      // if(e.target.dataset.src) {
      //   const url = e.target.dataset.src
      //   wx.previewImage({
      //     current:url,
      //     urls: [url],
      //   })
      // }
      // clearInterval(this.data.timer)
      // this.setData({
      //   timer:null
      // })
    },
    restart() {
      // if(this.data.timer) {
      //   clearInterval(this.data.timer)
      //   this.setData({
      //     timer:null
      //   },() => {
      //     this.scrolling()
      //   })
      // } else {
      //   this.scrolling()
      // }
      
    },
    recordx(e) {
      // if(this.data.timer) return 
      // console.log(e)
      // this.setData({
      //   left:e.detail.scrollLeft
      // })
    },
    backleft() {
      // if(this.data.timer) {
      //   this.setData({
      //     left:0
      //   })
      // }
      
    },
    get_list() {
      service('API/GetDoctorShow')
      .then(r => {
        this.setData({
          list:r.data.data
        })
      })
    },
    // catchtouch(e) {
    //   console.log(e)
    // },
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
    closeimg() {
      this.setData({
        showbigpic:false,
        imgsrc:''
      })
    }
  }
})
