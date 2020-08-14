// pages/unPayWork/index.js
const util = require("../../utils/util.js");
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const pagePath = require("../../utils/pagePath.js");
const ShareUtil = require("../../utils/shareUtils.js");
const workOrderManager = require("../../manager/orderManager/workOrderManager.js");

const app = getApp();

const Limit = 20;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], // 订单列表
    userInfo: null,
    loadMoreLoading: false,
    loadMoreTip: "暂无数据",
    offset: 0,
    keyword: null,
    orderDate: null,
    orderStateList: [
      config.Order_State_ToPay, // 待付款
      config.Order_State_ToVerify // 待审核
    ], // 订单状态列表
    currentOrderState: "全部", // 当前订单状态
  },

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
    app.globalData.verifyPaymentVoucherOrder = null;
    wx.startPullDownRefresh();
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

    console.log("/unpaywork/index 销毁")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.offset = 0;
    let that = this; 
    this.setData({
      loadMoreLoading: true,
      loadMoreTip: "数据加载中"
    })
    this.getOrderData(this.data.offset,
      function getDataCallback(data){
        that.setData({
          orderList: data
        })
        that.data.offset = that.data.offset + Limit;
        that.setData({
          loadMoreLoading: false,
        })
        if (data.length >= Limit) {
          that.setData({
            loadMoreTip: "上拉加载数据"
          })
        } else if (data.length < Limit && data.length > 0) {
          that.setData({
            loadMoreTip: "已经到底了"
          })
        } else {
          that.setData({
            loadMoreTip: "暂无数据"
          })
        }
        wx.stopPullDownRefresh();
      }
    );
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.loadMoreTip == "已经到底了"
      || this.data.loadMoreTip == "数据加载中"
      || this.data.loadMoreTip == "暂无数据") {
      return;
    }
    this.setData({
      loadMoreTip: "数据加载中",
    })
    let that = this;
    this.getOrderData(this.data.offset,
      function getDataCallback(data){
        let tempList = that.data.orderList.concat(data);
        that.setData({
          orderList: tempList
        })
        that.data.offset = that.data.offset + Limit;
        that.setData({
          loadMoreLoading: false,
        })
        if (data.length >= Limit) {
          that.setData({
            loadMoreTip: "上拉加载数据"
          })
        } else {
          that.setData({
            loadMoreTip: "已经到底了"
          })
        }
      }
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    return ShareUtil.getOnShareAppMessageForShareOpenId();
  },

  /**
   * 输入关键字
   */
  searchInput: function(e) {

  },

  /**
   * 点击确认输入搜索
   * @param {*}} e 
   */
  searchOrder: function(e) {
    this.data.keyword = e.detail.value;
    wx.startPullDownRefresh();
  },

  /**
   * 点击选择状态
   */
  tapStateFilter: function() {
    let that = this;
    wx.showActionSheet({
      itemList: ['全部','待付款','待审核'],
      success(res) {
        if (res.tapIndex == 0) {
          that.changeCurrentOrderState("全部");
        } else if (res.tapIndex == 1) {
          that.changeCurrentOrderState(config.Order_State_ToPay);
        } else if (res.tapIndex == 2) {
          that.changeCurrentOrderState(config.Order_State_ToVerify);
        }
      }
    })
  },

  /**
   * 更改当前订单状态
   */
  changeCurrentOrderState: function(state) {
    this.setData({
      currentOrderState : state
    })
    if (state != config.Order_State_ToPay && state != config.Order_State_ToVerify) {
      this.data.orderStateList = [
        config.Order_State_ToPay,
        config.Order_State_ToVerify
      ];
    } else {
      this.data.orderStateList = [state];
    }
    wx.startPullDownRefresh();
  },

  /**
   * 获取数据
   */
  getOrderData: function (offset, getDataCallback) {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        if (util.checkEmpty(that.data.userInfo)) {
          that.setData({
            userInfo: loginUtil.getUserInfo()
          })
        }
        that.requestOrderList(offset,
          function callback(data) {
            if (getDataCallback && typeof getDataCallback == "function") {
              getDataCallback(data);
            }
          }
        );
      }
    })
  },

  /**
   * 请求单据
   */
  requestOrderList: function (offset, getOrderDataCallback) {
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_Order_Station_All,
      data: {
        stationNo: loginUtil.getStationNo(),
        state: this.data.orderStateList,
        offset: offset,
        limit: Limit,
        keyword: this.data.keyword,
        orderDate: this.data.orderDate
      },
      success(res) {
        console.log("请求未付单据 success：\n" + JSON.stringify(res));
        if (res.data.code == config.RES_CODE_SUCCESS) {
          wx.hideLoading();
          if (getOrderDataCallback && typeof getOrderDataCallback == "function") {
            getOrderDataCallback(res.data.data);
          } 
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("请求未付单据 fail：\n" + JSON.stringify(res));
        wx.showToast({
          title: "系统异常",
          icon: 'none'
        })
      },
      complete(res) {
        console.log("请求未付单据 complete：\n" + JSON.stringify(res));
        wx.stopPullDownRefresh();
      },
    })
  },

  /**
   * 拨打电话
   */
  callPhone: function (e) {
    let phoneNumber = e.currentTarget.dataset.phone;
    if (util.checkEmpty(phoneNumber)) {
      return;
    }
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
    })
  },

  /**
   * 点击删除订单
   * @param {*} e 
   */
  tapDeleteOrder: function(e) {
    let that = this;
    wx.showModal({
      title: '删除订单',
      content: '确认删除订单:' + e.currentTarget.dataset.orderno,
      confirmText: '删除',
      cancelText: '放弃',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍等...',
          })
          workOrderManager.deleteOrder(e.currentTarget.dataset.orderno, function(success, data) {
            wx.hideLoading()
            if (success) {
              wx.showToast({
                title: '删除成功',
              })
              that.data.orderList.splice(e.currentTarget.dataset.tapindex, 1);
              that.setData({
                orderList: that.data.orderList
              })
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  /**
   * 点击订单详情
   */
  tapOrderDetail: function(e) {

    wx.navigateTo({
      url: pagePath.Path_Order_Detail + '?orderno=' + e.currentTarget.dataset.orderno + '&type=1',
    })
  },

  /**
   * 审核待审核
   * @param {*} e 
   */
  tapVerify: function(e) {
    let index = e.currentTarget.dataset.tapindex;
    app.globalData.verifyPaymentVoucherOrder = this.data.orderList[index];
    wx.navigateTo({
      url: pagePath.Path_Order_VerifyPaymentVoucher,
    })
  },

  /**
   * 输入金额
   */
  inputTargetAmount: function(e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    tempOrder.targetAmount = e.detail.value
  },

  /**
   * 确认改价
   */
  tapChangeAmount: function(e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    let targetAmount = tempOrder.targetAmount;
    if (util.checkEmpty(targetAmount)) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
      return;
    }
    let targetOrderNo = tempOrder.orderNo;
    let that = this;
    wx.showModal({
      title: '确认修改',
      content: '确认修改订单：'+targetOrderNo+"价格",
      success(res){
        if (res.confirm) {
          
          wx.showLoading({
            title: '请稍等',
          })
          wx.request({
            url: config.URL_Service + config.URL_ChangeOrderPrice,
            data: {
              orderNo: targetOrderNo,
              paymentAmount: targetAmount
            },
            method: "PUT",
            success(res) {
              console.log("确认改价 success: \n" + JSON.stringify(res));
              if (res.data.code == config.RES_CODE_SUCCESS && res.data.data > 0) {
                tempOrder.paymentAmount = targetAmount;
                tempOrder.targetAmount = null;
                that.setData({
                  orderList: that.data.orderList
                })
                wx.showToast({
                  title: '改价成功',
                  duration: 1500
                })
              } else {
                wx.showToast({
                  title: '改价失败',
                  icon: 'none'
                })
              }
            },
            fail(res) {
              console.log("确认改价 fail: \n" + JSON.stringify(res));
              wx.showToast({
                title: '系统异常',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  }
})