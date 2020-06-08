// accompany/pages/my-vip.js
import service from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    txt:'',
    done_item_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_list()
    this.get_item()
  },
  //获取会员列表
  get_list() {
    const data = {
      Token:wx.getStorageSync('user').Token,
      // Page:2,
      // PageSize:15
    }
    service('ConsultAPI/GetMyCustomList',data)
    .then(r => {
      r.data.data.map(i => {
        i.isshow = true
      })
      this.setData({
        list:[...r.data.data]
      })
    })
    .catch(err => {
      wx.showToast({
        title: '发生错误，请联系工作人员或稍后重试',
        icon:"none"
      })
    })
  },
  bindKeyInput(e) {
    this.setData({
      txt: e.detail.value
    })
  },
  //搜索
  search() {
    const list=this.data.list.map(i => {
      console.log(this.regTxt(i.name))
      i.isshow = this.regTxt(i.name) || this.regTxt(i.wx?i.wx:null)
      return i 
    })
    this.setData({
      list:[...list]
    })
  },
  //匹配字符
  regTxt(txt) {
    console.log(this.data.txt,txt)
    return !this.data.txt || this.data.txt.length ==0 || (txt && txt.indexOf(this.data.txt)>=0)
  },
  //导航至详情
  to_detail(e) {
    console.log(e)
    const userid = e.currentTarget.dataset.item.user_id
    const belong =this.data.done_item_list.filter(i => {
      return i.zxs_id==userid
    })
    wx.navigateTo({
      url: '/accompany/pages/vip-detail/vip-detail?item='+JSON.stringify(e.currentTarget.dataset.item)+'&design='+JSON.stringify(belong),
    })
  },  
  //获取咨询项目
  get_item() {
    const data = {
      Token:wx.getStorageSync('user').Token,
      Page:1,
      PageSize:1000,
      Param:1
    }
    service('ConsultAPI/GetZXSCustomCaseList',data)
    .then(r => {
      this.setData({
        done_item_list:r.data.data
      })
    })
    .catch(err => {
      wx.showToast({
        title: '发生错误，请联系工作人员或稍后重试',
        icon:"none"
      })
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
    wx.hideHomeButton({
      success() {
        
      }
    })
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