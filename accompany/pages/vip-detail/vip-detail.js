// accompany/pages/vip-detail/vip-detail.js
import service from '../../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    isexpand:false,
    designs:[],
    page:1,
    islastpage:false,
    shape_list:[],
    showbigpic:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const item = JSON.parse(options.item)
    const designs = JSON.parse(options.design)
    this.setData({
      info:{...item,id:item.user_id},
      designs
    },() => {
      this.get_records()
    })  
    
  },
  openimg(e) {
    const url = e.currentTarget.dataset.src 
    // this.setData({
    //   showbigpic:true,
    //   imgsrc:url
    // })
    wx.previewImage({
      current:url,
      urls: [url],
    })
  },
  // closeimg() {
  //   this.setData({
  //     showbigpic:false,
  //     imgsrc:''
  //   })
  // },
  //获取整形记录
  get_records() {
    if(this.data.islastpage) return
    const data = {
      Page:this.data.page,
      PageSize:5,
      Token:wx.getStorageSync('user').Token,
      id:this.data.info.id
    }
    
    service('ConsultAPI/GetCustomMedicalList',data)
    .then(r => {
      r.data.data.map(i => {
        try {
          i.item_list = JSON.parse(i.item)
        } catch (e) {
          // i.item_list = i.item
        }
      })
      if(r.data.data.length<5) {
        this.setData({
          islastpage:true
        })
      }
      this.setData({
        shape_list:[...this.data.shape_list,...r.data.data]
      })
    })
  },
  //查看会员详情
  touserinfo() {
    wx.navigateTo({
      url: '/accompany/pages/member-info/member-info?info='+ JSON.stringify(this.data.info),
    })
  },
  expand() {
    this.setData({
      isexpand:!this.data.isexpand
    })
  },
  to_feedback(e) {
    const item = e.currentTarget.dataset.item
    if(item.status==0) {
      wx.showModal({
        title: '提示',
        content: '该方案暂无咨询师回复，请稍候',
        success (res) {
          
        }
      })
      return
    }
    wx.navigateTo({url:'/packageA/pages/design-feedback/design-feedback?caseid='+item.custom_case_id+'&is_zxs=true'})
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
    this.setData({
      page:this.data.page+1
    },() => {
      this.get_records()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})