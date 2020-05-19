function service(url, data) {
  const host = 'https://ym.bibo80s.com/API/'
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url, //仅为示例，并非真实的接口地址
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'post',
      success(res) {
        resolve(res)
      },
      fail(error) {
        wx.hideLoading()
        wx.showToast({
          title: '服务器请求失败',
          icon: 'none',
          duration: 2000
        })
        reject(error)
      }
    })
  })
}
function imgService(url,method,data) {
  const host = 'https://ym.bibo80s.com/Main/UploadFile'
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url, //仅为示例，并非真实的接口地址
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: method,
      success(res) {
        resolve(res)
      },
      fail(error) {
        wx.hideLoading()
        wx.showToast({
          title: '服务器请求失败',
          icon: 'none',
          duration: 2000
        })
        reject(error)
      }
    })
  })
}

export default  service