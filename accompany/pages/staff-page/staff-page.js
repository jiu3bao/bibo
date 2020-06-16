// pages/staff-page/staff-page.js
import service from '../../../utils/api.js'
import {returnimg} from '../../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    date:'',
    hos_list:[],
    hos:{},
    index:0,
    program_list:[
    ],
    activeType:'',
    subject_list:[],
    isfold:true,
    casei:{},
    chosen_item:null,
    chosen_item_list:[],
    inputother:false,
    total_money:0,
    img_list:[],
    base_info:{},
    price:0,
    item_name:'',
    err_text:'',
    change_id:''
  },
  input(e) {
    const value = e.detail.value 
    const type= e.currentTarget.dataset.type
    this.setData({
      [type]: value
    })
  },
  addprice() {
    const t = this.data.total_money*1+this.data.price*1
    this.setData({
      total_money:t.toFixed(2)
    })
  },
  set_time(e) {
    this.setData({
      date: e.detail.value
    })
  },
  set_phone(e) {
    this.setData({
      phone:e.detail.value
    })
  },
  confiry_phone() {
    service('API/GetUserInfoByMobile',
      { mobile:this.data.phone})
      .then(r => {
        if(r.data.error_code !==0) {
          this.setData({
            base_info: null,
            err_text:r.data.message
          })
          return 
        }
        if(r.data.data.is_member===0) {
          this.setData({
            base_info: null,
            err_text:'非会员'
          })
          return 
        }
        this.setData({
          base_info:{...r.data.data,default_head:'/img/default.png'},
          err_text:''
        })
        wx.showToast({
          title: '验证成功',
          duration: 3000
        })
      })
  },
  get_hos(aa) {
    service('API/GetHospitals')
    .then(r => {
      this.setData({
        hos_list:r.data.data
      })
      if(aa) {
        const chosed = r.data.data.filter(h => h.hospital = aa)
        this.setData({
          hos:chosed[0]
        })
      }
    })
  },
  chose_hos(e) {
    this.setData({
      hos: this.data.hos_list[e.detail.value]
    })
  },
  //折叠与否
  foldlist() {
    this.setData({
      isfold:!this.data.isfold
    })
  },
  //获取整形大类
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
    if(this.data.activeType == pro.name) {
      this.foldlist()
    }
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
        r.data.data.map(i => {
          i.ischeck = false
        })
        pro.children = r.data.data
        console.log(this.data.program_list)
        this.setData({
          subject_list:[...r.data.data],
          program_list:[...this.data.program_list]
        })
        
      })
    }
    
  },
  //选择小类
  choseitem(e) {
    if(!this.data.base_info.id) return 
    const i = e.currentTarget.dataset.index
    const arr = this.data.subject_list
    arr[i].ischeck = !arr[i].ischeck
    this.setData({
      subject_list:[...arr]
    })
    let map;
    if(!this.data.chosen_item) {
      map = new Map()
    } else {
      map = this.data.chosen_item
    }
    
    if(arr[i].ischeck) {
      map.set(arr[i].medical_code,arr[i])
    } else {
      map.delete(arr[i].medical_code)
    }
    const l = [];
    let count=0
    let inputother= false
    for (let [key, value] of map) {
      if(key==145) {
        inputother=true
        count+=this.data.price*1
      } else {
        l.push({
          item:value.item,
          item_type:value.item_type,
          price:value.price,
          medical_code:value.medical_code,
          ratio:value.ratio
        })
        count+=value.price*1
      }
      
    }
    this.setData({
      chosen_item:map,
      chosen_item_list:l,
      total_money:count.toFixed(2),
      inputother
    })
  },
  //上传图片
  addimg() {
    if(!this.data.base_info.id) return 
    returnimg(1)
    .then(r => {
      this.setData({
        img_list:[...r]
      })
    })
    .catch(err => {
      console.log(err)
    })
  },
  submit() {
    if (!this.check()) return
    const l = this.data.chosen_item_list
    if(this.data.inputother) {
      l.push({
        item:this.data.item_name,
        item_type:'其他',
        price:this.data.price,
        medical_code:145,
        ratio:''
      })
    }
    const data ={
      Token:wx.getStorageSync('user').Token,
      mobile:this.data.phone,
      hospital_id: this.data.hos.id,
      pic_url:this.data.img_list[0],
      item:l,
    }
    service('API/AddProRecord',data)
    .then(r => {
      if(r.data.error_code!==0) {
        wx.showToast({
          title: r.data.message,
          icon:'none',
          duration:3000
        })
        return 
      }
      if(this.data.change_id>0) {
        const data = {
          Token:wx.getStorageSync('user').Token,
          id:this.data.change_id,
        }
        console.log(data,123123)
        service('API/DeleteProRecord',data)
        .then(r1 => {
          wx.showToast({
            title: '上传成功',
            icon: 'none',
            duration: 3000
          })
          wx.navigateBack()
          this.setData({
            phone: '',
            hos: {},
            pic:'',
            total_money:0,
            base_info:null
          })
        })
        .catch(err => {
          wx.showToast({
            title: err,
            icon:'none'
          })
        })
      } else {
        wx.showToast({
          title: '上传成功',
          icon: 'none',
          duration: 3000
        })
        wx.navigateBack()
      }
    })
    .catch(err => {
      wx.showToast({
        title: err,
        icon:'none'
      })
      
    })
  },
  check() {
    if(!this.data.base_info.id) {
      wx.showToast({
        title: '请验证手机号',
        duration: 2000,
        icon: 'none'
      })
      return false
    } else if (this.data.phone.length !==11) {
      wx.showToast({
        title: '请输入手机号',
        duration: 2000,
        icon: 'none'
      })
      return false
    } else if (!this.data.hos.id) {
      wx.showToast({
        title: '请选择医院',
        duration: 2000,
        icon: 'none'
      })
      return false
    } else if (!this.data.chosen_item_list[0].medical_code) {
      wx.showToast({
        title: '请选择项目',
        duration: 2000,
        icon: 'none'
      })
      return false
    } else if (!this.data.img_list||this.data.img_list.length===0) {
      wx.showToast({
        title: '请上传证据图',
        duration: 2000,
        icon: 'none'
      })
      return false
    }else {
      return true
    }
  },
  tologin() {
    wx.navigateTo({
      url: '/packageA/pages/login/login',
    })
  },
  tofail(){
    wx.navigateTo({
      url: '/accompany/pages/fail-records/fail-records',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_pro_list()
    if(options.item) {
      const item = JSON.parse(options.item)
      const {head,detail,id,item_list,mobile,name,pic_url,time,money,hospital,member_user_id} = item
      
      this.get_hos(hospital)
      console.log(item)
      
      this.setData({
        date:time,
        base_info:{head,default_head:'../../img/default.png',name,mobile,id:member_user_id},
        err_text:detail,
        total_money:money,
        change_id:id,
        phone:mobile,
      })
      return 
    }
    this.get_hos()
    
    const today = new Date()
    this.setData({
      date:today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})