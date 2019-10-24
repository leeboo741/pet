// pages/orderDetail/orderDetail.js
const app = getApp();
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const util = require("../../utils/util.js");
const ShareUtil = require("../../utils/shareUtils.js");

var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: null,
    userInfo: null,
    remarksInput: null,
    type: 0,  // 0 自有单据 1 工作单据
    orderNo: null,
    ablePremium: false, // 是否允许补价
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderNo = options.orderno;
    qqmapsdk = new QQMapWX({
      key: config.Key_QQ_Map
    });

    this.setData({
      type: options.type,
      userInfo: loginUtil.getUserInfo(),
      ablePremium: options.ablepremium==1? true: false
    })
    this.requestOrderDetail(this.data.orderNo)
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
    console.log("/orderdetail/orderdetail 销毁")
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
   * 点击图片
   */
  tapImage: function (e) {
    let tempOrder = this.data.orderData.orderStates[e.currentTarget.dataset.stepindex];
    let tempOrderImageList = [];
    for (let i = 0; i < tempOrder.pictureList.length; i++) {
      let tempOrderImage = tempOrder.pictureList[i];
      tempOrderImageList.push(tempOrderImage.viewAddress);
    }
    let currrentUrl = e.currentTarget.dataset.imageurl;
    wx.previewImage({
      urls: tempOrderImageList,
      current: currrentUrl
    })
  },

  /**
   * 请求订单详情
   */
  requestOrderDetail: function(orderNo) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_OrderDetail,
      data: {
        "orderNo": orderNo,
        "openId": loginUtil.getOpenId()
      },
      success (res) {
        console.log("获取订单详情 success：\n" + JSON.stringify(res));
        if (res.data.root != null && res.data.prompt == "Success") {
          that.setData({
            orderData: res.data.root
          })
        } else {

        }
      },
      fail(res) {
        console.log("获取订单详情 fail：\n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: "none"
        })
      },
      complete(res) {
        console.log("获取订单详情 complete：\n" + JSON.stringify(res));
        wx.hideLoading();
      },

    })
  },

  /**
   * 提交备注输入
   */
  requestPostOrderRemark: function (remark) {
    let that = this;
    wx.showLoading({
      title: '请稍等',
    })
    wx.request({
      url: config.URL_Service + config.URL_PostOrderRemark,
      data: {
        order: {
          orderNo: this.data.orderData.orderNo
        },
        staff: loginUtil.getUserInfo(),
        remarks: remark
      },
      method: 'POST',
      success(res){
        console.log("新增备注 success:\n" + JSON.stringify(res));
        if (res.data.code == 200 && res.data.data > 0) {
          wx.showToast({
            title: '新增成功',
          })
          if (that.data.orderData.orderRemarksList == null) {
            that.data.orderData.orderRemarksList = [];
          }
          that.data.orderData.orderRemarksList.push({remarks: remark})
          that.setData({
            orderData: that.data.orderData,
            remarksInput: null
          })
        } else {

          wx.showToast({
            title: '新增备注失败',
            icon: 'none'
          })
        }
      }, 
      fail(res) {
        console.log("新增备注 fail:\n" + JSON.stringify(res));
        wx.showToast({
          title: '网络波动，新增备注失败',
          icon:'none'
        })
      },
      complete(res){
        wx.hideLoading();
      }
    })
  },

  /**
   * 确认输入
   */
  confirmRemarkInput: function(){
    if (util.checkEmpty(this.data.remarksInput)) {
      return;
    }
    this.requestPostOrderRemark(this.data.remarksInput);
  },

  /**
   * 获取输入
   */
  inputRemark: function(e){
    this.data.remarksInput = e.detail.value
  },

  /**
   * 拨打电话
   */
  callPhone: function(e) {
    let phoneNumber = e.currentTarget.dataset.phone;
    if (util.checkEmpty(phoneNumber)) {
      return;
    }
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
    })
  },

  /**
   * 导航
   */
  tapToNavigation: function (e) {
    let targetAddress = e.currentTarget.dataset.address;
    if (util.checkEmpty(targetAddress)) {
      return;
    }
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: targetAddress, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //根据地址解析在地图上标记解析地址位置
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
        wx.hideLoading();
      }
    })
  },

  /**
   *  点击 支付 补价 
   */
  tapPayPremium: function (e) {
    let billNo = e.currentTarget.dataset.billno;
    this.requestPayPremium(billNo);
  },

  /**
   * 请求支付
   */
  requestPayPremium: function(billNo) {
    wx.showLoading({
      title: '支付中...',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_PayPremium,
      data: {
        billNo: billNo,
        openId: loginUtil.getOpenId()
      },
      success(res) {
        wx.hideLoading();
        console.log("支付补价 success: \n" + JSON.stringify(res));
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          success(res) {
            that.requestOrderDetail(that.data.orderNo)
          },
          fail(res) {
            wx.showToast({
              title: '支付失败,请稍后重试',
              icon: 'none'
            })
          }
        })
      },
      fail(res) {
        wx.hideLoading();
        console.log("支付补价 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '网络原因,支付失败',
          icon: 'none'
        })
      },
    })
  }
})