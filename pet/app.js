//app.js
const config = require("/utils/config.js");
App({
  onLaunch: function () {
    console.log("当前路径：" + config.URL_Service);
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    let naviTop = menuButtonObject.top; //胶囊按钮与顶部的距离
    let menuHeight = menuButtonObject.height; // 胶囊高度
    let statusBarHeight = wx.getSystemInfoSync()['statusBarHeight'];
    let naviHeight = statusBarHeight + menuHeight + (naviTop - statusBarHeight) * 2; //导航高度
    this.globalData.naviHeight = naviHeight;
    this.globalData.naviTop = naviTop;
    this.globalData.windowHeight = wx.getSystemInfoSync()['windowHeight'];
    this.globalData.pageHeight = this.globalData.windowHeight - this.globalData.naviHeight;
  },
  globalData: {

    openId: null,

    /** =========== 用户数据 =========== */
    userInfo: {
      customerNo: null, // id
      nickName: null, // 昵称
      avatarUrl: null, // 头像
      gender: null, // 性别
      openId: null, // openId
      phone: null, // 手机号
      role: null, // 角色
    }, // 用户信息
  },
})
