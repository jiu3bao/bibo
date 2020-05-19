// pages/crous/crous.js
import service from '../../utils/api.js'
import {countDist} from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nearlist:[],
    countrylist:[]
  },
  todetail(e) {
    const itemid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/crous-detail/crous-detail?id='+itemid,
    })
  },
  get_list() {
    return  service('ShopAPI/GetPubicShopGoodsList',{Param:4,Page:1,PageSize:100})
    .then(r => {
      console.log(r)
      const list = r.data.data
      return list
    })
  },
  get_user_local() {
    return new Promise((resolve,reject) => {
      const _this = this;
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          resolve({
            lat:latitude,
            lng:longitude
          })
        },
        fail(e) {
          resolve({
            lat:0,
            lng:0
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const promise_all = [this.get_list(),this.get_user_local()]
    Promise.all(promise_all)
    .then(([list,loc]) => {
      console.log(list,loc)
      if(loc.lat ===0) {
        //用户拒绝授权
        this.setData({
          countrylist:list
        })
      } else {
        const near = []
        const country = []
        list.map(item => {
          if(item.lat===0&&item.lng===0) {
            country.push(item)
            return 
          }
          const dis = countDist(item.lat,item.lng,loc.lat,loc.lng)/1000
          console.log(dis)
          if(dis<=10) {
            item.distance = dis<1?(dis*1000).toFixed(2)+'m':dis.toFixed(2)+'km'
            near.push(item)
          } else {
            country.push(item)
          }
        })
        this.setData({
          nearlist:near,
          countrylist:country
        })
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