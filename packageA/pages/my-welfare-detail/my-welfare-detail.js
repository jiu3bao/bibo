import service from "../../../utils/api"

// pages/my-walfare-detail/my-walfare-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    showbtn:false
  },
  openmap() {
    wx.openLocation({
      latitude:this.data.info.lat,
      longitude: this.data.info.lng,
      name:this.data.info.shop_name,
      address:this.data.info.shop_address
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const item = options.item 
    this.setData({
      info:JSON.parse(item),
      showbtn:options.showbtn
    })
    // this.get_info(id)
  },
  get_info(id) {
    service('ShopAPI/GetShopGoodsDetail',{id:id})
    .then(r => {
      this.setData({
        info:r.data.data
      })
    })
  },
  hx() {
    if(this.data.info.status!=1) return
    const _this = this
    wx.showModal({
      title: '已和客户确认领取码',
      content: '确认核销？',
      success (res) {
        if (res.confirm) {
          const data = {
            Token:wx.getStorageSync('user').Token,
            order_key:_this.data.info.order_key,
            code:_this.data.info.code
          }
          service('ShopAPI/CheckOrderCode',data)
          .then(r => {
            if(r.data.error_code!==0) {
              wx.showToast({
                title: r.data.message,
                icon:'none'
              })
              return 
            }
            wx.showToast({
              title: '核销成功',
            })
            _this.setData({
              info:{..._this.data.info,status:2}
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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