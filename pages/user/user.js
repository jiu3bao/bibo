// pages/user/user.js
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
      route:'/packageA/pages/my-welfare/my-welfare'
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
      icon:'/img/shezhi.png'
    }],
  },
  route2(e) {
    console.log(e)
    wx.navigateTo({
      url: e.currentTarget.dataset.route,
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