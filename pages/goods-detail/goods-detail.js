// pages/goods-detail/goods-detail.js
import service from '../../utils/api.js'
const app = getApp()

var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的主页', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    navbarHeight: app.globalData.navbarHeight,
    detail: {},
    src_url: app.globalData.src_url,
    id:'',
    content:[{
      id:1,
      name:'亿美会员权益',
      type:'VIP会员',
      pic:'../../img/hy.png',
      text:[
        '到平台合作单位，均可享受平台补贴',
        '整形补贴数额=整形项目金额—材料成本—麻醉费',
        '会员费2980/年，新会员首次购买赠送一年会员资格，有效期内平台补贴不限整形次数',
        '平台不收取任何整形费用，整形费用均由医院收取',
        '平台不涉及任何医疗行为，平台只在会员整形后给予福利补贴',
        '平台补贴将按照会员整形顺序排队发放，在“个人中心—我的消费”功能中可实时查看',
        '通过“个人中心—我的推广码”助力平台传播，惠及更多爱美之人，平台将记录并给与个人红包奖励。奖励金将直接发放到“我的钱包”',
        '会员对“我的钱包”金额申请提现，平台将收取6%手续费'
      ]
    },
    {
      id: 2,
      name: '亿美合伙人权益',
      type:'合伙人',
      pic:'../../img/pt.png',
      text: [
        '收取的合伙人费用为专业医美咨询培训费+会员管理系统使用费。',
        '平台与三甲医院医生及专业培训师合作，定期为合伙人开展医美咨询培训、市场培训等，让您快速成长为医美咨询行业精英，更好的服务名下会员',
        '通过“个人中心——我的推广码”推荐吸纳的会员，在“个人中心——会员管理”纳入合伙人个人名下，会员每次整形消费均享受奖励，持续收益，永不丢客。',
        '通过“个人中心——我的推广码”推荐新合伙人加入，平台将记录并一次性给与奖励，奖励金直接发放到“我的钱包”。',
        '合伙人名下的会员整形后平台优先补贴，排队自动提前10名。',
        '对个人钱包金额申请提现，平台将收取6%手续费。',
      ]
      },
      {
        id: 3,
        name:'亿美高级合伙人权益',
        type:'高级合伙人',
        pic:'../../img/gj.png',
        text: [
          '收取的高级合伙人费用为专业医美咨询培训费+会员管理系统使用费。',
          '平台与三甲医院医生及专业培训师合作，定期为合伙人开展医美咨询培训、市场培训等，让您快速成长为医美咨询行业精英，更好的服务名下会员。',
          '通过“个人中心——我的推广码”推荐吸纳的会员，在“个人中心——会员管理”纳入合伙人个人名下，会员每次整形消费均享受奖励，持续收益，永不丢客。',
          '通过“个人中心——我的推广码”推荐新合伙人加入，平台将记录并一次性给与奖励，奖励金直接发放到“我的钱包”。',
          '高级合伙人名下的会员整形后平台优先补贴，排队自动提前10名。',
          '对个人钱包金额申请提现，平台将收取6%手续费。',
          '平台未来还将集团化投资多个整形医院，推广业绩突出的优秀合伙人，将择优成为整形分院老板。',
        ]
      }],
    now_content:{},
    show_con:false,
    has_read:false,
    isUpdate:false,
    updatePrice:0,
    showShadow:false
  },
  read() {
    this.setData({
      has_read:!this.data.has_read
    })
  },
  tocontract() {
    wx.navigateTo({
      url: '/pages/contract/contract',
    })
  },
  get_detail(id) {
    const data = {
      id:id,
      Token:wx.getStorageSync('user').Token
    }
    service('/GetGoodsDetail',data)
      .then(r => {
        if (r.data.error_code===6) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
          return
        } 
        if (r.data.error_code !==0) {
          wx.showToast({
            title: r.data.message,
            duration: 2000,
            icon: 'none'
          })
          return
        } 
        var that = this;
        const html = that.htmlEscape(r.data.data.introduce)
        console.log(html)
        this.setData({
          detail: r.data.data
        })
        WxParse.wxParse('article', 'html', html, that, 5);
      })
      .catch(err => {
        wx.showToast({
          title: err,
          duration: 2000,
          icon: 'none'
        })
      })
  },
  htmlEscape(html) {
    const reg = /(&lt;)|(&gt;)|(&amp;)|(&quot;)|(&nbsp;)|(src=\")|(src=\')/g;
    return html.replace(reg, function (match) {
      switch (match) {
        case "&lt;":
          return "<";
        case "&gt;":
          return ">";
        case "&amp;":
          return "&";
        case "&nbsp;":
          return " ";
        case "&quot;":
          return "\"";
        case "src=\"":
          return "src=\""+app.globalData.src_url;
        case "src=\'":
          return "src=\'" + app.globalData.src_url;
      }
    });
  },
  open_contract() {
    this.setData({
      show_con:true
    })
  },
  create_order() {
    if(!this.data.has_read) {
      wx.showToast({
        title: '请阅读并勾选用户协议',
        icon:'none',
        duration:3000
      })
      return
    }
    wx.showLoading({mask:true})
    if(wx.getStorageSync('openid')) {
      const that = this
      this.get_order_id()
        .then(res => {
          return this.get_pay_param(res, wx.getStorageSync('openid'))
        })
        .then(r => {
          wx.requestPayment({
            timeStamp: r.timestamp,
            nonceStr: r.nonceStr,
            package: 'prepay_id=' + r.prepay_id,
            signType: r.signType,
            paySign: r.paySign,
            success(res) {
              wx.hideLoading({
                complete: (res) => {
                  wx.showToast({
                    title: '付款成功',
                    duration:3000
                  })
                  wx.switchTab({
                    url: '/pages/user/user',
                  })
                },
              })
              // that.get_userInfo()
            },
            fail(res) {
              wx.hideLoading({
                complete: (res) => {
                  wx.showToast({
                    title: res,
                    duration: 2000,
                    icon: 'none'
                  })
                },
              })
              
            }
          })
        })
        .catch(err => {
          wx.hideLoading({
            complete: (res) => {
              wx.showToast({
                title: err,
                duration: 2000,
                icon: 'none'
              })
            },
          })
          
        })
    } else {
      Promise.all([this.get_order_id(), this.get_openid()])
        .then(res => {
          return this.get_pay_param(...res)
        })
        .then(r => {
          wx.requestPayment({
            timeStamp: r.timestamp,
            nonceStr: r.nonceStr,
            package:  'prepay_id=' +r.prepay_id ,
            signType: r.signType,
            paySign: r.paySign,
            success(res) {
              
              wx.hideLoading({
                complete: (res) => {
                  wx.showToast({
                    title: '付款成功',
                    duration:3000
                  })
                  wx.switchTab({
                    url: '/pages/user/user',
                  })
                },
              })
            },
            fail(res) {
              wx.hideLoading({
                complete: (res) => {
                  wx.showToast({
                    title: res,
                    duration: 2000,
                    icon: 'none'
                  })
                },
              })
              
            }
          })
        })
        .catch(err => {
          wx.hideLoading({
            complete: (res) => {
              wx.showToast({
                title: err,
                duration: 2000,
                icon: 'none'
              })
            },
          })
          
        })
    }
  },
  get_order_id() {
    return new Promise((resolve,reject) => {
      const data = {
        Token: wx.getStorageSync('user').Token,
        goods_id: this.data.id
      }
      service('/CreateOrder', data)
        .then(r => {
          if (r.data.error_code === 6) {
            wx, wx.navigateTo({
              url: '/pages/login/login',
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
                res.eventChannel.emit('acceptDataFromOpenerPage', {canBack:true})
              }
            })
            reject(r.data.message)
          }
          if (r.data.error_code !== 0) {
            wx.showToast({
              title: r.data.message,
              duration: 2000,
              icon: 'none'
            })
            reject(r.data.message)
          }
          resolve(r.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  get_openid() {
    return new Promise((resolve,reject) => {
      wx.login({
        success(res) {
          if (res.code) {
            service('/GetWXXcxOpenid', {
              code: res.code
            })
            .then(r => {
              resolve(r.data.data.openid)
            })
          } else {
            console.log('登录失败！' + res.errMsg)
            reject(res.errMsg)
          }
        }
      })
    })
    
  },
  get_pay_param(order_id,openid) {
    return new Promise((resolve,reject) => {
      const data = {
        Token: wx.getStorageSync('user').Token,
        OrderID: order_id,
        OpenID:openid
      }
      service('/GetWXXcxPayParam', data)
        .then(r => {
          if (r.data.error_code === 6) {
            wx, wx.navigateTo({
              url: '/pages/login/login',
            })
            return
          }
          if (r.data.error_code !== 0) {
            console.log(r.data.message)
            return
          }
          resolve(r.data.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  closeshadow(data) {
    this.setData({
      showShadow:false
    })
  },
  get_userInfo() {
    service('/GetUserInfo', { Token:wx.getStorageSync('user').Token})
    .then(r => {
      if (r.data.error_code !==0) {
        reject(r.data.message)
        return 
      }
      const {name,head} = r.data.data
      if(head.length===0||name.length===0) {
        this.setData({
          showShadow:true
        })
      }
    })
    .catch(e => {
      console.log(e)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_detail(options.id)
    this.setData({
      id: options.id,
      now_content:this.data.content.filter(i => i.id == options.id)[0],
    })
    if(options.id==3 && wx.getStorageSync('user').Token) {
      service('/GetUserInfo',{Token:wx.getStorageSync('user').Token}).then(r => {
        if(r.data.error_code!==0) {
          return new Promise((resolve,reject) => {
            reject()
          })
        }
        if(r.data.data.type===2) {
          this.setData({
            isUpdate:true
          })
          return service('/GetUpdateAgentFee')
        }
        return new Promise((resolve,reject) => {
          reject()
        })
      })
      .then(r1 => {
        this.setData({
          updatePrice:r1.data
        })
      })
      .catch(err => {

      })
    }
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