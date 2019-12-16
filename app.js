//app.js
App({
  onLaunch: function (options) {
    // 判断是否由分享进入小程序
    console.log(options.scene)
    const scene = options.scene
    if (typeof options.scene === 'Number') {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    //这个最初我是在组件中获取，但是出现了一个问题，当第一次进入小程序时导航栏会把
    //页面内容盖住一部分,当打开调试重新进入时就没有问题，这个问题弄得我是莫名其妙
    //虽然最后解决了，但是花费了不少时间
    let systemInfo = wx.getSystemInfoSync();
    try {
      let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null; //胶囊按钮位置信息
      wx.getMenuButtonBoundingClientRect();
      let navBarHeight = (() => { //导航栏高度
        console.log(rect, systemInfo.statusBarHeight)
        let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
        console.log(gap)
        this.globalData.height = 2 * gap + rect.height
        this.globalData.navbarHeight = systemInfo.statusBarHeight + 2 * gap + rect.height
        // return 2 * gap + rect.height;
      })()
      if (rect === null) {
        throw 'getMenuButtonBoundingClientRect error';
      }
      //取值为0的情况
      if (!rect.width) {
        throw 'getMenuButtonBoundingClientRect error';
      }
    } catch (error) {
      let gap = ''; //胶囊按钮上下间距 使导航内容居中
      let width = 96; //胶囊的宽度，android大部分96，ios为88
      if (systemInfo.platform === 'android') {
        gap = 8;
        width = 96;
      } else if (systemInfo.platform === 'devtools') {
        if (ios) {
          gap = 5.5; //开发工具中ios手机
        } else {
          gap = 7.5; //开发工具中android和其他手机
        }
      } else {
        gap = 4;
        width = 88;
      }
      if (!systemInfo.statusBarHeight) {
        //开启wifi的情况下修复statusBarHeight值获取不到
        systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
      }
      rect = {
        //获取不到胶囊信息就自定义重置一个
        bottom: systemInfo.statusBarHeight + gap + 32,
        height: 32,
        left: systemInfo.windowWidth - width - 10,
        right: systemInfo.windowWidth - 10,
        top: systemInfo.statusBarHeight + gap,
        width: width
      };
      console.log('error', error);
      console.log('rect', rect);
    }
  },

  globalData: {
    share: false,  // 分享默认为false
    height: 0,
    navbarHeight:0,
    src_url: "http://ym.bibo80s.com"

  }

})