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
  
      r = Math.sqrt(s * c) / w;
  
      d = 2 * w * a;
  
      h1 = (3 * r - 1) / 2 / c;
  
      h2 = (3 * r + 1) / 2 / s;
  
      var num = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
  
      return num;//返回单位:米
  
  }

module.exports = {
  formatTime: formatTime,
  countDist
}
