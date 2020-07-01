const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const countDist =(lat1, lng1, lat2, lng2) => {//纬度1,经度1,纬度2,经度2
    if(lat1==lat2&& lng1==lng2) return 0

      var f = ((lat1 + lat2) / 2) * Math.PI / 180.0;
  
      var g = ((lat1 - lat2) / 2) * Math.PI / 180.0;
  
      var l = ((lng1 - lng2) / 2) * Math.PI / 180.0;
  
      var sg = Math.sin(g);
  
      var sl = Math.sin(l);
  
      var sf = Math.sin(f);
  
      var s, c, w, r, d, h1, h2;
  
      var a = 6378137.0;//地球的直径
  
      var fl = 1 / 298.257;
  
      sg = sg * sg;
  
      sl = sl * sl;
  
      sf = sf * sf;
  
      s = sg * (1 - sl) + (1 - sf) * sl;
  
      c = (1 - sg) * (1 - sl) + sf * sl;
  
      w = Math.atan(Math.sqrt(s / c));
  
      r = w!=0?Math.sqrt(s * c) / w:0;
  
      d = 2 * w * a;
  
      h1 = (3 * r - 1) / 2 / c;
  
      h2 = s=!0?(3 * r + 1) / 2 / s:0;
  
      var num = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
  
      return num;//返回单位:米
  
  }
  const checkLocation =()=> {
    // let that = this;
    // //选择位置，需要用户授权
    // wx.getSetting({
    //  success(res) {
    //   if (!res.authSetting['scope.userLocation']) {
    //    wx.authorize({
    //     scope: 'scope.userLocation',
    //     success() {
    //      wx.showToast({ //这里提示失败原因
    //       title: '授权成功！',
    //       duration: 1500
    //      })
    //     },
    //     fail() {
    //       wx.showToast({ //这里提示失败原因
    //         title: '授权失败',
    //         duration: 1500,
    //         icon:'none'
    //        })
    //     //  that.showSettingToast('需要授权位置信息');
    //     }
    //    })
    //   }
    //  }
    // })
  }
  const up_img =(path) => {
    return new Promise((resolve,reject) => {
      wx.uploadFile({
        url: 'https://ym.bibo80s.com/Main/UploadFile',
        filePath: path,
        name:'img',
        success(res) {
          resolve('https://ym.bibo80s.com'+JSON.parse(res.data).file_url)
        },
        fail(err) {
          console.log(err)
          reject(err)
        }
      })
    })
  }
  const returnimg = (count=1) => {
    return new Promise((resolve,reject) => {
      wx.chooseImage({
        count,
        sizeType: ['compressed'],
        success(res) {
          const arr = res.tempFilePaths.map(p => {
            return up_img(p) 
          })
          Promise.all(arr)
          .then(pics => {
            resolve(pics)
          })
          .catch(err => {
            reject(err)
          })
        },
        fail(err) {
          reject(err)
        }
      })
    })
    
  }
  const toChinesNum = (num)=> {
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = "零"
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num);
    let getWan = (temp) => {
    let strArr = temp.toString().split("").reverse();
    let newNum = "";
    for (var i = 0; i < strArr.length; i++) {
      newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
    }
     return newNum;
   }
   let overWan = Math.floor(num / 10000);
   let noWan = num % 10000;
   if (noWan.toString().length < 4) noWan = "0" + noWan;
   return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}

module.exports = {
  formatTime: formatTime,
  countDist,
  checkLocation,
  returnimg,
  toChinesNum
}
