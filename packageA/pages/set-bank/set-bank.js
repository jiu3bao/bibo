// pages/set-bank/set-bank.js
import service from '../../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bank_name:'',
    bank_card:'',
    account_name:'',
    all_bank: ['中国工商银行', '招商银行', '中国农业银行', '中国建设银行', '中国银行', '中国民生银行', '中国光大银行', '中信银行', '交通银行', '兴业银行', '上海浦东发展银行', '中国人民银行', '华夏银行', '深圳发展银行', '广东发展银行', '国家开发银行  ', '中国邮政储蓄银行', '中国进出口银行', '中国农业发展银行']//, '中国银行香港分行', '北京银行', '北京农村商业银行', '  天津银行 ', '上海银行', '上海农村商业银行', '南京银行', '宁波银行', '杭州市商业银行', '深圳平安银行', '深圳农村商业银行', '温州银行', '厦门国际银行', '济南市商业银行', '重庆银行', '哈尔滨银行', '成都市商业银行', '包头市商业银行', '南昌市商业银行', '贵阳商业银行', '兰州市商业银行', '常熟农村商业银行', '青岛市商业银行','徽商银行']
  },
  chose_bank(e) {
    this.setData({
      bank_name: this.data.all_bank[e.detail.value]
    })
  },
  input(e) {
    const type = e.currentTarget.dataset.type
    const val = e.detail.value
    console.log(type,val)
    this.setData({
      [type]:val
    })
  },
  save() {
    const data = {
      Token:wx.getStorageSync('user').Token,
      bank_name: this.data.bank_name,
      bank_card: this.data.bank_card,
      account_name: this.data.account_name
    }
    service('API/SetUserBank',data)
    .then(r => {
      if (r.data.error_code===6) {
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
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
      const user = wx.getStorageSync('user')
      user.bank_name = this.data.bank_name
      user.bank_card = this.data.bank_card
      user.account_name = this.data.account_name
      wx.setStorageSync('user', user)
      wx.navigateBack()
    })
    .catch(err => {
      wx.showToast({
        title: '网络错误',
        duration: 2000,
        icon: 'none'
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