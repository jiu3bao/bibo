// pages/member-manage/member-manage.js
import service from '../../utils/api.js'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '登录', //导航栏 中间的标题
    },
    navbarHeight: app.globalData.navbarHeight,
    type: 0,
    payList: {notget:[],geted:[]},
    rankList: [],
    rankinfo:{},
    page1:1,
    pagesize:10000,
    page2:1,
    islastpage1:false,
    islastpage2:false
  },
  slide(e) {
    this.setData({
      type: e.detail.current
    })
  },
  changetype(e) {
    if (e.currentTarget.dataset.type===this.data.type) return 
    this.setData({
      type: e.currentTarget.dataset.type
    })
    if (e.currentTarget.dataset.type===0) {
      if (!!!this.data.payList.notget.length && !!!this.data.payList.geted.length) {
        this.get_pay_list(1, this.data.pagesize,0)
          .then(r => {
            const { notget, geted } = this.data.payList
            this.setData({
              payList: { notget: [...r.data.data], geted }
            })
          })
          .catch(err => {

          })
        this.get_pay_list(this.data.page1, 10, 1)
          .then(r => {
            const { notget, geted } = this.data.payList
            this.setData({
              payList: { notget, geted: [...geted, ...r.data.data] }
            })
          })
          .catch(err => {

          })
      }
    } else {
      if(!!!this.data.rankList.length) {
        this.get_rank_info()
        this.get_rank_list(1)
      }
    }
  },
  get_pay_list(p,size,type) {
    const data ={
      Page:p,
      PageSize:size,
      Param:type,
      Token: wx.getStorageSync('user').Token
    }
    return new Promise((resolve,reject) => {
      service('/GetMyMedicalRecordList', data)
        .then(r => {
          resolve(r)
          // let total_arr = r.data.data
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  get_rank_info() {
    service('/GetPoolandIndex', { Token: wx.getStorageSync('user').Token})
      .then(r => {
        // const arr = this.data.rankList
        this.setData({
          rankinfo:r.data.data
        })
      })
      .catch(err => {
        
      })
  },
  get_rank_list(p) {
    const data = {
      Page: p,
      PageSize: 10,
      Token: wx.getStorageSync('user').Token

    }
    service('/GetMedicalRecordSequence',data)
    .then(r => {
      if(r.data.data.length===0) {
        this.setData({
          islastpage2:true
        })
        return
      }
      const arr = this.data.rankList
      this.setData({
        rankList:[...arr,...r.data.data]
      })
    })
    .catch(err => {

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_pay_list(1, this.data.pagesize,0)
      .then(r=> {
        const { notget, geted} = this.data.payList
        this.setData({
          payList: { notget: [...r.data.data], geted }
        })
      })
      .catch(err => {
        
      })
    this.get_pay_list(this.data.page1, 10, 1)
      .then(r => {
        if(r.data.data.length===0) {
          this.setData({
            islastpage1:true 
          })
          return 
        }
        const { notget, geted } = this.data.payList
        this.setData({
          payList: { notget, geted: [...geted, ...r.data.data] }
        })
      })
      .catch(err => {

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
    if(this.data.type===0) {//获取消费详情
      if(this.data.islastpage1) return
      const p = this.data.page1+1
      this.setData({
        page1:p
      })
      this.get_pay_list(p, 10, 1)
        .then(r => {
          const { notget, geted } = this.data.payList
          this.setData({
            payList: { notget, geted: [...geted, ...r.data.data] }
          })
        })
        .catch(err => {

        })
    } else {
      if (this.data.islastpage2) return
      const p = this.data.page2+1
      this.setData({
        page2: p
      })
      this.get_rank_list(p)
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})