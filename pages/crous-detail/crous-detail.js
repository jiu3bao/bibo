// pages/crous-detail/crous-detail.js
import service from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    rules_list:[
      '借记卡哈萨克京哈双方均可获得首发'
    ,
      '数据恢复军事科技的回复'
    ,
      '时间都会发生口角的回复'
    ,
      '和我iu一日无恶意'
    ],
  },
  get_detail(id) {
    service('ShopAPI/GetShopGoodsDetail',{id})
    .then(r => {
      this.setData({
        detail:r.data.data
      })
    })
  },
  buygoods() {
    if(wx.getStorageSync('user')) {
      //走订单逻辑
      wx.navigateTo({
        url: '/pages/get-success/get-success',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id  
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