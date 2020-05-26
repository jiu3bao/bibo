// pages/apply-shop/apply-shop.js
import service from '../../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_name:'',
    shop_des:'',
    tel:'',
    lng:'',
    lat:'',
    address:'',
    add_name:'',
    main_pic:'',
    content_pic:[],
    showmask:false
  },
  openimg(e) {
    const type = e.currentTarget.dataset.type
    this.chooseimage(type)
  },
  chooseimage(type) {
    const that = this
    if(type=='main_pic') {
      wx.chooseImage({
        count:1,
        sizeType: ['compressed'],
        success(res) {
          that.up_img(res.tempFilePaths[0])
          .then(r => {
            console.log(r)
            that.setData({
              [type]: 'https://ym.bibo80s.com'+JSON.parse(r.data).file_url
            })
          })
          .catch(err => {
            wx.showToast({
              title: '网络错误',
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
    } else {
      wx.chooseImage({
        sizeType: ['compressed'],
        success(res) {
          res.tempFilePaths.map(p => {
            that.up_img(p)
            .then(r => {
              that.setData({
                content_pic: [...that.data.content_pic,'https://ym.bibo80s.com'+JSON.parse(r.data).file_url]
              })
            })
            .catch(err => {
              console.log(err)
              wx.showToast({
                title: '网络错误',
                duration: 2000,
                icon: 'none'
              })
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
    }
    
  },
  up_img(path) {
    return new Promise((resolve,reject) => {
      wx.uploadFile({
        url: 'https://ym.bibo80s.com/Main/UploadFile',
        filePath: path,
        name:'img',
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
  delete_pic(e) {
    const index = e.currentTarget.dataset.index 
    const arr = this.data.content_pic
    arr.splice(index,1)
    console.log(this.data.content_pic)
    this.setData({
      content_pic:[...arr]
    })
    
  },
  choseloc() {
    this.chose_user_local()
  },
  chose_user_local() {
    const _this = this;
      wx.chooseLocation({
        success(res) {
          console.log(res)
          const latitude = res.latitude
          const longitude = res.longitude
          _this.setData({
            lat:latitude,
            lng:longitude,
            address:res.address,
            add_name:res.name
          })
        },
        fail(e) {
          _this.setData({
            showmask:true
          })
        }
      })
  },
  close_mask() {
    this.setData({
      showmask:false
    })
  },
  bindKeyInput(e) {
    const type=e.currentTarget.dataset.type  
    const val = e.detail.value
    this.setData({
      [type]:val
    })
  },
  submit() {
    for(let key in this.data) {
      if(!this.data[key]||this.data[key].length===0) {
        wx.showToast({
          title: '请填写完整信息',
          icon:"none",
          duration:3000
        })
        return 
      }
    }
    const {shop_name,shop_des,lng,lat,tel,main_pic,content_pic} = {...this.data}
    const par = {
      shop_name,shop_des,lng,lat,tel,main_pic,content_pic,
      shop_address:this.data.address+this.data.add_name,
      Token:wx.getStorageSync('user').Token,

    }
    service('ShopAPI/SaveShop',par).then(r => {
      if(r.data.error_code===6) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      } else if(r.data.error_code===0) {
        wx.showToast({
          title: '提交成功',
        })
        wx.navigateBack()
      } else {
        wx.showToast({
          title: '发生错误',
          icon:'none'
        })
      }
    })
    .catch(err => {
      console.log(err)
      wx.showToast({
        title: '发生错误',
        icon:'none'
      })
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.close_mask()
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