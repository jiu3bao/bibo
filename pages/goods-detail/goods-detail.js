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
      name:'亿美会员',
      text:[
        '到指定医院整形',
        '2年内不限项目整形利润全返(只收取材料、麻醉、住院费用)',
        '最高返现比例可达90%。',
        '会员享受免费整形同时，还可赚钱',
        '会员每推荐一名会员，可直接得100元红包',
        '会员每推荐一名合伙人，可直接得500元现金红包',
        '无需繁琐经营，平台软件代管里，即可躺着赚钱',
        '助力推广还可获额外红包'
      ]
    },
    {
      id: 2,
      name: '亿美合伙人',
      text: [
        '名下会员手术费20%的提成',
        '推荐合伙人获得25%的奖励',
        '推荐高级合伙人可获得30%的奖励',
        '会员整形利润全返，销售无压力',
        '提供工作管理工具，无需繁琐经营',
        '平台推广中心专业宣传，只需一键转发',
        '专业的工作软件，私人销售二维码，自动记录个人名下',
        '全方位的医美咨询培训提高你的专业技能快速成为行业精英',
        '名下会员手术排前、提现排前',
        '充分的晋升空间未来医院掌舵人'
      ]
      },
      {
        id: 3,
        name:'亿美城市合伙人',
        text: [
          '名下会员手术费30%的提成',
          '推荐合伙人获得30%的奖励',
          '推荐高级合伙人可获得30%的奖励',
          '会员整形利润全返，销售无压力',
          '提供工作管理工具，无需繁琐经营',
          '平台推广中心专业宣传，只需一键转发',
          '专业的工作软件，私人销售二维码，自动记录个人名下',
          '全方位的医美咨询培训提高你的专业技能快速成为行业精英',
          '名下会员手术排前、提现排前',
          '充分的晋升空间未来医院掌舵人'
        ]
      }],
    now_content:{}
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
  create_order() {
    if(wx.getStorageSync('openid')) {
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
              wx.showToast({
                title: '付款成功',
                duration:3000
              })
            },
            fail(res) {
              wx.showToast({
                title: res,
                duration: 2000,
                icon: 'none'
              })
            }
          })
        })
        .catch(err => {
          wx.showToast({
            title: err,
            duration: 2000,
            icon: 'none'
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
              wx.showToast({
                title: '付款成功',
                duration:3000
              })
            },
            fail(res) {
              wx.showToast({
                title: res,
                duration: 2000,
                icon: 'none'
              })
            }
          })
        })
        .catch(err => {
          wx.showToast({
            title: err,
            duration: 2000,
            icon: 'none'
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_detail(options.id)
    this.setData({
      id: options.id,
      now_content:this.data.content.filter(i => i.id == options.id)[0]
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