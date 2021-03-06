// pages/staff-page/staff-page.js
import service from '../../utils/api.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '登录', //导航栏 中间的标题
    },
    navbarHeight: app.globalData.navbarHeight,
    src_url: app.globalData.src_url,
    date:'',
    hos_list:[],
    hos:{},
    item_list:[],
    multiIndex:[],
    add_item: [{ item: '', item_type: '', price: 0, medical_code: '', ratio:''}],
    total_money:0,
    phone:'',
    pic:'',
    base_info:{},
    err_text:'',
    change_id:''
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
    service('/GetUserInfoByMobile',
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
          base_info:{...r.data.data,default_head:'../../img/default.png'},
          err_text:''
        })
        wx.showToast({
          title: '验证成功',
          duration: 3000
        })
      })
  },
  get_hos(aa) {
    service('/GetHospitals')
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
  get_item_list() {
    service('/GetMedicalItemList',{})
    .then(r => {
      const item_map = new Map()
      r.data.data.map(i => {
        if (item_map.has(i.item_type)) {
          const v = item_map.get(i.item_type)
          item_map.set(i.item_type,[...v,i])
        } else {
          item_map.set(i.item_type, [i])
        }
      })
      let arr1 = [],arr2=[],arr=[]
      item_map.forEach((v,k) => {
        arr1.push({item:k})
        arr2.push(v)
        arr.push({
          item:k,
          children:v
        })
      })
      console.log(arr1,arr2)
      this.setData({
        multiArray: [arr1, arr2[0]],
        item_list:arr
      })
    })
  },
  bindMultiPickerChange(e) {
    console.log(e)
    // if(e.detail.value[0]===)
    
    const item_index = e.currentTarget.dataset.index 
    const old = this.data.add_item
    const multiIndex = e.detail.value
    console.log(this.data.item_list[multiIndex[0]])
    const { item, item_type, medical_code, ratio,price} = { ...this.data.item_list[multiIndex[0]].children[multiIndex[1]]}
    old[item_index] = { ...old[item_index], item, item_type, medical_code, ratio,price}
    const t = old.reduce((total, curval) => total + parseFloat(curval.price), 0)
    this.setData({
      multiIndex: e.detail.value,
      add_item: old,
      total_money: t
    })
  },
  //二级联动
  bindMultiPickerColumnChange(e) {
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:  
        switch (data.multiIndex[0]) {         
          default:
            data.multiArray[1] = this.data.item_list[data.multiIndex[0]].children;
            this.setData({
              multiArray: data.multiArray
            })
            break;
        }
    }
  },
  cancel_picker(e) {
    this.setData({
      multiIndex:[]
    })
  },
  input_price(e) {
    const all_item = this.data.add_item
    const item = all_item[e.currentTarget.dataset.index]
    item.price = e.detail.value 
    this.setData({
      add_item: all_item
    })
  },
  add_a_item() {
    const old = this.data.add_item
    this.setData({
      add_item: [...old, { item: '', item_type: '', price: 0, medical_code: '', ratio: ''}]
    })
  },
  delete_a_item(e) {
    const old = this.data.add_item
    const index = e.currentTarget.dataset.index
    old.splice(index,1)
    const t = old.reduce((total, curval) => total + parseFloat(curval.price), 0)
    this.setData({
      add_item:old,
      total_money: t.toFixed(2)
    })
  },
  count_price() {
    const old = this.data.add_item
    const t = old.reduce((total, curval) => total + parseFloat(curval.price),0)
    this.setData({
      total_money:t.toFixed(2)
    })
  },

  chooseimage() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success(res) {
        console.log(res)
        that.setData({
          head_img: res.tempFilePaths
        })
        that.up_img(res.tempFilePaths)
          .then(r => {
            console.log(r)
            const i = that.data.info
            that.setData({
              pic: JSON.parse(r.data).file_url
            })
          })
          .catch(err => {
            wx.showToast({
              title: err,
              duration: 2000,
              icon: 'none'
            })
          })
      },
      fail(err) {
        wx.showToast({
          title: '选择图片失败',
          duration: 2000,
          icon: 'none'
        })
      }
    })
  },
  up_img(path) {
    console.log(path)
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: 'https://ym.bibo80s.com/Main/UploadFile',
        filePath: path[0],
        name: 'img',
        success(res) {
          resolve(res)
        },
        fail(err) {
          console.log(err)
          reject(err)
        }
      })
    })

  },
  submit() {
    if (!this.check()) return
    const data ={
      Token:wx.getStorageSync('user').Token,
      mobile:this.data.phone,
      hospital_id: this.data.hos.id,
      pic_url:this.data.pic,
      item:this.data.add_item,

    }
    service('/AddProRecord',data)
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
        service('/DeleteProRecord',data)
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
            add_item: [{ item: '', item_type: '', price: 0, medical_code: '', ratio: '' }],
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
      
      // this.setData({
      //   phone: '',
      //   hos: {},
      //   pic:'',
      //   add_item: [{ item: '', item_type: '', price: 0, medical_code: '', ratio: '' }],
      //   total_money:0,
      //   base_info:null
      // })
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
    } else if (!this.data.add_item[0].medical_code) {
      wx.showToast({
        title: '请选择项目',
        duration: 2000,
        icon: 'none'
      })
      return false
    } else if (!this.data.pic||this.data.pic.length===0) {
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
      url: '/pages/login/login',
    })
  },
  tofail(){
    wx.navigateTo({
      url: '/pages/fail-records/fail-records',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_item_list()
    if(options.item) {
      const item = JSON.parse(options.item)
      const {head,detail,id,item_list,mobile,name,pic_url,time,money,hospital,member_user_id} = item
      
      this.get_hos(hospital)
      console.log(item)
      
      this.setData({
        date:time,
        base_info:{head,default_head:'../../img/default.png',name,mobile,id:member_user_id},
        err_text:detail,
        add_item:item_list,
        total_money:money,
        pic:pic_url,
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