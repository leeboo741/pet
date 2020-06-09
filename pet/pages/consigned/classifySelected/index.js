// pages/consigned/classifySelected/index.js
const UrlPath = require("../../../utils/config.js");
const Config = require("../../../utils/config.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchResultList:[], // 搜索结果列表
    inputTimer: null, // 请求定时器
    searchword: '', // 搜索关键字

    keyboardHeight: 0, // 键盘弹起高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.onKeyboardHeightChange((result) => {
      console.log(result.height);
      that.setData({
        keyboardHeight: result.height
      })
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
    clearTimeout(this.data.inputTimer);
    this.data.inputTimer == null;
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

  /**
   * 点击宠物品种
   */
  tapClassifyItemAction: function(classifyItem) {
    let index = classifyItem.currentTarget.dataset.index;
    let classify = this.data.searchResultList[index];
    app.globalData.selectClassifyName = classify.petGenreName;
    wx.navigateBack({
      
    })
  },

  /**
   * 输入框输入
   */
  inputSearchword: function (inputTextView) {
    this.data.inputSearchword = inputTextView.detail.value;
    if (this.data.inputTimer != null) {
      clearTimeout(this.data.inputTimer);
    }
    let that = this;
    this.data.inputTimer = setTimeout(function(){
      that.requestPetClassifyBySearchword(that.data.inputSearchword);
    },250);
  },

  /**
   * 点击确定按钮
   */
  confirmInput: function () {
    app.globalData.selectClassifyName = this.data.inputSearchword;
    wx.navigateBack({

    })
  },

  /**
   * 请求宠物品种列表
   */
  requestPetClassifyBySearchword: function(searchword){
    let that = this;
    wx.request({
      url: UrlPath.URL_Service + UrlPath.URL_GetPetClassifyListByKeyword + searchword,
      success(res) {
        if (res.data.code == Config.RES_CODE_SUCCESS) {
          that.setData({
            searchResultList: res.data.data
          })
        }
      },
    })
  }
})