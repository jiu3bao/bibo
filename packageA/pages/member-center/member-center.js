// pages/member-center/member-center.js
import service from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    has_read:false
  },
  read() {
    this.setData({
      has_read:!this.data.has_read
    })
  },
  tocontract() {
    wx.navigateTo({
      url: '/packageA/pages/contract/contract',
    })
  },
  tobuy() {
    if(!this.data.has_read) {
      wx.showToast({
        title: '请阅读并勾选用户协议',
        icon:'none'
      })
      return 
    }
    if(!wx.getStorageSync('user').Token) {
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
      return 
    }
    wx.showLoading({mask:true})
    if(wx.getStorageSync('openid')){
      // wx.showToast({
      //   title: 'start',
      // })
      this.get_order_id()
      .then(res => {
        // wx.showToast({
        //   title: 'getorderid',
        // })
        return this.get_pay_param(res, wx.getStorageSync('openid'))
      })
      .then(r => {
        // wx.showToast({
        //   title: r.prepay_id,
        // })
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
                wx.switchTab({
                  url: '/pages/user/user',
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
    } else {
      wx.showToast({
        title: '无openid',
      })
    }
  },
  get_order_id() {
    return new Promise((resolve,reject) => {
      const data = {
        Token: wx.getStorageSync('user').Token,
        goods_id: 1
      }
      service('API/CreateOrder', data)
        .then(r => {
          if (r.data.error_code === 6) {
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
    return new Promise((resolve,reject) => {
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
          resolve(r.data.data)
        })
        .catch(err => {
          reject(err)
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