// components/user-head/user-head.js
import service from '../../utils/api'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    moneyInfo:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    todetail() {
      if(!wx.getStorageSync('user').Token) {
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
        return 
      }
      wx.navigateTo({
        url: '/packageA/pages/flow-detail/flow-detail',
      })
    },
    //申请提现
    apply_money() {
      if(!wx.getStorageSync('user').Token) {
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
        return 
      }
      if(this.properties.moneyInfo.total <100) return wx.showToast({
        title: '金额不足',
        icon:'none'
      }),false;
      const token = wx.getStorageSync('user').Token
      const data = {
        Token: token
      }
      service('API/GetUserInfo', { Token:wx.getStorageSync('user').Token})
        .then(r => {
          if (r.data.error_code===6) {
            wx.showToast({
              title: r.data.message,
            })
            wx.navigateTo({
              url: '/packageA/pages/login/login',
            })        
            return 
          } 
          if (r.data.error_code !==0) {
            wx.showToast({
              title: r.data.message,
            })
            return 
          }
          if(r.data.data.is_member<=0) {
            wx.showModal({
              title: '提示',
              content: '交费注册成为会员或合伙人后，即可使用',
              success(res) {
                if (res.confirm) {
                  
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            return 
          }
          service('API/AddMoneyApply',data)
          .then(r => {
            if (r.data.error_code===6) {
              wx.navigateTo({
                url: '/packageA/pages/login/login',
              })
              return new Promise((resolve,reject) => 
              { reject(r.data.message)}
              )
            }
            if(r.data.error_code!==0) {
              return new Promise((resolve, reject) => { reject(r.data.message) }
              ) 
            }
            return service('/GetUserInfo',{ Token: token})
          })
          .then(r1 => {
            if (r1.data.error_code === 6) {
              wx.navigateTo({
                url: '/packageA/pages/login/login',
              })
              return
            }
            if (r1.data.error_code !== 0) {
              wx.showToast({
                title: r.data.message,
                duration: 2000,
                icon: 'none'
              })
              return
            }
            wx.showToast({
              title: '申请成功',
              duration: 3000
            })
            this.triggerEvent('applyed')
          })
          .catch(err=> {
            wx.showToast({
              title: err,
              duration: 2000,
              icon: 'none'
            })
          })
        })
        .catch(err=> {
          wx.showToast({
            title: err,
            duration: 2000,
            icon: 'none'
          })
        })
      
      
    },
    //
    tobank() {
      if(!wx.getStorageSync('user').Token) {
        wx.navigateTo({
          url: '/packageA/pages/login/login',
        })
        return 
      }
      wx.navigateTo({
        url: '/packageA/pages/bankcard-list/bankcard-list',
      })
    }
  }
})
