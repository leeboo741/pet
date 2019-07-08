/**
 * ******** 首页 ********
 * ===================================================================================================================================
 * 在这个页面完成 输入寄宠人信息，收宠人信息
 * 预订之后直接付款
 * ===================================================================================================================================
 */

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      indexData: {
        bannerData: [
          { 
            imgPath: 'http://m.qpic.cn/psb?/55b157ad-c1d7-41ef-b0eb-20021a2e67e2/zo.Rfs4Kw9UlXZ0V0fqgjL8DF5H6qIMz.29OBpM5Xo4!/b/dL8AAAAAAAAA&bo=0AfoAwAAAAADZ34!&rf=viewer_4' 
          },
          { 
            imgPath: 'http://m.qpic.cn/psb?/55b157ad-c1d7-41ef-b0eb-20021a2e67e2/dOSLz.X5GAPLTq4vb8T4CHUeF*gx6PliDOCvchSmaY0!/b/dLgAAAAAAAAA&bo=aQg4BAAAAAADZx8!&rf=viewer_4' 
          }, 
          {
            imgPath: 'http://m.qpic.cn/psb?/55b157ad-c1d7-41ef-b0eb-20021a2e67e2/QpF4IFjYAVIv5DDWpEPieurahaPfZaXQMKIfv37wOgc!/b/dLYAAAAAAAAA&bo=bQg4BAAAAAADZxs!&rf=viewer_4'
          }
        ]
      }
  },
  
  /* =========================== 生命周期管理 Start ================================ */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  },

  /* =========================== 生命周期管理 End ================================ */

  /* =========================== 点击事件 Start ================================ */

  /**
   * 宠物集市
   */
  gotoPetMarket: function() {
    wx.navigateTo({
      url: '../petmarket/petmarket',
    })
  },

  /**
   * 点击Banner
   */
  tapBannerAction: function(){

  },

  /**
   * 跳转宠物托运
   */
  gotoConsigned: function() {
    wx.navigateTo({
      url: '../consigned/base/base'
    });
  },
  /**
   * 跳转个人中心
   */
  gotoUserInfo: function() {
    wx.navigateTo({
      url: '../me/me'
    })
  }

  /* =========================== 点击事件 End ================================ */
  
})