// accompany/pages/my-order-list/my-order-list.js
import service from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actab:1,
    page1:1,
    page2:1,
    islastpage1:false,
    islastpage2:false,
    pageSize:15,
    viplist:[],
    publiclist:[],
    now:''
  },
  get_vip_list() {
    if(this.islastpage1) return
    const data = {
      Token:wx.getStorageSync('user').Token,
      Page:this.data.page1,
      PageSize:this.data.pageSize,
      Param:0
    }
    service('ConsultAPI/GetZXSCustomCaseList',data)
    .then(r => {
      r.data.data.map(i => {
        const time = new Date(i.member_expire)
        i.ismember=(time>this.data.now)+''
        console.log(time)
      })
      if(r.data.data.length<this.data.pageSize) {
        this.setData({
          islastpage1:true
        })
      }
      this.setData({
        viplist:[...this.data.viplist,...r.data.data]
      })
    })
    .catch(err => {
      wx.showToast({
        title: '发生错误',
        icon:'none'
      })
    })
  },
  get_public_list() {
    if(this.islastpage2) return
    const data = {
      Token:wx.getStorageSync('user').Token,
      Page:this.data.page2,
      PageSize:this.data.pageSize,
    }
    service('ConsultAPI/GetPublicCustomCaseList',data)
    .then(r => {
      r.data.data.map(i => {
        const time = new Date(i.member_expire)
        i.ismember=(time>this.data.now)+''
      })
      if(r.data.data.length<this.data.pageSize) {
        this.setData({
          islastpage1:true
        })
      }
      this.setData({
        publiclist:[...this.data.publiclist,...r.data.data]
      })
    })
    .catch(err => {
      wx.showToast({
        title: '发生错误',
        icon:'none'
      })
    })
  },
  access(e) {
    const casei = JSON.stringify(e.currentTarget.dataset.case)
    console.log(casei)
    if(this.data.actab===1) {
      wx.navigateTo({
        url: '/accompany/pages/set-design/set-design?casei='+casei,
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function (data) {
            console.log(data)
          },
          someEvent: function (data) {
            console.log(data)
          }
        },
        success: (res) => {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('setcasei', e.currentTarget.dataset.case)
        }
      })
    } else {
      const caseid = e.currentTarget.dataset.case.custom_case_id
      const data =  {
        Token:wx.getStorageSync('user').Token,
        custom_case_id:caseid
      }
      service('/ConsultAPI/ReciveCase',data)
      .then(r => {
        wx.navigateTo({
          url: '/accompany/pages/set-design/set-design?casei='+casei,
          events: {
            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            acceptDataFromOpenedPage: function (data) {
              console.log(data)
            },
            someEvent: function (data) {
              console.log(data)
            }
          },
          success: (res) => {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('setcasei', e.currentTarget.dataset.case)
          }
        })
      })
      .catch(err => {
        wx.showToast({
          title: '发生错误',
          icon:"none"
        })
      })
    }
    
  },
  //切换tab
  switch(e) {
    const actab = e.currentTarget.dataset.type
    this.setData({
      actab:actab
    })
    if(actab==1) {
      if(this.data.viplist.length==0) {
        this.get_vip_list()
      }
    } else {
      if(this.data.publiclist.length==0) {
        this.get_public_list()
      }
    }
  },
  //复制微信号
  copyText(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success (res) {
        wx.getClipboardData({
          success (res) {
            wx.showToast({
              title: '复制成功'
            })
          },
          fail(err) {
            console.error(err)
            wx.showToast({
              title: '复制失败',
              icon:"none"
            })
          }
        })
      },
      fail(err) {
        console.error(err)
        wx.showToast({
          title: '复制失败',
          icon:"none"
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(Date.now())
    
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
    this.setData({
      now:Date.now(),
      viplist:[],
      publiclist:[],
      page1:1,
      page2:1,
      islastpage1:false,
      islastpage2:false

    })
    this.get_vip_list()
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
    if(this.data.actab==1) {
      this.setData({
        page1:this.page1+1
      },() => {
        this.get_vip_list()
      })
      
    } else {
      this.setData({
        page2:this.page2+1
      },() => {
        this.get_public_list()
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})