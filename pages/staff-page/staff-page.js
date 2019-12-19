// pages/staff-page/staff-page.js
import service from '../../utils/api.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '登录', //导航栏 中间的标题
    },
    navbarHeight: app.globalData.navbarHeight,
    date:'',
    hos_list:[],
    hos:{},
    item_list:[],
    multiIndex:[0,0],
    add_item:[],
    total_money:0,
    phone:''
  },
  set_phone(e) {
    this.setData({
      phone:e.detail.value
    })
  },
  confiry_phone() {
    service('/GetUserInfoByMobile',
      { mobile:this.data.phone})
      .then(r => {

      })
  },
  get_hos() {
    service('/GetHospitals')
    .then(r => {
      this.setData({
        hos_list:r.data.data
      })
    })
  },
  chose_hos(e) {
    this.setData({
      hos: this.data.hos_list[e.detail.value]
    })
  },
  get_item_list() {
    service('/GetMedicalItemList',{})
    .then(r => {
      const item_map = new Map()
      r.data.data.map(i => {
        if (item_map.has(i.item_type)) {
          const v = item_map.get(i.item_type)
          item_map.set(i.item_type,[...v,i])
        } else {
          item_map.set(i.item_type, [i])
        }
      })
      let arr1 = [],arr2=[],arr=[]
      item_map.forEach((v,k) => {
        arr1.push({item:k})
        arr2.push(v)
        arr.push({
          item:k,
          children:v
        })
      })
      this.setData({
        multiArray: [arr1, arr2[0]],
        item_list:arr
      })
    })
  },
  bindMultiPickerChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange(e) {
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0: 
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = this.data.item_list[0].children;
            this.setData({
              multiArray: data.multiArray
            })
            break;
          case 1:
            data.multiArray[1] = this.data.item_list[1].children;
            this.setData({
              multiArray: data.multiArray
            })
            break;
        }
    }
  },
  add_a_item() {
    this.setData({
      add_item:[...this.data.add_a_item,{}]
    })
  },
  delete_a_item(e) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_hos()
    this.get_item_list()
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