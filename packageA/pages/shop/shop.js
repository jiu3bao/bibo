// packageA/pages/shop/shop.js
import service from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_list:[],
    page:1,
    code:''
  },
  get_list() {
    const data = {
      Page:this.data.page,
      PageSize:15,
      Token:wx.getStorageSync('user').Token
    }
    service('ShopAPI/GetMyShopGoods',data)
    .then(r => {
      this.setData({
        goods_list:r.data.data
      })
    })
  },
  input(e) {
    this.setData({
      code:e.detail.value
    })
  },
  getorder() {
    const data = {
      Token:wx.getStorageSync('user').Token,
      Param:this.data.code,
      Page:1,
      PageSize:5
    }
    service('ShopAPI/GetMyShopOrdersByCode',data)
    .then(r => {
      if(r.data.error_code==6) {
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
        return 
      }
      if(r.data.error_code!=0) {
        wx.showToast({
          title: r.data.message,
          icon:"none"
        })
        return 
      }
      //存订单号
    })
  },
  cofirm_code(id) {
    const data = {
      Token:wx.getStorageSync('user').Token,
      order_key:id,
      code:this.data.code
    }
    service('ShopAPI/CheckOrderCode',data)
    .then(r => {
      if(r.data.error_code==6) {
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
        return 
      }
      if(r.data.error_code!=0) {
        wx.showToast({
          title: r.data.message,
          icon:"none"
        })
        return 
      }
      wx.showToast({
        title: '核销成功',
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_list()
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