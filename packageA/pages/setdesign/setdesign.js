// pages/setdesign/setdesign.js
import {returnimg} from '../../../utils/util'
import service from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    age:'',
    pic:'',
    pic45:'',
    pic90:'',
    pic45r:'',
    pict:'',
    item_name:'',
    demand:'',
    is_done:0,
    done_item_des:'',
    his:''
  },
  add_pic(e) {
    const t = e.currentTarget.dataset.type
    returnimg()
    .then(res =>{
      console.log(res)
      this.setData({
        [t]:res[0]
      })
    })
  },
  submit() {
    // for(let k in this.data) {
      // if(!this.data[k] || this.data[k].length==0) {
      //   if(k=='is_done' ||(k=='done_item_des'&&!this.data.is_done)) {

      //   }  else {
      //     wx.showToast({
      //       title: '请填写完整信息',
      //       icon:'none'
      //     })
      //   }
      // }
    // }
    const data = {...this.data,Token:wx.getStorageSync('user').Token}
    delete data.__webviewId__
    service('/ConsultAPI/AddCustomCase',data)
    .then(r => {
      if(r.data.error_code===6) {
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
        return
      }
      if(r.data.error_code!==0) {
        wx.showToast({
          title: r.data.message,
          icon:'none'
        })
        return
      }
      wx.showToast({
        title: '上传成功',
      })
      wx.navigateBack()
    })
  },
  radioChange(e) {
    this.setData({
      is_done:e.detail.value
    })
    console.log(e)
  },
  input(e) {
    const t = e.currentTarget.dataset.type
    this.setData({
      [t]:e.detail.value
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