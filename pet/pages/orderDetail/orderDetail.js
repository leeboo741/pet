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
    ableCancelPremium: true, // 是否允许取消补价
    showConfirmButton: false, // 是否展示签收按钮

    backTimeIntervial: null,
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
      ablePremium: options.ablepremium==1? true: false,
      ableCancelPremium: options.ablecancelpremium==0? false: true
    })
    this.requestOrderDetail(this.data.orderNo)
    let that = this;
    this.requestCheckConfirm(this.data.orderNo, loginUtil.getCustomerNo(),
      function getResultCallback(data) {
        console.log("是否可以确认签收 :\n" + JSON.stringify(data));
        if (data == 0) {
          
        } else {
          that.setData({
            showConfirmButton: true
          })
        }
      }
    )
  },

  /**
   * 收货请求
   */
  requestRecieve: function (orderNo) {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      url: config.URL_Service + config.URL_ConfirmOrder,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST", // 请求方式
      data: {
        orderNo: orderNo,
        openId: loginUtil.getOpenId()
      },
      success(res) {
        wx.hideLoading();
        console.log("确认收货 success: \n" + JSON.stringify(res));
        if (res.data.code == config.RES_CODE_SUCCESS) {
          wx.showToast({
            title: '收货成功',
            duration: 1500,
          })
          that.data.backTimeIntervial = setTimeout(
            function back(res) {
              wx.navigateBack({
                
              })
            },
            1600
          )
        } else {
          wx.showToast({
            title: '签收失败',
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.hideLoading();
        console.log("确认收货 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: "none"
        })
      },
      complete(res) {
        console.log("确认收货 complete: \n" + JSON.stringify(res));
      },

    })
  },

  /**
   * 点击签收
   */
  tapConfirmOrder: function() {
    let that = this;
    wx.showModal({
      title: '确认签收',
      content: '确认签收订单：' + this.data.orderNo,
      confirmText: "确认签收",
      cancelText: "暂不签收",
      success(res) {
        if (res.confirm) {
          that.requestRecieve(that.data.orderNo);
        }
      }
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
    console.log("/orderdetail/orderdetail 销毁")
    clearTimeout(this.data.backTimeIntervial);
    this.data.backTimeIntervial = null;
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
        if (res.data.data != null && res.data.code == config.RES_CODE_SUCCESS) {
          that.setData({
            orderData: res.data.data
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
        if (res.data.code == config.RES_CODE_SUCCESS && res.data.data > 0) {
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
   * 查询是否可以收货
   */
  requestCheckConfirm: function (orderNo, customerNo, getResultCallback) {
    wx.request({
      url: config.URL_Service + config.URL_CheckConfirm,
      data: {
        orderNo: orderNo,
        customerNo: customerNo
      },
      success(res) {
        if (res.data.code == config.RES_CODE_SUCCESS) {
          if (getResultCallback != null && typeof getResultCallback == 'function') {
            getResultCallback(res.data.data)
          }
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '系统异常',
          icon: 'none'
        })
      },
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
   * 点击 取消 补价
   */
  tapCancelPremium: function(e) {
    let billNo = e.currentTarget.dataset.billno;
    this.requestCancelPremium(billNo);
  },

  /**
   * 请求取消 补价
   */
  requestCancelPremium: function(billNo) {
    wx.showLoading({
      title: '取消中',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_CancelPremium,
      data: billNo,
      method:"PUT",
      success(res) {
        wx.hideLoading();
        console.log("取消补价单 success:\n" + JSON.stringify(res));
        if (res.data.code != config.RES_CODE_SUCCESS){
          wx.showToast({
            title: '取消补价单失败',
            icon: 'none'
          })
        } else {
          that.requestOrderDetail(that.data.orderNo)
        }
      },
      fail(res) {
        wx.hideLoading();
        console.log("取消补价单 fail:\n" + JSON.stringify(res));
        wx.showToast({
          title: '系统异常',
          icon: 'none'
        })
      }
    })
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