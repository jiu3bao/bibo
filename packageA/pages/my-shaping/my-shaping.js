import service from "../../../utils/api"

// pages/my-shaping/my-shaping.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    actab:1,
    noend_l:[],
    end_l:[],
    page1:1,
    page2:1,
    islastpage1:false,
    islastpage2:false,
    showbigpic:false,
  },
  openimg(e) {
    const url = e.currentTarget.dataset.src 
    wx.previewImage({
      current:url,
      urls: [url],
    })
    // this.setData({
    //   showbigpic:true,
    //   imgsrc:url
    // })
  },
  // closeimg() {
  //   this.setData({
  //     showbigpic:false,
  //     imgsrc:''
  //   })
  // },
  //切换tab
  switch(e) {
    const actab = e.currentTarget.dataset.type
    this.setData({
      actab:actab
    })
    if(actab==1) {
      if(this.data.noend_l.length==0) {
        this.get_noend()
      }
    } else {
      if(this.data.end_l.length==0) {
        this.get_end()
      }
    }
  },
  get_noend() {
    if(this.data.islastpage1) return
    const data ={
      Page:this.data.page1,
      PageSize:5,
      Param:0,
      Token: wx.getStorageSync('user').Token
    }
    service('API/GetMyMedicalRecordList', data)
    .then(r => {
      if (r.data.error_code === 6) {
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
      r.data.data.map(i => {
        try {
          i.item_list = JSON.parse(i.item)
        } catch (e) {
          // i.item_list = i.item
        }
      })
      if(r.data.data.length<5) {
        this.setData({
          islastpage1:true
        })
      }
      this.setData({
        noend_l:[...this.data.noend_l,...r.data.data]
      })
    })
  },
  get_end() {
    if(this.data.islastpage2) return 
    const data ={
      Page:this.data.page2,
      PageSize:5,
      Param:2,
      Token: wx.getStorageSync('user').Token
    }
    service('API/GetMyMedicalRecordList', data)
    .then(r => {
      if (r.data.error_code === 6) {
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
      r.data.data.map(i => {
        try {
          i.item_list = JSON.parse(i.item)
        } catch (e) {
          // i.item_list = i.item
        }
      })
      if(r.data.data.length<5) {
        this.setData({
          islastpage2:true
        })
      }
      this.setData({
        end_l:[...this.data.end_l,...r.data.data]
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      info:wx.getStorageSync('user')
    })
    this.get_noend()
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
    if(this.data.actab==1) {
      this.setData({
        page1:this.data.page1+1
      },() => {
        this.get_noend()
      })
    } else {
      this.setData({
        page2:this.data.page2+1
      },() => {
        this.get_end()
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})