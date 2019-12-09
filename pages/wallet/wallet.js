// pages/wallet/wallet.js
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

    type: [{
      type: 0,
      name: '会员消费收益'
    },
    {
      type: 1,
      name: '推广收益'
    },
    {
      type: 2,
      name: '我的消费返现'
    }],
    now_at_type: 0,
    money:0,
    vipPayList:[],
    extensionList:[],
    myPayList:[],
    page0:1,
    page1:1,
    page2:1,
    pagesize:20
  },
  change_type(e, type) {
    const t = e ? e.target.dataset.type : type
    //没做切换直接return
    if (this.data.now_at_type === t) return
    this.setData({ now_at_type: t })
    //有数据则不再获取
    if (t === 0 && this.data.vipPayList.length !== 0) return
    if (t === 1 && this.data.extensionList.length !== 0) return
    if (t === 2 && this.data.myPayList.length !== 0) return
    //获取数据
    const data = {
      Page:this.data['page'+t],
      PageSize:this.data.pagesize,
      Param:t,
      Token:wx.getStorageSync('user').Token
    }
    this.get_list(data)
    .then(r => {
      if (r.data.error_code) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
      }
      if(r.data.error_code!==0) {
        console.log(r.data.message)
        return 
      }
      let arr = []
      if(t===0) {
        arr = this.data.vipPayList
        this.setData({
          vipPayList: [...arr,...r.data.data]
        })
      } else if(t===1){
        arr = this.data.extensionList
        this.setData({
          extensionList: [...arr, ...r.data.data]
        })
      } else {
        arr = this.data.myPayList
        this.setData({
          myPayList: [...arr, ...r.data.data]
        })
      }
      
    })
    .catch(err => {
      console.log(err)
    })
    
  },
  get_list(data) {
    return new Promise((resolve,reject) => {
      service('/GetMyBonusRecord', data)
        .then(r => {
          resolve(r)
        })
        .catch(err => {
          reject(err)
        })
    })
    
  },
  slide(e) {
    const type = this.data.type[e.detail.current].type
    this.change_type(null, type)
  },
  input_money(e) {
    this.setData({
      money: e.detail.value
    })
  },
  apply_money() {
    if(this.data.money ===0) return 
    const token = wx.getStorageSync('user').Token
    const data = {
      Token: token
    }
    service('/AddMoneyApply',data)
    .then(r => {
      if (r.data.error_code===6) {
        wx.navigateTo({
          url: '/pages/login/login',
        })
        return 
      }
      if(r.data.error_code!==0) {
        console.log(r.dat.message)
        return 
      }
      return service('/GetUserInfo',{ Token: token})
    })
    .then(r1 => {
      if (r.data.error_code === 6) {
        wx.navigateTo({
          url: '/pages/login/login',
        })
        return
      }
      if (r.data.error_code !== 0) {
        console.log(r.data.message)
        return
      }
      this.setData({
        money: r.data.data.money
      })
    })
    .catch(err=> {

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    service('/GetUserInfo', { Token: wx.getStorageSync('user').Token })
    .then(r => {
      if (r.data.error_code === 6) {
        wx.navigateTo({
          url: '/pages/login/login',
        })
        return
      }
      if (r.data.error_code !== 0) {
        console.log(r.data.message)
        return
      }
      this.setData({
        money: r.data.data.money
      })
    })
    .catch(err=> {

    })


    const data = {
      Page: 1,
      PageSize: this.data.pagesize,
      Param: 0,
      Token: wx.getStorageSync('user').Token
    }
    this.get_list(data)
      .then(r => {
        if (r.data.error_code) {
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        if (r.data.error_code !== 0) {
          console.log(r.data.message)
          return
        }
        this.setData({
          vipPayList: r.data.data
        })

      })
      .catch(err => {
        console.log(err)
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
    const p = this.data['page' + t] + 1
    this.setData({
      ['page' + t]:p
    })
    const data = {
      Page: p,
      PageSize: this.data.pagesize,
      Param: t,
      Token: wx.getStorageSync('user').Token
    }
    this.get_list(data)
      .then(r => {
        if (r.data.error_code) {
          wx.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        if (r.data.error_code !== 0) {
          console.log(r.data.message)
          return
        }
        let arr = []
        if (t === 0) {
          arr = this.data.vipPayList
          this.setData({
            vipPayList: [...arr, ...r.data.data]
          })
        } else if (t === 1) {
          arr = this.data.extensionList
          this.setData({
            extensionList: [...arr, ...r.data.data]
          })
        } else {
          arr = this.data.myPayList
          this.setData({
            myPayList: [...arr, ...r.data.data]
          })
        }

      })
      .catch(err => {
        console.log(err)
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})