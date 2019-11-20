// pages/goAboard/goAboard.js

const app = getApp();
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const ShareUtil = require("../../utils/shareUtils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    beginCity: null, // 寄宠城市
    targetCountry: null, // 到达国家
    selectOutDate: null, // 出境时间

    petType: null, // 宠物类型
    petTypeList: null, // 宠物类型列表
    petClassify: null, // 宠物品种
    petClassifyList: null, // 宠物品种列表
    petSex: null, // 宠物性别
    petColor: null, // 宠物颜色
    birthDay: null, // 宠物出生日期
    petCode: null, // 宠物芯片号
    vaccineDate: null, // 宠物狂犬疫苗注射日期

    name: null, // 主人姓名
    phone: null, // 主人电话
    address: null, // 主人通讯地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestPetType();
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
    // 接受 城市选择页面 返回数据
    if (app.globalData.trainBeginCity != null) {
      this.setData({
        beginCity: app.globalData.trainBeginCity, // 设置始发城市
      })
      app.globalData.trainBeginCity = null;
    }
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
    return ShareUtil.getOnShareAppMessageForShareOpenId();
  },

  /**
   * 请求宠物类型
   */
  requestPetType: function () {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    let urlstr = config.URL_Service + config.URL_PetType;
    // 向服务器请求登陆，返回 本微信 在服务器状态，注册|未注册，
    wx.request({
      url: urlstr, // 服务器地址
      success: res => {
        wx.hideLoading();
        console.log("success => " + JSON.stringify(res));
        if (res.data.code == config.RES_CODE_SUCCESS) {
          that.setData({
            petTypeList: res.data.data
          })
        } else {
          wx.showToast({
            title: '查询宠物类型失败',
            icon: 'none',
          })
        }
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '查询宠物类型失败',
          icon: 'none',
        })
      },
      complete(res) {
      },
    })
  },

  /**
   * 请求宠物种类
   */
  requestPetClassify: function (currentType) {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    let urlstr = config.URL_Service + config.URL_PetClassify;
    // 向服务器请求登陆，返回 本微信 在服务器状态，注册|未注册，
    wx.request({
      url: urlstr, // 服务器地址
      data: {
        "petTypeName": currentType
      },
      success: res => {
        wx.hideLoading();
        console.log("success => " + JSON.stringify(res));
        if (res.data.code == config.RES_CODE_SUCCESS) {
          let tempList = [];
          for (let i = 0; i < res.data.data.length; i++) {
            tempList[i] = res.data.data[i].petClassifyName;
          }
          that.setData({
            petClassifyList: tempList
          })
        } else {
          wx.showToast({
            title: '查询宠物类型失败',
            icon: 'none',
          })
        }
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '查询宠物类型失败',
          icon: 'none',
        })
      },
      complete(res) {
      },
    })
  },

  /**
   * 输入到达国家
   */
  inputTargetCountry: function (e) {
    this.setData({
      targetCountry: e.detail.value
    })
  },

  /**
   * 选择出境时间
   */
  selectAboardDate: function (e) {
    this.setData({
      selectOutDate: e.detail.value
    })
  },

  /**
   * 选择宠物类型
   */
  selectPetType: function (e) {
    let selectType = this.data.petTypeList[e.detail.value];
    if (this.data.petType != selectType) {
      this.setData({
        petType: selectType,
        petClassifyList: null,
        petClassify: null
      })
      this.requestPetClassify(selectType)
    }
  },

  /**
   * 选择宠物品种
   */
  selectPetClassify: function(e) {
    this.setData({
      petClassify: this.data.petClassifyList[e.detail.value]
    })
  },

  /**
   * 选择宠物性别
   */
  selectPetSex: function () {
    let itemList = ["公", "母"];
    let that = this;
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        console.log(res.tapIndex)
        that.setData({
          petSex: itemList[res.tapIndex]
        })
      },
    })
  },

  /**
   * 输入宠物颜色
   */
  inputPetColor: function (e) {
    this.setData({
      petColor: e.detail.value
    })
  },

  /**
   * 选择宠物生日
   */
  selectBirthday: function (e) {
    this.setData({
      birthDay: e.detail.value
    })
  },

  /**
   * 输入宠物芯片号
   */
  inputPetCode: function (e) {
    this.setData({
      petCode: e.detail.value
    })
  },

  /**
   * 选择狂犬疫苗注射日期
   */
  selectVaccineDate: function (e) {
    this.setData({
      vaccineDate: e.detail.value
    })
  },

  /**
   * 输入名称
   */
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  /**
   * 输入电话
   */
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 输入通讯地址
   */
  inputAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  /**
   * 点击提交
   */
  tapCommitOrder: function () {
    console.log("提交出国订单：\n" + JSON.stringify(this.data))
  }
})