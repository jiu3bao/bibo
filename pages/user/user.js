// pages/user/user.js
import service from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[{
      name:'我的整形',
      icon:'/img/meirong.png',
      route:'/packageA/pages/my-shaping/my-shaping'
    },{
      name:'我的二维码',
      icon:'/img/weibiaoti---2.png',
      route:'aaa'
    },{
      name:'我的福利',
      icon:'/img/shouye-10.png',
      route:'/packageA/pages/my-welfare/my-welfare'
    },{
      name:'关于我们',
      icon:'/img/shouye-12.png',
      route:'/packageA/pages/about-us/about-us'
    },
    {
      name:'设置',
      icon:'/img/shezhi.png',
      route:'/packageA/pages/set-sys/set-sys'
    },
    {
      name:'我的店铺',
      icon:'/img/shezhi.png',
      route:'/packageA/pages/shop/shop'
    }],
    info:{},
    isshop:false,
    moneyInfo:{},
    showqrcode:false
  },
  //导航到二级页面
  route2(e) {
    if(wx.getStorageSync('user').Token) {
      if(e.currentTarget.dataset.route=='aaa') {
        this.setData({
          showqrcode:true
        })
      } else {
        wx.navigateTo({
          url: e.currentTarget.dataset.route,
        })
      }
      
    } else {
      wx.navigateTo({
        url: '/packageA/pages/login/login',
      })      
    }
    
  },
  //获取商铺信息
  get_my_shop() {
    service('ShopAPI/GetMyShop',{Token:wx.getStorageSync('user').Token})
    .then(r => {
      if(r.data.error_code==6) {
        wx.removeStorageSync('user')
        wx.removeStorageSync('shopinfo')
        return 
      }
      if(r.data.data.id) { //有商铺
        this.setData({
          isshop:true
        })
      }
    })
  },
  //获取钱
  get_money_info() {
    service('API/StcBonus', { Token: wx.getStorageSync('user').Token})
      .then(r => {
        if (r.data.error_code === 6) {
          this.setData({
            // baseInfo: { default_head:'../../img/default.png'},
            moneyInfo:{}
          })
          // wx.navigateTo({
          //   url: '/pages/login/login',
          // })
          return 
        }
        if (r.data.error_code !== 0) {
          wx.showToast({
            title: r.data.message,
            duration: 2000,
            icon: 'none'
          })
          return
        }
        r.data.data.total = (r.data.data.xf + r.data.data.fx + r.data.data.zs).toFixed(2)
        this.setData({
          moneyInfo: r.data.data
        })
      })
      .catch(r => {
        wx.showToast({
          title: err,
          duration: 2000,
          icon: 'none'
        })
      })
  },
  applyed() {
    this.get_money_info()
  },
  get_user_info() {
    service('/API/GetUserInfo',{Token:wx.getStorageSync('user').Token})
    .then(r => {
      this.setData({
        info:{...r.data.data,Token:wx.getStorageSync('user').Token}
      },
      () => {
        wx.setStorageSync('user', this.data.info)
      })
    })
  },
  //关闭二维码
  closecode() {
    console.log(123)
    this.setData({
      showqrcode:false
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
    this.get_user_info()
    this.get_my_shop()
    this.get_money_info()
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