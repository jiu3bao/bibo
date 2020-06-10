// accompany/pages/set-design/set-design.js
import service from '../../../utils/api'
import {toChinesNum} from '../../../utils/util'
import {returnimg} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    program_list:[
    ],
    activeType:'',
    subject_list:[],
    isfold:true,
    info:{},
    casei:{},
    chosen_item:null,
    chosen_item_list:[],
    img_list:[],
    inputother:false,
    item_name:'',
    price_hospital:'',
    subsidy:'',
    price_real:'',
    recover_time:''
  },
  input(e) {
    const value = e.detail.value 
    const type= e.currentTarget.dataset.type
    this.setData({
      [type]: value
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
    let arr_i = 1;
    let inputother= false
    for (let [key, value] of map) {
      if(key==145) {
        inputother=true
      } else {
        value.index = toChinesNum(arr_i) 
        l.push(value)
        arr_i++
      } 
    }
    this.setData({
      chosen_item:map,
      chosen_item_list:l,
      inputother
    })
  },
  //上传图片
  addimg() {
    returnimg(5)
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
    const item_list = this.data.chosen_item_list.map(i => {
      return {
        item_name:i.item,
        price_hospital:i.price,//医院价格
        subsidy:i.price*(1-i.ratio),//补贴价格
        price_real:i.price*i.ratio//实际价格
      }
    })
    if(this.data.inputother&&this.data.item_name.length!==0) {
      item_list.push({
        item_name:this.data.item_name,
        price_hospital:this.data.price_hospital||0,
        subsidy:this.data.subsidy||0,
        price_real:this.data.price_real||0
      })
    }
    if(item_list.length==0) {
      wx.showToast({
        title: '请至少选择或填写一个项目',
        icon:'none'
      })
      return 
    }
    if(this.data.recover_time.length==0) {
      wx.showToast({
        title: '请填写恢复期',
        icon:'none'
      })
      return 
    }
    const data  = {
      custom_case_id:this.data.casei.custom_case_id,
      item_list,
      pic:this.data.img_list[0],
      pic45:this.data.img_list[1],
      pic90:this.data.img_list[2],
      pic45r:this.data.img_list[3],
      pict:this.data.img_list[4],
      recover_time:this.data.recover_time,
      Token:wx.getStorageSync('user').Token
    }
    console.log(data)
    service('ConsultAPI/SubmitCustomCaseSolution',data)
    .then(r => {
      wx.showToast({
        title: '提交成功',
        icon:"none"
      })
      wx.navigateBack()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_pro_list()
    const casei = JSON.parse(options.casei) 
    const info = {head:casei.head,name:casei.name,wx:casei.wx,ismember:casei.ismember,id:casei.zxs_id}
    this.setData({
      casei:casei,
      info:info
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
    wx.hideHomeButton({
      success() {
        
      }
    })
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