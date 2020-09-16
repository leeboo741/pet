// pages/orderDetail/workOrderDetail/index.js

var QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
const pagePath = require("../../../utils/pagePath");
const loginUtils = require('../../../utils/loginUtils.js');
const shareUtils = require('../../../utils/shareUtils.js');
const commonOrderManager = require('../../../manager/orderManager/commonOrderManager.js');
const workOrderManager = require('../../../manager/orderManager/workOrderManager.js');
const util = require('../../../utils/util.js');
const config = require('../../../utils/config.js');
const app = getApp();
const notificationCenter = require("../../../manager/notificationCenter");
const { Order_State_ToPay, Order_State_ToPack, Order_State_ToInPort, Order_State_ToOutPort, Order_State_ToArrived, Order_State_Delivering, Order_State_ToSign, Order_State_Completed } = require('../../../utils/config.js');
const { WORKORDER_ADD_REMARK, WORKORDER_CHANGE_PRICE, WORKORDER_UPLOAD_PAYMENT_VOUCHER, WORKORDER_ADD_PREMIUM, WORKORDER_REFUND, WORKORDER_ALLOCATION, WORKORDER_ADD_TEMPDELIVER, WORKORDER_PACKING, WORKORDER_INPORT, WORKORDER_OUTPORT, WORKORDER_SIGNIN, WORKORDER_DELETE, WORKORDER_UPLOADFILE } = require('../../../static/notificationName.js');

const Order_Operate_Color_1 = "goldenrod";
const Order_Operate_Color_2 = "#2d8cf0";
const Order_Operate_Color_3 = "#ee2c2c";

/**
 * 订单操作对象
 */
class OrderOperate{
  /**
   * 
   */
  constructor(name, color, func) {
    this.name = name;
    this.color = color;
    this.func = func;
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: null,
    userInfo: null,
    showMoreButton: true,
    showMoreList: false,
    operateList: null,

    // 打印
    services: [], // 链接的 蓝牙设备 服务列表
    serviceId: 0, // 可用 服务 id
    writeCharacter: false, // 是否查到 写入 服务
    readCharacter: false, // 是否查到 读取 服务
    notifyCharacter: false, // 是否查到 通知 服务
  },

  /**==================================== 页面事件 start =========================================== */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: config.Key_QQ_Map
    });
    this.setData({
      userInfo: loginUtils.getUserInfo(),
    })
    this.requestOrderDetail(options.orderno)
    this.addNotificationObserver();
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
    app.globalData.workOrder = null;
    app.ShareData.scanOrderNo = null;
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
    this.removeNotificationObserver();
  },

  onPageScroll: function(e) {
    this.setData({
      showMoreList: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return shareUtils.getOnShareAppMessageForShareOpenId();
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
   * 点击提货地址
   */
  tapTakeAddress: function(e) {
    wx.openLocation({
      latitude: this.data.orderData.orderTakeDetail.latitude,
      longitude: this.data.orderData.orderTakeDetail.longitude,
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
        util.printLog(res);
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
        util.printLog(res);
        wx.hideLoading();
      }
    })
  },

  /**
   * 点击 取消 补价
   */
  tapCancelPremium: function(e) {
    let billNo = e.currentTarget.dataset.billno;
    this.requestCancelPremium(billNo);
  },

  /**
   * 点击打印
   */
  tapPrint: function() {
    this.setData({
      showMoreList: false
    })
    this.startPrint(this.data.orderData);
  },

  /**
   * 点击备注
   */
  tapRemark: function() {
    this.setData({
      showMoreList: false
    })
    app.globalData.workOrder = this.data.orderData;
    wx.navigateTo({
      url: '/pages/orderDetail/workOrderDetail/newRemark/index',
    })
  },

  /**
   * 点击更多工作
   */
  tapMore: function() {
    this.setData({
      showMoreList: !this.data.showMoreList
    })
  },

  /**
   * 点击更多工作item
   * @param {*} e 
   */
  tapOperate: function(e) {
    let operate = this.data.operateList[e.currentTarget.dataset.index];
    operate.func();
    this.setData({
      showMoreList: false
    })
  },
  /**==================================== 页面事件 end =========================================== */

  /**==================================== 打印 start =========================================== */
  /**
   * 开始打印
   */
  startPrint: function (orderItem) {
    let that = this;
    app.globalData.printOrder = orderItem;
    if (util.checkEmpty(app.BLEInformation.deviceName)) {
      wx.navigateTo({
        url: pagePath.Path_Print_Search,
      })
    } else {
      // 重置状态
      that.setData({
        serviceId: 0,
        writeCharacter: false,
        readCharacter: false,
        notifyCharacter: false
      })
      util.printLog(app.BLEInformation.deviceId)
      wx.showLoading({
        title: '正在连接',
      })
      // 链接蓝牙设备
      wx.createBLEConnection({
        deviceId: app.BLEInformation.deviceId,
        // 链接成功
        success: function (res) {
          util.printLog(res)
          // 获取蓝牙设备 服务 service id
          that.getSeviceId()
        },
        // 链接失败
        fail: function (e) {
          wx.showModal({
            title: '提示',
            content: '连接失败',
            confirmText: "重选打印机",
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: pagePath.Path_Print_Search,
                })
              }
            }
          })
          util.printLog(e)
          wx.hideLoading()
        },
        // 链接完成
        complete: function (e) {
          util.printLog(e)
        }
      })
    }
  },

  /**
   * 获取 蓝牙设备 service 服务 id
   */
  getSeviceId: function () {
    var that = this
    var platform = app.BLEInformation.platform
    util.printLog(app.BLEInformation.deviceId)
    // 获取蓝牙设备所有service(服务)
    wx.getBLEDeviceServices({
      deviceId: app.BLEInformation.deviceId,
      success: function (res) {
        util.printLog(res)
        that.setData({
          services: res.services
        })
        // 获取蓝牙设备 特征值 信息
        that.getCharacteristics()
      }, fail: function (e) {
        wx.showToast({
          title: '获取蓝牙设备失败',
          icon: 'none'
        })
        util.printLog(e)
      }, complete: function (e) {
        util.printLog(e)
      }
    })
  },

  /**
   * 获取蓝牙设备 特征值 信息
   */
  getCharacteristics: function () {
    var that = this
    var list = that.data.services // 服务
    var num = that.data.serviceId // 服务id(index) 0
    var write = that.data.writeCharacter // 写入服务以获取 false
    var read = that.data.readCharacter // 读取服务以获取 false
    var notify = that.data.notifyCharacter // 通知服务以获取 false
    // 获取蓝牙设备 特征值 信息
    wx.getBLEDeviceCharacteristics({
      deviceId: app.BLEInformation.deviceId,
      serviceId: list[num].uuid,
      success: function (res) {
        util.printLog(res)
        // 循环 服务 service 特征值
        for (var i = 0; i < res.characteristics.length; ++i) {
          // 服务 特征值 属性列表
          var properties = res.characteristics[i].properties
          // 服务 特征值 uuid
          var item = res.characteristics[i].uuid
          // 如果通知服务未获取 判断 特征值 是否 可通知
          if (!notify) {
            // 如果可通知 记录下来
            if (properties.notify) {
              app.BLEInformation.notifyCharaterId = item // 特征值 id
              app.BLEInformation.notifyServiceId = list[num].uuid // 服务id
              notify = true // 通知服务已获取
            }
          }
          // 如果写入服务未获取 判断 特征值 是否 可写入
          if (!write) {
            // 如果可写入 记录下来
            if (properties.write) {
              app.BLEInformation.writeCharaterId = item // 特征值 id
              app.BLEInformation.writeServiceId = list[num].uuid // 服务id
              write = true // 写入服务已获取
            }
          }
          // 如果读取服务未获取 判断 特征值 是否 可读取
          if (!read) {
            // 如果可读取 记录下来
            if (properties.read) {
              app.BLEInformation.readCharaterId = item // 特征值 id
              app.BLEInformation.readServiceId = list[num].uuid // 服务id
              read = true // 读取服务已获取
            }
          }
        } // 结束循环
        // 是否 写入 读取 通知 同时通过
        // 如果通过 进入打印页面
        // 如果没通过 查下一个服务
        // 如果没通过 并且没有下一服务 弹窗提示
        if (!write || !notify || !read) {
          // 要查询的 服务index + 1
          num++
          that.setData({
            writeCharacter: write,
            readCharacter: read,
            notifyCharacter: notify,
            serviceId: num
          })
          // 如果 已经全部服务 都已经查过了 还是没法 成立 通知外部
          // 如果 没有查询完成全部 服务 ，继续查询
          if (num == list.length) {
            wx.showModal({
              title: '提示',
              content: '找不到该读写的特征值',
            })
          } else {
            that.getCharacteristics()
          }
        } else {
          that.openControl()
        }
      }, fail: function (e) {
        wx.showToast({
          title: '获取特征值失败',
          icon: 'none'
        })
        util.printLog(e)
      }, complete: function (e) {
        util.printLog("write:" + app.BLEInformation.writeCharaterId)
        util.printLog("read:" + app.BLEInformation.readCharaterId)
        util.printLog("notify:" + app.BLEInformation.notifyCharaterId)
      }
    })
  },

  /**
   * 打开打印页面
   */
  openControl: function () {
    wx.navigateTo({
      url: pagePath.Path_Print_Print,
    })
  },
  /**==================================== 打印 end =========================================== */

  /**==================================== 私有方法 start =========================================== */
  /**
   * 添加通知监听
   */
  addNotificationObserver: function() {
    let that = this;
    // 新增备注
    notificationCenter.addNormalNotificationObserver(WORKORDER_ADD_REMARK, function(info){
      if (that.data.orderData.orderRemarksList == null) {
        that.data.orderData.orderRemarksList = [];
      }
      that.data.orderData.orderRemarksList.push({remarks: info})
      that.setData({
        orderData: that.data.orderData,
      })
      that.getOperateList();
    },this)
    // 修改价格
    notificationCenter.addNormalNotificationObserver(WORKORDER_CHANGE_PRICE, function(price){
      that.data.orderData.paymentAmount = price;
      that.setData({
        orderData: that.data.orderData
      })
    }, this);
    // 上传付款凭证
    notificationCenter.addNormalNotificationObserver(WORKORDER_UPLOAD_PAYMENT_VOUCHER, function(){
      wx.navigateBack();
    },this);
    // 新增补价单
    notificationCenter.addNormalNotificationObserver(WORKORDER_ADD_PREMIUM, function(){
      that.requestOrderDetail(that.data.orderData.orderNo);
    },this);
    // 退款
    notificationCenter.addNormalNotificationObserver(WORKORDER_REFUND, function(){
      that.requestOrderDetail(that.data.orderData.orderNo);
    },this);
    // 分配订单
    notificationCenter.addNormalNotificationObserver(WORKORDER_ALLOCATION, function(){
      that.requestOrderDetail(that.data.orderData.orderNo);
    },this)
    // 新增临派
    notificationCenter.addNormalNotificationObserver(WORKORDER_ADD_TEMPDELIVER, function() {
      that.requestOrderDetail(that.data.orderData.orderNo);
    },this);
    // 揽件
    notificationCenter.addNormalNotificationObserver(WORKORDER_PACKING, function() {
      that.requestOrderDetail(that.data.orderData.orderNo, function(success) {
        if (success) {
          setTimeout(function(){
            wx.showModal({
              title: '是否打印标签',
              content: '立即打印，也可稍后自行选择单据打印',
              confirmText: '打印',
              success(res){
                if (res.confirm){
                  that.startPrint(order);
                }
              }
            })
          },0)
        }
      });
    },this);
    // 入港
    notificationCenter.addNormalNotificationObserver(WORKORDER_INPORT, function(){
      that.requestOrderDetail(that.data.orderData.orderNo);
    },this);
    // 出港
    notificationCenter.addNormalNotificationObserver(WORKORDER_OUTPORT, function(){
      wx.navigateBack();
    },this)
    // 签收
    notificationCenter.addNormalNotificationObserver(WORKORDER_SIGNIN, function() {
      wx.navigateBack();
    },this);
    // 文件资源池上传
    notificationCenter.addNormalNotificationObserver(WORKORDER_UPLOADFILE, function() {
      that.requestOrderDetail(that.data.orderData.orderNo);
    },this)
  },

  /**
   * 移除通知监听
   */
  removeNotificationObserver: function() {
    // 新增备注
    notificationCenter.removeNotificationObserver(WORKORDER_ADD_REMARK, this);
    // 修改价格
    notificationCenter.removeNotificationObserver(WORKORDER_CHANGE_PRICE, this);
    // 上传付款凭证
    notificationCenter.removeNotificationObserver(WORKORDER_UPLOAD_PAYMENT_VOUCHER, this);
    // 新增补价单
    notificationCenter.removeNotificationObserver(WORKORDER_ADD_PREMIUM, this);
    // 退款
    notificationCenter.removeNotificationObserver(WORKORDER_REFUND, this);
    // 新增临时派送单
    notificationCenter.removeNotificationObserver(WORKORDER_ADD_TEMPDELIVER, this);
    // 揽件
    notificationCenter.removeNotificationObserver(WORKORDER_PACKING, this);
    // 入港
    notificationCenter.removeNotificationObserver(WORKORDER_INPORT, this);
    // 出港
    notificationCenter.removeNotificationObserver(WORKORDER_OUTPORT, this);
    // 签收
    notificationCenter.removeNotificationObserver(WORKORDER_SIGNIN, this);
    // 文件资源池上传
    notificationCenter.removeNotificationObserver(WORKORDER_UPLOADFILE, this);
  },

  /**
   * 删除订单
   * @param {string} orderNo 订单编号
   */
  deleteOrder: function(orderNo) { 
    let that = this;
    wx.showModal({
      title: '删除订单',
      content: '确认删除订单:' + orderNo,
      confirmText: '删除',
      cancelText: '放弃',
      success(res) {
        if (res.confirm) {
          that.requestDeleteOrder(orderNo);
        }
      }
    })
  },

  /**
   * 上传付款凭证
   */
  uploadVerify: function() {
    let that = this;
    if (this.data.orderData.confirmationRegulation == 0) {
      wx.showModal({
        title: '客户未确认条款!',
        content: '请先提醒客户确认订单条款',
        showCancel: false,
      })
      return;
    }
    wx.showModal({
      title: '是否确认客户已付款!',
      content: '请确认客户是否已付款至站点账户!',
      cancelText: '取消',
      confirmText: '已付款',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: pagePath.Path_Me_PaymentVoucher + "?orderno=" + that.data.orderData.orderNo,
          })
        }
      }
    })
  },

  /**
   * 修改订单价格
   */
  changePrice: function() {
    app.globalData.workOrder = this.data.orderData
    wx.navigateTo({
      url: '/pages/orderDetail/workOrderDetail/changeOrderPrice/index',
    })
  },

  /**
   * 添加补价单
   */
  addPremium: function() {
    wx.navigateTo({
      url: pagePath.Path_Order_Premium + '?orderno=' + this.data.orderData.orderNo,
    })
  },

  /**
   * 退款
   */
  refund: function() {
    wx.navigateTo({
      url: pagePath.Path_Order_Refund + '?orderno=' + this.data.orderData.orderNo,
    })
  },

  /**
   * 分配订单
   */
  alloction: function() {
    let allocationStaffList = this.data.orderData.orderAssignments;
    if (util.checkEmpty(allocationStaffList)) {
      allocationStaffList = "";
    } else {
      allocationStaffList = JSON.stringify(allocationStaffList);
    }
    wx.navigateTo({
      url: pagePath.Path_Order_Allocation_SelectorStaff + '?orderno=' + this.data.orderData.orderNo + '&stafflist=' + allocationStaffList,
    })
  },

  /**
   * 临时派送
   */
  tempDeliver: function() {
    app.globalData.workOrder = this.data.orderData;
    wx.navigateTo({
      url: '/pages/orderDetail/workOrderDetail/tempDeliver/index',
    })
  },

  /**
   * 入港
   */
  inport: function() {
    app.globalData.workOrder = this.data.orderData;
    wx.navigateTo({
      url: '/pages/orderDetail/workOrderDetail/inport/index',
    })
  },

  /**
   * 出港
   */
  outport: function() {
    app.globalData.workOrder = this.data.orderData;
    wx.navigateTo({
      url: '/pages/orderDetail/workOrderDetail/outport/index',
    })
  },

  /**
   * 签到
   */
  signIn: function() {
    app.globalData.workOrder = this.data.orderData;
    wx.navigateTo({
      url: '/pages/orderDetail/workOrderDetail/signIn/index',
    })
  },

  /**
   * 上传节点资源
   */
  uploadNodeResource: function(){
    app.globalData.workOrder = this.data.orderData;
    wx.navigateTo({
      url: '/pages/orderDetail/workOrderDetail/uploadFile/index',
    })
  },
  /**
   * 获取更多操作列表
   */
  getOperateList: function() {
    let that = this;
    let changePrice = new OrderOperate("改价", Order_Operate_Color_2, function () {
      that.changePrice();
    })
    let deleteOrder = new OrderOperate("删除订单", Order_Operate_Color_3, function(){
      that.deleteOrder(that.data.orderData.orderNo);
    })
    let uploadVerify = new OrderOperate("上传付款凭证", Order_Operate_Color_1, function() {
      that.uploadVerify();
    })
    let premium = new OrderOperate("补价", Order_Operate_Color_2, function() {
      that.addPremium();
    });
    let refund = new OrderOperate("退款", Order_Operate_Color_3, function() {
      that.refund();
    });
    let alloction = new OrderOperate("分配订单", Order_Operate_Color_2, function() {
      that.alloction();
    });
    let tempDeliever = new OrderOperate("临时派送", Order_Operate_Color_2, function() {
      that.tempDeliver();
    });
    let inPort = new OrderOperate("入港", Order_Operate_Color_1, function() {
      that.inport();
    })
    let outPort = new OrderOperate("出港", Order_Operate_Color_1, function() {
      that.outport();
    })
    let signIn = new OrderOperate("签收", Order_Operate_Color_1, function() {
      that.signIn();
    })
    let uploadNodeResource = new OrderOperate("上传资源", Order_Operate_Color_2, function() {
      that.uploadNodeResource();
    })
    let operateList = [];
    switch(this.getOrderCurrentStateName()) {
      case Order_State_ToPay: { // 待付款
        if (that.data.userInfo.role == 1) {
          operateList.push(deleteOrder);
        }
        if (that.data.userInfo.role == 1 || that.data.userInfo.role == 2) {
          operateList.push(changePrice);
        }
        operateList.push(uploadVerify);
      }
        break;
      case Order_State_ToPack:{ // 待揽件
        inPort.name = "揽件";
        if (that.data.userInfo.role == 1 || that.data.userInfo.role == 2) {
          operateList.push(refund);
          operateList.push(alloction);
        }
        operateList.push(premium);
        operateList.push(inPort);
      }
        break;
      case Order_State_ToInPort:{ // 待入港
        inPort.name = "入港";
        if (that.data.userInfo.role == 1 || that.data.userInfo.role == 2) {
          operateList.push(refund);
          operateList.push(alloction);
        }
        operateList.push(premium);
        operateList.push(inPort);
      }
        break;
      case Order_State_ToOutPort:{ // 待出港
        if (that.data.userInfo.role == 1 || that.data.userInfo.role == 2) {
          operateList.push(refund);
          operateList.push(alloction);
        }
        operateList.push(premium);
        operateList.push(uploadNodeResource);
        operateList.push(outPort);
      }
        break;
      case Order_State_ToArrived:{ // 待到达
        inPort.name = "到达";
        if (that.data.userInfo.role == 1 || that.data.userInfo.role == 2) {
          operateList.push(alloction);
        }
        operateList.push(premium);
        operateList.push(inPort);
      }
        break;
      case Order_State_Delivering:{ // 派送中
        if (that.data.userInfo.role == 1 || that.data.userInfo.role == 2) {
          operateList.push(alloction);
        }
        operateList.push(premium);
        operateList.push(signIn);
      }
        break;
      case Order_State_ToSign:{ // 待签收
        if (that.data.userInfo.role == 1 || that.data.userInfo.role == 2) {
          operateList.push(alloction);
        }
        operateList.push(premium);
        operateList.push(tempDeliever);
        operateList.push(signIn);
      }
        break;
      case Order_State_Completed:{ // 已完成
        operateList = null;
      }
        break;
      default:
        operateList = null;
        break;
    }
    this.setData({
      operateList: operateList,
      showMoreButton: !(operateList==null)
    })
  },

  /**
   * 获取订单当前状态
   */
  getOrderCurrentState: function() {
    return this.data.orderData.orderStates[this.data.orderData.orderStates.length - 1];
  },

  /**
   * 获取订单当前状态名称
   */
  getOrderCurrentStateName: function(){
    return this.getOrderCurrentState().orderType;
  },
  /**==================================== 私有方法 end =========================================== */

  /**==================================== 数据请求 start =========================================== */

  /**
   * 删除订单
   * @param {string} orderNo 订单编号
   */
  requestDeleteOrder: function(orderNo) {
    wx.showLoading({
      title: '请稍等...',
    })
    workOrderManager.deleteOrder(orderNo, function(success, data) {
      wx.hideLoading()
      if (success) {
        wx.showToast({
          title: '删除成功',
        })
        notificationCenter.postNotification(WORKORDER_DELETE);
        wx.navigateBack();
      } else {
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 请求取消 补价
   * @param {string} billNo 补价单号
   */
  requestCancelPremium: function(billNo) {
    wx.showLoading({
      title: '取消中',
    })
    let that = this;
    workOrderManager.cancelPremium(billNo, function(success, data) {
      wx.hideLoading({
        success: (res) => {},
      })
      if (success) {
        that.requestOrderDetail(that.data.orderData.orderNo)
      } else {
        wx.showToast({
          title: '取消补价单失败',
          icon: 'none'
        })
      }
    })
  },
  
  /**
   * 请求订单详情
   * @param {string} orderNo 订单编号
   * @param {function(boolean, object)} callback 回调
   */
  requestOrderDetail: function(orderNo, callback) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    commonOrderManager.getOrderDetail(orderNo, function(success, data) {
      wx.hideLoading({
        success: (res) => {},
      })
      if (success) {
        that.setData({
          orderData: data
        })
        that.getOperateList();
      } else {
        wx.showToast({
          title: '获取详情失败',
          icon: "none"
        })
      }
      if (util.checkIsFunction(callback)) {
        callback(success, data);
      }
    })
  },
  /**==================================== 数据请求 end =========================================== */
})
