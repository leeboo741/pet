// pages/workbench/workbench.js

const util = require("../../utils/util.js");
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");
const pagePath = require("../../utils/pagePath.js");
const ShareUtil = require("../../utils/shareUtils.js");
const WorkOrderManager = require("../../manager/orderManager/workOrder.js");

const app = getApp();
const maxVideoLength = 10; // 最大视频长度限制

const OrderTakeDetailInputState_UnStart = 0;
const OrderTakeDetailInputState_UnComplete = 1;
const OrderTakeDetailInputState_Complete = 2;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], // 订单列表
    finishPage: false, // 页面是否终结
    userInfo: null,
    searchKey: null, // 搜索关键字 

    services: [], // 链接的 蓝牙设备 服务列表
    serviceId: 0, // 可用 服务 id
    writeCharacter: false, // 是否查到 写入 服务
    readCharacter: false, // 是否查到 读取 服务
    notifyCharacter: false, // 是否查到 通知 服务

    orderFilter: null, // 更多筛选条

    uploadFailCount: 0, // 上传失败数量
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
    this.getOrderData(this.data.serachKey);
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
    console.log("/workbench/workbench 销毁")
    this.data.finishPage = true;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getOrderData(this.data.serachKey);
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
   * 处理
   */
  handleReadyToUpload: function (order) {
    if (util.checkEmpty(order.uploadImages)
      && util.checkEmpty(order.uploadVideos)) {
      order.readyToUpload = false;
    } else {
      order.readyToUpload = true;
    }
    this.setData({
      orderList: this.data.orderList
    })
  },

  /**
   * 是否可以操作 揽件 入港 出港
   */
  handleReadyToInHarbour: function (order) {
    let that = this;
    if ((!util.checkEmpty(order.currentUploadVideos) || !util.checkEmpty(order.currentUploadImages))
      // && util.checkEmpty(order.uploadImages)
      // && util.checkEmpty(order.uploadVideos)
      ) {
      order.readyToInHarbour = true;

      that.getDefaultOrderTakerDetail(order,null, function getDefaultOrderTakerCallback(defaultOrderTaker) {
        if (defaultOrderTaker!=null) {
          order.orderTakeDetail = defaultOrderTaker;
        } else {
          order.orderTakeDetail = {};
          // order.orderTakeDetail = WorkOrderManager.getOrderTakerInfoWithCityName(order.transport.endCity, WorkOrderManager.getAirportCompanyCode(order));
        }
        that.setData({
          orderList: that.data.orderList
        })
      })
    } else {
      order.readyToInHarbour = false;
      order.orderTakeDetail = null;
    }
    this.setData({
      orderList: this.data.orderList
    })
  },

  /**
   * 删除视频
   */
  deleteUploadVideo: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    tempOrder.uploadVideos.splice(e.currentTarget.dataset.videoindex, 1);
    this.handleReadyToUpload(tempOrder);
    this.handleReadyToInHarbour(tempOrder);
  },

  /**
   * 删除上传图片
   */
  deleteUploadImage: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    tempOrder.uploadImages.splice(e.currentTarget.dataset.imageindex, 1);
    this.handleReadyToUpload(tempOrder);
    this.handleReadyToInHarbour(tempOrder);
  },

  /**
    * 确定上传
    */
  tapConfirmUpload: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    let uploadList = [];
    if (!util.checkEmpty(tempOrder.uploadImages)) {
      uploadList = uploadList.concat(tempOrder.uploadImages);
    }
    if (!util.checkEmpty(tempOrder.uploadVideos)) {
      uploadList = uploadList.concat(tempOrder.uploadVideos)
    }
    let uploadIndex = 0;
    this.data.uploadFailCount = 0;
    let uploadLength = uploadList.length;
    console.log("需要上传的文件 => \n图片:\n" + JSON.stringify(tempOrder.uploadImages) + "\n视频：\n" + JSON.stringify(tempOrder.uploadVideos));
    this.requestUploadFile(uploadList, uploadIndex, tempOrder);

  },

  /**
   * 上传文件
   * @param fileList 文件列表
   * @param uploadIndex 要上传的文件下标
   * @param order 单据
   */
  requestUploadFile: function (fileList, uploadIndex, order) {
    wx.showLoading({
      title: '上传中...',
    })
    let that = this;
    wx.uploadFile({
      url: config.URL_Service + config.URL_UploadFile,
      filePath: fileList[uploadIndex],
      name: 'multipartFiles',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        "orderNo": order.orderStates[0].orderNo,
        "sn": order.orderStates[0].sn,
        "orderType": order.orderStates[0].orderType
      },
      success(res) {
        wx.hideLoading();
        console.log("upload success =>" + JSON.stringify(res));
        let tempObj = JSON.parse(res.data);
        if (tempObj.code != config.RES_CODE_SUCCESS) {
          wx.showToast({
            title: "文件上传失败",
            icon: 'none'
          })
          that.data.uploadFailCount++;
        } else {
          let mediaAddress = tempObj.data[0].viewAddress;
          let tempVideoObj = {
            viewAddress: mediaAddress
          }
          if (util.isVideo(mediaAddress)) {
            if (order.currentUploadVideos == null) {
              order.currentUploadVideos = [];
            }
            let tempFile = fileList[uploadIndex];
            let tempIndex = that.getIndexOf(tempFile, order.uploadVideos);
            
            order.currentUploadVideos.push(tempVideoObj);
            order.uploadVideos.splice(tempIndex, 1);
          } else {
            if (order.currentUploadImages == null) {
              order.currentUploadImages = [];
            }
            let tempFile = fileList[uploadIndex];
            let tempIndex = that.getIndexOf(tempFile, order.uploadImages); 
            order.currentUploadImages.push(tempVideoObj);
            order.uploadImages.splice(tempIndex, 1);
          }
          that.setData({
            orderList: that.data.orderList
          })
        }
      },
      fail(res) {
        wx.hideLoading();
        console.log("上传失败 index: " + uploadIndex);
        that.data.uploadFailCount ++;
        wx.showToast({
          title: "一个文件上传失败",
          icon: 'none'
        })
        typeof callback == "function" && callback("fail");
      },
      complete(res) {
        console.log("上传完成 index: " + uploadIndex);
        uploadIndex++;
        if (!that.data.finishPage) {
          if (uploadIndex < fileList.length) {
            that.requestUploadFile(fileList, uploadIndex, order)
          } else {
            if (that.data.uploadFailCount > 0) {
              wx.showToast({
                title: that.data.uploadFailCount +"张图片上传失败",
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: '上传完成',
              })
            }
            that.handleReadyToUpload(order)
            that.handleReadyToInHarbour(order);
          }
        }
      }
    })
  },

  /**
   * 获取元素下标
   */
  getIndexOf: function (ele, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == ele) return i;
    }
    return -1;
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
   * 点击更多筛选
   */
  tapFilterAction: function (e) {
    wx.navigateTo({
      url: pagePath.Path_Order_Filter + '?type=0',
    })
  },


  /**
   * 开始筛选
   */
  startFilter: function (orderFilter) {
    this.setData({
      orderFilter: orderFilter
    })
    this.getOrderData(this.data.searchKey);
  },

  /**
   * 清除筛选条件
   */
  tapClearFilter: function () {
    this.setData({
      orderFilter: null
    })
    this.startRefresh();
  },

  /**
   * 获取数据
   */
  getOrderData: function (searchKey) {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        if (util.checkEmpty(that.data.userInfo)) {
          that.setData({
            userInfo: loginUtil.getUserInfo()
          })
        }
        that.requestInHarbour(searchKey);
      }
    })
  },

  /**
   * 请求工作单
   */
  requestInHarbour: function (searchKey) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    let orderFilter = this.data.orderFilter;
    let tempSearchKey = "";
    if (searchKey != null) {
      tempSearchKey = searchKey
    }
    let orderTypes = [
      config.Order_State_ToInPort,
      config.Order_State_ToOutPort,
      config.Order_State_ToPack,
    ];
    let endCity = "";
    let name = "";
    let phone = "";
    let code = "";
    let startOrderDate = "";
    let endOrderDate = "";
    let startLeaveDate = "";
    let endLeaveDate = "";
    if (orderFilter != null && !util.checkEmpty(orderFilter.orderType)) {
      orderTypes = [
        orderFilter.orderType
      ];
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.endCity)) {
      endCity = orderFilter.endCity;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.name)) {
      name = orderFilter.name;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.phone)) {
      phone = orderFilter.phone;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.code)) {
      code = orderFilter.code;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.startOrderDate)) {
      startOrderDate = orderFilter.startOrderDate;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.endOrderDate)) {
      endOrderDate = orderFilter.endOrderDate;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.startLeaveDate)) {
      startLeaveDate = orderFilter.startLeaveDate;
    }
    if (orderFilter != null && !util.checkEmpty(orderFilter.endLeaveDate)) {
      endLeaveDate = orderFilter.endLeaveDate;
    }

    let tempData = {
      staffNo: loginUtil.getStaffNo(),
      stationNo: loginUtil.getStationNo(),
      orderNo: tempSearchKey,
      orderTypeArray: orderTypes,
      startOrderTime: startOrderDate,
      endOrderTime: endOrderDate,
      startLeaveTime: startLeaveDate,
      endLeaveTime: endLeaveDate,
      endCity: endCity,
      name: name,
      phone: phone,
      code: code,
    }
    wx.request({
      url: config.URL_Service + config.URL_GetInOrOutHarbourList,
      data: {
        queryParamStr: JSON.stringify(tempData)
      },
      success(res) {
        console.log("请求工作单 success：\n" + JSON.stringify(res));
        that.setData({
          orderList: res.data.data
        })
      },
      fail(res) {
        console.log("请求工作单 fail：\n" + JSON.stringify(res)); 
        wx.showToast({
          title: "系统异常",
          icon: 'none'
        })
      },
      complete(res) {
        console.log("请求工作单 complete：\n" + JSON.stringify(res));
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
   * 点击 揽件 入港 出港 按钮
   */
  tapInHarbour: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    if (tempOrder.orderStates[0].orderType == "待出港") {
      // 
      this.requestUnPayPremiumCount(e.currentTarget.dataset.tapindex)
    } else {
      
      this.requestConfirmInHarbour(e.currentTarget.dataset.tapindex);
    }
  },

  /**
   * 查询未支付补价单
   */
  requestUnPayPremiumCount: function (orderIndex) {
    const tempIndex = orderIndex;
    const order = this.data.orderList[tempIndex];
    let that = this;
    wx.showLoading({
      title: '请稍等',
    })
    wx.request({
      url: config.URL_Service + config.URL_UnPayPremiumCount,
      data: {
        orderNo: order.orderNo
      },
      success(res) {
        console.log("未支付补价单数量 sucess: \n" + JSON.stringify(res));
        if (res.data.code == config.RES_CODE_SUCCESS) {
          if (res.data.data > 0) {
            wx.hideLoading();
            wx.showModal({
              title: '还有未支付补价单',
              content: '完成补价后再执行该操作',
              showCancel: false
            })
          } else {
            that.requestPostTransportInfo(tempIndex);
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '查询未完成补价单失败',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("未支付补价单数量 fail: \n" + JSON.stringify(res));
        wx.hideLoading();
        wx.showToast({
          title: '系统异常',
          icon: 'none'
        })
      }
    })

  },

  /**
   * 添加运输信息
   */
  requestPostTransportInfo: function (orderIndex) {
    const tempIndex = orderIndex;
    const order = this.data.orderList[tempIndex];
    let tempData = {};
    tempData.order = {
      orderNo: order.orderNo
    };
    tempData.staff = {
      staffNo: loginUtil.getStaffNo(),
      phone: loginUtil.getPhone()
    };
    tempData.transportType = order.transport.transportType;
    
    if (util.checkEmpty(order.outTransportInfo)) {
      wx.showToast({
        title: '运输信息有必填项未填写',
        icon:'none'
      })
      return;
    }

    if (util.checkEmpty(order.outTransportInfo.expressNum)) {
      wx.showToast({
        title: '快递单号不能为空！',
        icon: 'none'
      })
      return;
    } else {
      tempData.expressNum = order.outTransportInfo.expressNum;
    }

    if (util.checkEmpty(order.outTransportInfo.transportNum)) {
      wx.showToast({
        title: '航班号不能为空',
        icon: 'none'
      })
      return;
    } else {
      tempData.transportNum = order.outTransportInfo.transportNum;
    }

    if (order.transport.transportType == 3 || order.transport.transportType == 4) {

      if (util.checkEmpty(order.outTransportInfo.startCityCode)) {
        wx.showToast({
          title: '始发机场三字码不能为空',
          icon:'none'
        })
        return;
      } else {
        tempData.startCity = order.outTransportInfo.startCityCode;
      }

      if (util.checkEmpty(order.outTransportInfo.endCityCode)) {
        wx.showToast({
          title: '目的机场三字码不能为空',
          icon: 'none'
        })
        return;
      } else {
        tempData.endCity = order.outTransportInfo.endCityCode;
      }

    } else {
      if (!util.checkEmpty(order.transport.startCity)) {
        tempData.startCity = order.transport.startCity;
      }
      if (!util.checkEmpty(order.transport.endCity)) {
        tempData.endCity = order.transport.endCity;
      }
    }


    if (util.checkEmpty(order.outTransportInfo.departureDate)) {
      wx.showToast({
        title: '出发时间不能为空',
        icon: 'none'
      })
      return;
    } else {
      tempData.dateTime = order.outTransportInfo.departureDate
    }
    
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      url: config.URL_Service + config.URL_PostTransportInfo,
      data: tempData,
      method: "POST",
      success(res) {
        console.log("添加运输信息 success: \n" + JSON.stringify(res));
        wx.hideLoading();
        if (res.data.code == config.RES_CODE_SUCCESS && res.data.data > 0) {
          that.checkOrderTakeDetailIsComplete(order.orderTakeDetail, function inputStateCallback(state){
            if (state == OrderTakeDetailInputState_UnStart) {
              that.requestConfirmInHarbour(tempIndex);
            } else if (state == OrderTakeDetailInputState_UnComplete) {
              wx.showModal({
                title: '提货信息未输入完全',
                content: '是否补全提货信息?不补全将不会提交当前提货信息',
                cancelText:'继续补全',
                confirmText: '放弃补全',
                success(takeOrderCompleteRes){
                  if (takeOrderCompleteRes.confirm) {
                    that.requestConfirmInHarbour(tempIndex);
                  }
                }
              })
            } else {
              that.requestOrderTaker(tempIndex);
            }
          })
        } else {
          wx.showToast({
            title: '添加运输信息失败！',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("添加运输信息 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '网络波动，稍后再试',
          icon: 'none'
        })
        wx.hideLoading();
      },
      complete(res){

      }
    })
  },

  /**
   * 获取默认提货配置
   */
  getDefaultOrderTakerDetail: function (order,code, getDefaultOrderTakerCallback) {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      url: config.URL_Service + config.URL_GetDefaultOrderTakerInfo(order.orderNo, code),
      success(res) {
        console.log ("获取默认提货信息配置success: " + JSON.stringify(res));
        if (res.data.code == config.RES_CODE_SUCCESS) {
          if (getDefaultOrderTakerCallback && typeof getDefaultOrderTakerCallback == 'function') {
            if(!util.checkEmpty(res.data.data)) {
              getDefaultOrderTakerCallback(res.data.data[0]);
            } else {
              getDefaultOrderTakerCallback(null);
            }
          }
        } 
      },
      fail(res) {
        console.log("获取默认提货信息配置fail: " + JSON.stringify(res));
        if (getDefaultOrderTakerCallback && typeof getDefaultOrderTakerCallback == 'function') {
          getDefaultOrderTakerCallback(null);
        }
      },
      complete(res) {
        wx.hideLoading();
      },

    })
  },

  
  /**
   * 提货信息是否输入完成
   */
  checkOrderTakeDetailIsComplete: function(orderTakeDetail, inputStateCallback) {
    var orderTakeDetailInputState = OrderTakeDetailInputState_UnStart;
    if (!util.checkEmpty(orderTakeDetail)) {
      orderTakeDetailInputState = OrderTakeDetailInputState_Complete;
      if (util.checkEmpty(orderTakeDetail.contact)) {
        orderTakeDetailInputState = OrderTakeDetailInputState_UnComplete;
      }
      if (util.checkEmpty(orderTakeDetail.phone)) {
        orderTakeDetailInputState = OrderTakeDetailInputState_UnComplete;
      }
      // if (util.checkEmpty(orderTakeDetail.takeTime)) {
      //   orderTakeDetailInputState = OrderTakeDetailInputState_UnComplete;
      // }
      if (util.checkEmpty(orderTakeDetail.province)
        || util.checkEmpty(orderTakeDetail.city)
        || util.checkEmpty(orderTakeDetail.region)) {
        orderTakeDetailInputState = OrderTakeDetailInputState_UnComplete;
      }
      if (util.checkEmpty(orderTakeDetail.detailAddress)) {
        orderTakeDetailInputState = OrderTakeDetailInputState_UnComplete;
      }
    }
    if (util.checkIsFunction(inputStateCallback)) {
      inputStateCallback(orderTakeDetailInputState);
    }
  },

  /**
   * 提交提货信息
   */
  requestOrderTaker: function(orderIndex) {
    const tempIndex = orderIndex;
    const order = this.data.orderList[tempIndex];
    let tempData = order.orderTakeDetail;
    tempData.order = {
      orderNo: order.orderNo
    };
    tempData.station = {
      stationNo: loginUtil.getStationNo()
    }
    if (order.transport.transportType == 3 || order.transport.transportType == 4) {
      tempData.code = order.outTransportInfo.transportNum;
    }
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_PostOrderTakerInfo,
      method: "POST", // 请求方式
      data: tempData,
      success(res) {
        console.log("添加提货信息 success: \n" + JSON.stringify(res));
        wx.hideLoading();
        if (res.data.code == config.RES_CODE_SUCCESS) {
          // WorkOrderManager.saveOrderTakerInfoWithCityName(order.transport.endCity,WorkOrderManager.getAirportCompanyCode(order), order.orderTakeDetail);
          that.requestConfirmInHarbour(tempIndex)
        } else {
          wx.showToast({
            title: '添加提货信息失败！',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("添加提货信息 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '网络波动，稍后再试',
          icon: 'none'
        })
        wx.hideLoading();
      },
    })
  },

  /**
   * 确认揽件 入港 出港
   */
  requestConfirmInHarbour: function (orderIndex) {
    const tempIndex = orderIndex;
    const order = this.data.orderList[tempIndex];
    wx.showLoading({
      title: '请稍等...',
    })
    let fileList = [];
    if (!util.checkEmpty(order.currentUploadImages)) {
      for (let i = 0; i < order.currentUploadImages.length ; i++) {
        let tempImageObj = order.currentUploadImages[i];
        fileList.push(tempImageObj.viewAddress);
      }
    }
    if (!util.checkEmpty(order.currentUploadVideos)) {
      for (let i = 0; i < order.currentUploadVideos.length; i++) {
        let tempVideoObj = order.currentUploadVideos[i];
        fileList.push(tempVideoObj.viewAddress);
      }
    }
    let that = this;
    wx.request({
      url: config.URL_Service + config.URL_ConfirmInOutHarbour,
      method: "POST", // 请求方式
      data: {
        fileList: fileList,
        sn: order.orderStates[0].sn,
        orderNo: order.orderStates[0].orderNo,
        orderType: order.orderStates[0].orderType,
      },
      success(res) {
        wx.hideLoading();
        console.log("确定入港 success: \n" + JSON.stringify(res));
        if (res.data.code != config.RES_CODE_SUCCESS) {

          let tempMsg = '系统异常，入港失败'
          if (order.orderStates[0].orderType == config.Order_State_ToOutPort) {
            tempMsg = '系统异常，出港失败'
          } else if (order.orderStates[0].orderType == config.Order_State_ToPack) {
            tempMsg = '系统异常，揽件失败'
          }

          if (res.data.message) {
            tempMsg = res.data.message
          }
          wx.showToast({
            title: tempMsg,
            icon: 'none'
          })
        } else {
          let tempMsg = '入港成功'
          if (order.orderStates[0].orderType == config.Order_State_ToOutPort) {
            tempMsg = '出港成功'
          } else if (order.orderStates[0].orderType == config.Order_State_ToPack) {
            tempMsg = '揽件成功'
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
          }
          wx.showToast({
            title: tempMsg,
          })
          wx.startPullDownRefresh();
        }
      },
      fail(res) {
        wx.hideLoading();
        console.log("确定入港 fail: \n" + JSON.stringify(res));
        let tempMsg = '网络异常，入港失败'
        if (order.orderStates[0].orderType == '待出港') {
          tempMsg = '网络异常，出港失败'
        }
        wx.showToast({
          title: tempMsg,
          icon: 'none'
        })
      },
      complete(res) {
        console.log("确定入港 complete: \n" + JSON.stringify(res));
      }
    })
  },

  /**
   * 点击准备上传
   */
  tapUpload: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    let that = this;
    wx.showActionSheet({
      itemList: ["拍摄照片","拍摄视频","选择照片", "选择视频"],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.chooseImage({
            sourceType: ['camera'],
            count: 20,
            success: function (res) {
              if (tempOrder.uploadImages == null) {
                tempOrder.uploadImages = [];
              }
              if (res.tempFilePaths != null && res.tempFilePaths.length > 0) {
                tempOrder.uploadImages = tempOrder.uploadImages.concat(res.tempFilePaths);
                that.handleReadyToUpload(tempOrder);
                that.handleReadyToInHarbour(tempOrder);
              }
            },
          })
        } else if (res.tapIndex == 1) {
          wx.chooseVideo({
            sourceType: ['camera'],
            maxDuration: maxVideoLength,
            success(res) {
              if (tempOrder.uploadVideos == null) {
                tempOrder.uploadVideos = [];
              }
              if (!util.checkEmpty(res.tempFilePath)) {
                tempOrder.uploadVideos = tempOrder.uploadVideos.concat(res.tempFilePath);
                that.handleReadyToUpload(tempOrder);
                that.handleReadyToInHarbour(tempOrder);
              }
            }
          })
        } else if (res.tapIndex == 2) {
          wx.chooseImage({
            sourceType: ['album'],
            count: 20,
            success: function (res) {
              if (tempOrder.uploadImages == null) {
                tempOrder.uploadImages = [];
              }
              if (res.tempFilePaths != null && res.tempFilePaths.length > 0) {
                tempOrder.uploadImages = tempOrder.uploadImages.concat(res.tempFilePaths);
                that.handleReadyToUpload(tempOrder);
                that.handleReadyToInHarbour(tempOrder);
              }
            },
          })
        } else {
          wx.chooseVideo({
            sourceType: ['album'],
            maxDuration: maxVideoLength,
            success(res) {
              if (tempOrder.uploadVideos == null) {
                tempOrder.uploadVideos = [];
              }
              if (!util.checkEmpty(res.tempFilePath)) {
                tempOrder.uploadVideos = tempOrder.uploadVideos.concat(res.tempFilePath);
                that.handleReadyToUpload(tempOrder);
                that.handleReadyToInHarbour(tempOrder);
              }
            }
          })
        }
      },
    })
  },

  /**
   * 点击更多
   */
  tapMoreOperate: function(e) {
    let itemList = ["打印标签", "补价", "订单详情", "退款"];
    if (this.data.userInfo.role == 1) {
      itemList.push("分配订单")
    }
    let index = e.currentTarget.dataset.tapindex;
    let orderNo = e.currentTarget.dataset.orderno;
    let that = this;
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        if (res.tapIndex == 0){
          let tempOrder = that.data.orderList[index];
          that.startPrint(tempOrder);
        } else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: pagePath.Path_Order_Premium + '?orderno=' + orderNo,
          })
        } else if (res.tapIndex == 2) {
          let showPrice = 0;
          if (that.data.userInfo.role == 1) {
            showPrice = 1;
          }
          wx.navigateTo({
            url: pagePath.Path_Order_Detail + '?orderno=' + orderNo + '&type=1' + "&showprice=" + showPrice,
          })
        } else if (res.tapIndex == 3) {
          wx.navigateTo({
            url: pagePath.Path_Order_Refund + '?orderno=' + orderNo,
          })
        } else {
          let allocationStaffList = that.data.orderList[index].orderAssignments;
          if (util.checkEmpty(allocationStaffList)) {
            allocationStaffList = "";
          } else {
            allocationStaffList = JSON.stringify(allocationStaffList);
          }
          wx.navigateTo({
            url: pagePath.Path_Order_Allocation_SelectorStaff + '?orderno=' + orderNo + '&stafflist=' + allocationStaffList,
          })
        }
      }, 
    })
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
   * 输入航班号/车次号
   */
  inputOrderTransportNum: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    if (tempOrder.outTransportInfo==null) {
      tempOrder.outTransportInfo = {};
    }
    tempOrder.outTransportInfo.transportNum = e.detail.value;

    // let tempOrderTakerInfo = WorkOrderManager.getOrderTakerInfoWithCityName(tempOrder.transport.endCity, WorkOrderManager.getAirportCompanyCode(tempOrder));
    // if (tempOrderTakerInfo != null && Object.keys(tempOrderTakerInfo).length > 0) {
    //   tempOrder.orderTakeDetail = tempOrderTakerInfo;
    //   this.setData({
    //     orderList: this.data.orderList
    //   })
    // }
  },

  /**
   * 航班号/车次号丢失焦点
   */
  orderTransoportNumLostFocus: function(e) {
    let that = this;
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    if (tempOrder.transport.transportType == 3 || tempOrder.transport.transportType == 4) {
      this.getDefaultOrderTakerDetail(tempOrder,e.detail.value,function getDefaultOrderTakerCallback(defaultOrderTaker) {
        if (defaultOrderTaker != null) {
          tempOrder.orderTakeDetail = defaultOrderTaker;
        } 
        that.setData({
          orderList: that.data.orderList
        })
      })
    }
  },

  /**
   * 输入快递单号
   */
  inputOrderExpressNum: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    if (tempOrder.outTransportInfo == null) {
      tempOrder.outTransportInfo = {};
    }
    tempOrder.outTransportInfo.expressNum = e.detail.value;
  },

  /**
   * 输入始发机场三字码
   */
  inputStartCityCode: function(e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    if (tempOrder.outTransportInfo == null) {
      tempOrder.outTransportInfo = {};
    }
    tempOrder.outTransportInfo.startCityCode = e.detail.value;
  },

  /**
   * 输入目的机场三字码
   */
  inputEndCityCode: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    if (tempOrder.outTransportInfo == null) {
      tempOrder.outTransportInfo = {};
    }
    tempOrder.outTransportInfo.endCityCode = e.detail.value;
  },

  /**
   * 选择出发时间
   */
  selectDepartureDate: function(e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    if (tempOrder.outTransportInfo == null) {
      tempOrder.outTransportInfo = {};
    }
    tempOrder.outTransportInfo.departureDate = e.detail.value;
    this.setData({
      orderList: this.data.orderList
    })
  },

  /**
   * 输入提货处联系人
   */
  inputOrderTakerContact: function(e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    if (tempOrder.orderTakeDetail == null) {
      tempOrder.orderTakeDetail = {};
    }
    tempOrder.orderTakeDetail.contact = e.detail.value;
    this.setData({
      orderList: this.data.orderList
    })
  },

  /**
   * 输入提货联系人电话
   */
  inputOrderTakerContactPhone: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    if (tempOrder.orderTakeDetail == null) {
      tempOrder.orderTakeDetail = {};
    }
    tempOrder.orderTakeDetail.phone = e.detail.value;
    this.setData({
      orderList: this.data.orderList
    })
  },

  /**
   * 选择提货时间
   */
  selectTakeDate: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    if (tempOrder.orderTakeDetail == null) {
      tempOrder.orderTakeDetail = {};
    }
    tempOrder.orderTakeDetail.takeTime = e.detail.value;
    this.setData({
      orderList: this.data.orderList
    })
  },

  /**
   * 选择提货地址省市区
   */
  selectTakeRegion: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    if (tempOrder.orderTakeDetail == null) {
      tempOrder.orderTakeDetail = {};
    }
    let region = e.detail.value;
    tempOrder.orderTakeDetail.province = region[0];
    tempOrder.orderTakeDetail.city = region[1];
    tempOrder.orderTakeDetail.region = region[2];
    this.setData({
      orderList: this.data.orderList
    })
  },

  /**
   * 输入提货详细地址
   */
  inputOrderTakeDetailAddress: function(e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    if (tempOrder.orderTakeDetail == null) {
      tempOrder.orderTakeDetail = {};
    }
    tempOrder.orderTakeDetail.detailAddress = e.detail.value;
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
        staff: loginUtil.getStaffInfo(),
        remarks: orderItem.remarkInput
      },
      method: 'POST',
      success(res) {
        wx.hideLoading();
        console.log("新增备注 success:\n" + JSON.stringify(res));
        if (res.data.code == config.RES_CODE_SUCCESS && res.data.data > 0) {
          wx.showToast({
            title: '备注成功',
          })
          if (orderItem.orderRemarksList == null) {
            orderItem.orderRemarksList = [];
          }
          orderItem.orderRemarksList.push(
            { 
              remarks: orderItem.remarkInput,
              dateTime: util.formatTime(new Date())
            }
          )
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
        wx.hideLoading();
        console.log("新增备注 fail:\n" + JSON.stringify(res));
        wx.showToast({
          title: '网络波动，新增备注失败',
          icon: 'none'
        })
      },
      complete(res) {
      }
    })
  },

})