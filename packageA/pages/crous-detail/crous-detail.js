// pages/crous-detail/crous-detail.js
import service from '../../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    dis:'',
    rules_list:[
      '借记卡哈萨克京哈双方均可获得首发'
    ,
      '数据恢复军事科技的回复'
    ,
      '时间都会发生口角的回复'
    ,
      '和我iu一日无恶意'
    ],
    showmap:false
  },
  openmap() {
    wx.openLocation({
      latitude:this.data.detail.lat,
      longitude: this.data.detail.lng,
      name:this.data.detail.shop_name,
      address:this.data.detail.shop_address
    })
    // this.setData({
    //   showmap:true,
    //   markers:[{
    //     id: 1,
    //     latitude: this.data.detail.lat,
    //     longitude: this.data.detail.lng,
    //   }]
    // })
  },
  get_detail(id) {
    service('ShopAPI/GetShopGoodsDetail',{id})
    .then(r => {
      if(r.data.data.lat===0&&r.data.data.lng===0) {
        
      }
      this.setData({
        detail:r.data.data
      })
    })
  },
  buygoods() {
    console.log(789789)
    if(wx.getStorageSync('user').Token) {
      //走订单逻辑
      wx.showLoading({mask:true})
      if(wx.getStorageSync('openid')){
        this.get_order_id()
        .then(res => {
          if(this.data.detail.price==0) {
            wx.hideLoading()
            wx.navigateTo({
              url: '/packageA/pages/get-success/get-success?code='+res.code,
            })
            return 
          }
          this.get_pay_param(res.order_id, wx.getStorageSync('openid'))
        })
        .catch(err => {
          wx.hideLoading()
          console.error(err)
          wx.showToast({
            title: err,
            icon:"none"
          })
        })
      }
    } else {
      wx.hideLoading()
      wx.navigateTo({
        url: '/packageA/pages/login/login',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function (data) {
            console.log(data)
          },
          someEvent: function (data) {
            console.log(data)
          }
        },
        success: (res) => {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', {canBack:true})
        }
      })
    }
    
  },
  get_order_id() {
    return new Promise((resolve,reject) => {
      const data = {
        Token: wx.getStorageSync('user').Token,
        goods_id: this.data.detail.id,
        name:wx.getStorageSync('user').name,
        mobile:wx.getStorageSync('user').mobile
      }
      service('ShopAPI/AddOrder_4', data)
        .then(r => {
          if (r.data.error_code === 6) {
            wx, wx.navigateTo({
              url: '/packageA/pages/login/login',
              events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                  console.log(data)
                },
                someEvent: function (data) {
                  console.log(data)
                }
              },
              success: (res) => {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {canBack:true})
              }
            })
            reject(r.data.message)
          }
          if (r.data.error_code !== 0) {
            wx.showToast({
              title: r.data.message,
              duration: 2000,
              icon: 'none'
            })
            reject(r.data.message)
          }
          resolve(r.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  get_pay_param(order_id,openid) {
    const data = {
      Token: wx.getStorageSync('user').Token,
      OrderID: order_id,
      OpenID:openid
    }
    service('API/GetWXXcxPayParam', data)
    .then(r => {
      if (r.data.error_code === 6) {
        wx, wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
        return
      }
      if (r.data.error_code !== 0) {
        console.log(r.data.message)
        return
      }
      wx.requestPayment({
        timeStamp: r.timestamp,
        nonceStr: r.nonceStr,
        package:  'prepay_id=' +r.prepay_id ,
        signType: r.signType,
        paySign: r.paySign,
        success() {
          wx.hideLoading({
            complete: () => {
              wx.showToast({
                title: '付款成功',
                duration:3000
              })
              wx.navigateTo({
                url: '/packageA/pages/get-success/get-success',
              })
            },
          })
        },
        fail() {
          wx.hideLoading({
            complete: (res) => {
              wx.showToast({
                title: res,
                duration: 2000,
                icon: 'none'
              })
            },
          }) 
        }
      })
    })
    .catch(err => {
      wx.hideLoading({
        complete: (res) => {
          wx.showToast({
            title: err,
            duration: 2000,
            icon: 'none'
          })
        },
      })
    })
    // return new Promise((resolve,reject) => {
      
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id  
    this.setData({
      dis:options.dis||''
    })
    this.get_detail(id)
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