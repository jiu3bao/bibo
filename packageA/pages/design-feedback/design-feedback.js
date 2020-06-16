import service from "../../../utils/api"
import {toChinesNum} from '../../../utils/util'
// packageA/pages/design-feedback/design-feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subject_list:[],
    obj:{},
    ismember:false,
    kf:{}
  },
  get_solution(id) {
    const data = {
      Token:wx.getStorageSync('user').Token,
      custom_case_id:id
    }
    service('ConsultAPI/GetCaseSolution',data)
    .then(r => {
      const arr = r.data.data.item_list
      const m = new Map()
      arr.map(a => {
        const n = a.item_name.split('-')
        const name = n[0]
        const title = n[1]
        a.name = name
        a.title = title
        if(m.has(name)) {
          m.get(name).push(a)
        } else {
          m.set(name,[a])
        }
      })
      const list = []
      let index = 1
      for (let [key, value] of m) {
        list.push({
          name:key,
          index:toChinesNum(index),
          subject_detail:value
        })
        index++
      }
      console.log(list)
      this.setData({
        subject_list:list,
        obj:r.data.data
      })
    })
  },
  get_zxs() {
    if(wx.getStorageSync('user').Token) {
      service('ConsultAPI/GetMyZXS',{Token:wx.getStorageSync('user').Token})
      .then(r => {
        this.setData({
          kf:r.data.data
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_zxs()
    const caseid = options.caseid
    this.get_solution(caseid)
    const now = Date.now()
    const mem_exp = wx.getStorageSync('user').member_expire
    const mem_exp_tp = new Date(mem_exp).getTime()
    console.log(wx.getStorageSync('user').ismember,now,mem_exp_tp)
    const ismember = wx.getStorageSync('user').is_member && now<mem_exp_tp
    this.setData({
      ismember
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