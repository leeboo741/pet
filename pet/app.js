//app.js
const config = require("/utils/config.js");
App({
  onLaunch: function () {
    console.log("当前路径：" + config.URL_Service);
  },
  globalData: {

    /** =========== 用户数据 =========== */
    userInfo: {
      customerNo: null, // id
      nickName: null, // 昵称
      avatarUrl: null, // 头像
      gender: null, // 性别
      openid: null, // openId
      phone: null, // 手机号
      role: null, // 角色
    }, // 用户信息
  },
})
