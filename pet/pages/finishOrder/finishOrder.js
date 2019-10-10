// pages/finishOrder/finishOrder.js


const util = require("../../utils/util.js");
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const pagePath = require("../../utils/pagePath.js");
const ShareUtil = require("../../utils/shareUtils.js");

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], // 订单列表

    userInfo: null,
    searchKey: null, // 搜索关键字 


    services: [], // 链接的 蓝牙设备 服务列表
    serviceId: 0, // 可用 服务 id
    writeCharacter: false, // 是否查到 写入 服务
    readCharacter: false, // 是否查到 读取 服务
    notifyCharacter: false, // 是否查到 通知 服务

    startIndex: 0, // 开始下标
    pageSize: 20, // 页长
    isEnd: false, // 是否到底
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.startPullDownRefresh();
  },

  /**
   * 开始刷新
   */
  startRefresh: function () {
    wx.startPullDownRefresh();
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
    this.data.startIndex = 0;
    this.getOrderData(this.data.startIndex, this.data.serachKey);
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
   * 搜索单据
   */
  searchOrder: function (e) {
    wx.startPullDownRefresh();
  },

  /**
   * 关键字输入 
   */
  searchInput: function (e) {
    this.data.serachKey = e.detail.value;
  },

  /**
   * 获取数据
   */
  getOrderData: function (index, searchKey) {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        if (util.checkEmpty(that.data.userInfo)) {
          that.setData({
            userInfo: loginUtil.getUserInfo()
          })
        }
        that.requestInHarbour(index,searchKey);
      }
    })
  },

  /**
   * 请求工作单
   */
  requestInHarbour: function (offset, searchKey) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    let tempData = {
      openId: loginUtil.getOpenId(),
      offset: offset,
      limit: that.data.pageSize,
    };
    if (!util.checkEmpty(searchKey)) {
      tempData.orderNo = searchKey;
    } else {
      tempData.orderNo = "";
    }
    wx.request({
      url: config.URL_Service + config.URL_GetStationAllOrder,
      data: tempData,
      success(res) {
        console.log("请求所有单据 success：\n" + JSON.stringify(res));
        if (res.data.prompt == config.Prompt_Error) {
          wx.showToast({
            title: '获取失败,稍后再试',
            icon: "none"
          })
          return;
        }
        if (util.checkEmpty(res.data.data) || util.checkEmpty(res.data.data.data)) {
          that.setData({
            isEnd: true
          })
          return;
        }
        that.data.orderList = that.data.orderList.concat(res.data.data.data);
        let isEnd = false;
        if (res.data.data.data.length < that.data.pageSize) {
          isEnd = true;
        }
        that.setData({
          orderList: that.data.orderList,
          isEnd: isEnd,
          startIndex: offset + that.data.pageSize
        })
      },
      fail(res) {
        console.log("请求所有单据 fail：\n" + JSON.stringify(res)); 
        wx.showToast({
          title: '网络波动,稍后再试',
          icon: "none"
        })
      },
      complete(res) {
        console.log("请求所有单据 complete：\n" + JSON.stringify(res));
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
    })
  },

  /**
   * 点击图片
   */
  tapImage: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.orderindex];
    let tempImageList = [];
    if (tempOrder.orderStates[0].pictureList != null && tempOrder.orderStates[0].pictureList.length > 0) {
      for (let i = 0; i < tempOrder.orderStates[0].pictureList.length; i++) {
        tempImageList.push(tempOrder.orderStates[0].pictureList[i].viewAddress);
      }
    }
    if (tempOrder.currentUploadImages != null && tempOrder.currentUploadImages.length > 0) {
      for (let i = 0; i < tempOrder.currentUploadImages.length; i++) {
        tempImageList.push(tempOrder.currentUploadImages[i].viewAddress);
      }
    }
    if (tempOrder.uploadImages != null && tempOrder.uploadImages.length > 0) {
      tempImageList = tempImageList.concat(tempOrder.uploadImages);
    }
    let currrentUrl = e.currentTarget.dataset.imageurl;
    wx.previewImage({
      urls: tempImageList,
      current: currrentUrl
    })
  },

  /**
   * 订单详情
   */
  tapOrderDetail: function (e) {
    console.log("详情：\n" + e.currentTarget.dataset.orderno)
    wx.navigateTo({
      url: pagePath.Path_Order_Detail + '?orderno=' + e.currentTarget.dataset.orderno + '&type=1',
    })
  },

  /**
   * 打印
   */
  tapPrint: function (e) {
    let index = e.currentTarget.dataset.tapindex;
    let tempOrder = this.data.orderList[index];
    this.startPrint(tempOrder);
  },

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
      console.log(app.BLEInformation.deviceId)
      wx.showLoading({
        title: '正在连接',
      })
      // 链接蓝牙设备
      wx.createBLEConnection({
        deviceId: app.BLEInformation.deviceId,
        // 链接成功
        success: function (res) {
          console.log(res)
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
          console.log(e)
          wx.hideLoading()
        },
        // 链接完成
        complete: function (e) {
          console.log(e)
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
    console.log(app.BLEInformation.deviceId)
    // 获取蓝牙设备所有service(服务)
    wx.getBLEDeviceServices({
      deviceId: app.BLEInformation.deviceId,
      success: function (res) {
        console.log(res)
        that.setData({
          services: res.services
        })
        // 获取蓝牙设备 特征值 信息
        that.getCharacteristics()
      }, fail: function (e) {
        console.log(e)
      }, complete: function (e) {
        console.log(e)
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
        console.log(res)
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
        console.log(e)
      }, complete: function (e) {
        console.log("write:" + app.BLEInformation.writeCharaterId)
        console.log("read:" + app.BLEInformation.readCharaterId)
        console.log("notify:" + app.BLEInformation.notifyCharaterId)
      }
    })
  },

  openControl: function () {
    wx.navigateTo({
      url: pagePath.Path_Print_Print,
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
   * 输入备注
   */
  inputOrderRemark: function (e) {
    console.log("输入备注" + JSON.stringify(e));
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    tempOrder.remarkInput = e.detail.value;
  },

  /**
   * 提交备注
   */
  tapRemark: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    if (util.checkEmpty(tempOrder.remarkInput)) {
      return;
    }
    this.requestPostOrderRemark(tempOrder);
  },

  /**
   * 请求提交备注
   */
  /**
   * 提交备注输入
   */
  requestPostOrderRemark: function (orderItem) {
    let that = this;
    wx.showLoading({
      title: '请稍等',
    })
    wx.request({
      url: config.URL_Service + config.URL_PostOrderRemark,
      data: {
        order: {
          orderNo: orderItem.orderNo
        },
        staff: loginUtil.getUserInfo(),
        remarks: orderItem.remarkInput
      },
      method: 'POST',
      success(res) {
        console.log("新增备注 success:\n" + JSON.stringify(res));
        if (res.data.code == 200 && res.data.data > 0) {
          wx.showToast({
            title: '备注成功',
          })
          if (orderItem.orderRemarksList == null) {
            orderItem.orderRemarksList = [];
          }
          orderItem.orderRemarksList.push({ remarks: orderItem.remarkInput })
          orderItem.remarkInput = null;
          that.setData({
            orderList: that.data.orderList
          })
        } else {
          wx.showToast({
            title: '备注失败',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("新增备注 fail:\n" + JSON.stringify(res));
        wx.showToast({
          title: '网络波动，新增备注失败',
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },

  /**
   * 上拉加载
   */
  loadMore: function () {
    this.getOrderData(this.data.startIndex, this.data.searchKey);
  }
})