// accompany/pages/set-design/set-design.js
import service from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    program_list:[
      '眼部',
      '鼻部',
      '胸部',
      '脂肪',
      '其他'
    ],
    activeType:'眼部',
    subject_list:[],
    info:{},
    casei:{}
  },
  //获取整形大类
  get_pro_list() {
    service('/API/GetMedicalItemType')
    .then(r => {
      this.setData({
        program_list:r.data.data
      },()=>{
        this.checkitem()
      })
      
    })
  },
  //切换大类
  checkitem(e) {
    const pro = e?e.currentTarget.dataset.item:this.data.program_list[0]
    this.setData({
      activeType:pro
    })
    service('API/GetMedicalItemList',{Param:pro})
    .then(r => {
      r.data.data.map(i => {
        i.ischeck = false
      })
      this.setData({
        subject_list:[...r.data.data]
      })
      
    })
  },
  //选择小类
  choseitem(e) {
    const i = e.currentTarget.dataset.index
    const arr = this.data.subject_list
    arr[i].ischeck = !arr[i].ischeck
    this.setData({
      subject_list:[...arr]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_pro_list()
    const casei = JSON.parse(options.casei) 
    const info = {head:casei.head,name:casei.name,wx:casei.wx,ismember:casei.ismember,id:casei.zxs_id}
    this.setData({
      casei:casei,
      info:info
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