// components/price-ref/price-ref.js
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
    program_list:[],
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
  created() {
    this.get_pro_list()
  },
  pageLifetimes: {
    show: function() {
      const ismember = wx.getStorageSync('user').is_member===1
      this.setData({
        showmask:!ismember
      })
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    get_pro_list() {
      service('/API/GetMedicalItemType')
      .then(r => {
        const arr = r.data.data.map(i => {
          return {name:i}
        })
        this.setData({
          program_list:arr
        },()=>{
          this.checkitem()
        })
        
      })
    },
    //切换大类
    checkitem(e) {
      const index = e?e.currentTarget.dataset.index:0
      const pro = this.data.program_list[index]
      this.setData({
        activeType:pro.name
      })
      if(pro.children) {
        this.setData({
          subject_list:pro.children
        }) 
      } else {
        service('API/GetMedicalItemList',{Param:pro.name})
        .then(r => {
          const map = new Map() 
          r.data.data.map(i => {
            const a = i.item.split('-')
            //小类名
            const name = a[0]
            //医生title
            const title =a[1]
            if(map.has(name)) {
              map.get(name).push({...i,name,title})
            } else {
              map.set(name,[{...i,name,title}])
            }
          })
          const c_arr = []
          for (let [key, value] of map) {
            c_arr.push({name:key,children:value,isfold:true})
          }
          pro.children = c_arr
          this.setData({
            subject_list:c_arr,
            program_list:[...this.data.program_list]
          })
          
        })
      }
      
    },
    fold(e) {
      const list = [...this.data.subject_list]
      const index = e.currentTarget.dataset.index
      list[index].isfold = !list[index].isfold 
      this.setData({
        subject_list:list
      })
    },
    tologin() {
      wx.navigateTo({
        url: '/packageA/pages/member-center/member-center',
      })
      // if(wx.getStorageInfoSync('user').Token) {
        
      // } else {
      //   wx.navigateTo({
      //     url: '/packageA/pages/login/login',
      //   })
      // }
    }
  }
})
