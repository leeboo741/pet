// pages/unConfirmOrder/unConfirmOrder.js
const util = require("../../utils/util.js");
const config = require("../../utils/config.js");
const loginUtil = require("../../utils/loginUtils.js");

const app = getApp();
const maxVideoLength = 10; // 最大视频长度限制

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], // 订单列表
    finishPage: false, // 页面是否终结
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.setData({
          userInfo: loginUtil.getUserInfo()
        })
        that.requestInHarbour();
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
    console.log("/unConfirmOrder/unConfirmOrder 销毁")
    this.data.finishPage = true;
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
   * 是否可以入港
   */
  handleReadyToInHarbour: function (order) {
    if ((!util.checkEmpty(order.currentUploadVideos) || !util.checkEmpty(order.currentUploadImages))
      && util.checkEmpty(order.uploadImages)
      && util.checkEmpty(order.uploadVideos)) {
      order.readyToInHarbour = true;
    } else {
      order.readyToInHarbour = false;
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
        console.log("upload success =>" + JSON.stringify(res));
        let tempObj = JSON.parse(res.data);
        if (res.data.prompt != null && res.data.prompt == config.Prompt_Error) {
          wx.showToast({
            title: "文件上传失败",
            icon: 'none'
          })
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
        console.log("上传失败 index: " + uploadIndex);
        wx.showToast({
          title: "一个文件上传失败",
          icon: 'none'
        })
        typeof callback == "function" && callback("fail");
      },
      complete(res) {
        console.log("上传完成 index: " + uploadIndex);
        uploadIndex++;
        wx.hideLoading();
        if (!that.data.finishPage) {
          if (uploadIndex < fileList.length) {
            that.requestUploadFile(fileList, uploadIndex, order)
          } else {
            wx.showToast({
              title: '上传完成',
            })
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
    let that = this;
    loginUtil.checkLogin(function alreadyLoginCallback(state) {
      if (state) {
        that.setData({
          userInfo: loginUtil.getUserInfo()
        })
        that.requestInHarbour(e.detail.value);
      }
    })
  },

  /**
   * 请求入港单
   */
  requestInHarbour: function (searchKey) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    let tempSearchKey = "";
    if (searchKey != null) {
      tempSearchKey = searchKey
    }
    let orderTypes = config.Order_State_ToArrived + ',' + config.Order_State_Arrived + ',' + config.Order_State_Delivering + ',' + config.Order_State_ToSign;
    wx.request({
      url: config.URL_Service + config.URL_GetInOrOutHarbourList,
      data: {
        openId: loginUtil.getOpenId(),
        orderNo: tempSearchKey,
        orderType: orderTypes,
      },
      success(res) {
        console.log("请求入港单 success：\n" + JSON.stringify(res));
        that.setData({
          orderList: res.data.data
        })
      },
      fail(res) {
        console.log("请求入港单 fail：\n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("请求入港单 complete：\n" + JSON.stringify(res));
        wx.hideLoading();
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
   * 入港
   */
  tapInHarbour: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    if (tempOrder.orderStates[0].orderType == config.Order_State_ToArrived) {
      this.requestConfirmInHarbour(e.currentTarget.dataset.tapindex)
    } else {
      this.requestReceiveOrder(e.currentTarget.dataset.tapindex);
    }
  },

  /**
   * 确认入港
   */
  requestConfirmInHarbour: function (orderIndex) {
    const tempIndex = orderIndex;
    const order = this.data.orderList[tempIndex];
    wx.showLoading({
      title: '请稍等...',
    })
    let fileList = [];
    if (!util.checkEmpty(order.currentUploadImages)) {
      for (let i = 0; i < order.currentUploadImages.length; i++) {
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
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST", // 请求方式
      data: {
        fileList: fileList,
        sn: order.orderStates[0].sn,
        orderNo: order.orderStates[0].orderNo,
        orderType: order.orderStates[0].orderType,
      },
      success(res) {
        console.log("确定入港 success: \n" + JSON.stringify(res));
        if (res.data.prompt != null && res.data.prompt == "Error") {

          let tempMsg = '系统异常，入港失败'
          if (order.orderStates[0].orderType == '待出港') {
            tempMsg = '系统异常，出港失败'
          }

          if (res.data.root) {
            tempMsg = res.data.root
          }
          wx.showToast({
            title: tempMsg,
            icon: 'none'
          })
        } else {
          let tempMsg = '入港成功'
          if (order.orderStates[0].orderType == '待出港') {
            tempMsg = '出港成功'
          }
          wx.showToast({
            title: tempMsg,
          })
          that.data.orderList.splice(tempIndex, 1);
          that.setData({
            orderList: that.data.orderList
          })
        }
      },
      fail(res) {
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
        wx.hideLoading();
      }
    })
  },

  /**
   * 确认收货
   */
  requestReceiveOrder: function (orderIndex) {

    const tempIndex = orderIndex;
    const order = this.data.orderList[tempIndex];
    wx.showLoading({
      title: '请稍等...',
    })
    let fileList = [];
    if (!util.checkEmpty(order.currentUploadImages)) {
      for (let i = 0; i < order.currentUploadImages.length; i++) {
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
      url: config.URL_Service + config.URL_ConfirmOrder,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST", // 请求方式
      data: {
        fileList: fileList,
        orderNo: order.orderNo,
        openId: loginUtil.getOpenId()
      },
      success(res) {
        console.log("确认收货 success: \n" + JSON.stringify(res));
        if (res.data.prompt == config.Prompt_Success) {
          wx.showToast({
            title: '收货成功',
          })
          that.data.orderList.splice(orderIndex, 1);
          that.setData({
            orderList: that.data.orderList
          })
        } else {
          wx.showToast({
            title: '收货失败',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("确认收货 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: '失败,网络波动',
          icon:'none'
        })
      },
      complete(res) {
        console.log("确认收货 complete: \n" + JSON.stringify(res));
        wx.hideLoading();
      },
    })
  },

  /**
   * 点击准备上传
   */
  tapUpload: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    let that = this;
    wx.showActionSheet({
      itemList: ["拍摄照片", "拍摄视频", "选择照片", "选择视频"],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
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
        } else if (res.tapIndex == 1) {
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
        } else if (res.tapIndex == 2) {
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
        } else {
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
        }
      },
    })
  },

  /**
   * 点击分配
   */
  tapAllocation: function (e) {
    let allocationStaffList = this.data.orderList[e.currentTarget.dataset.tapindex].orderAssignments;
    if (util.checkEmpty(allocationStaffList)) {
      allocationStaffList = "";
    } else {
      allocationStaffList = JSON.stringify(allocationStaffList);
    }
    wx.navigateTo({
      url: '/pages/selectorStaff/selectorStaff?orderno=' + this.data.orderList[e.currentTarget.dataset.tapindex].orderNo + '&stafflist=' + allocationStaffList,
    })
  },

  /**
   * 订单详情
   */
  tapOrderDetail: function (e) {
    console.log("详情：\n" + e.currentTarget.dataset.orderno)
    wx.navigateTo({
      url: '../orderDetail/orderDetail?orderno=' + e.currentTarget.dataset.orderno + '&type=1',
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
   * 点击临时派送
   */
  tapChangeDeliver: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    if (tempOrder.showChangeDeliver == null) {
      tempOrder.showChangeDeliver = true;
    } else {
      tempOrder.showChangeDeliver = !tempOrder.showChangeDeliver
    }
    this.setData({
      orderList: this.data.orderList
    })
  },

  /**
   * 输入临派名称
   */
  inputDeliverName: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    tempOrder.deliverName = e.detail.value;
  },

  /**
   * 输入临派电话
   */
  inputDeliverPhone: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    tempOrder.deliverPhone = e.detail.value;
  },

  /**
   * 输入临派地址
   */
  inputDeliverAddress: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    tempOrder.deliverAddress = e.detail.value;
  },

  /**
   * 点击确定修改为派送中状态
   */
  tapChangeToDeliver: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.index];
    if (util.checkEmpty(tempOrder.deliverName)) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return;
    } 
    if (util.checkEmpty(tempOrder.deliverPhone)) {
      wx.showToast({
        title: '电话不能为空',
        icon: 'none'
      })
      return;
    } 
    if (util.checkEmpty(tempOrder.deliverAddress)) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none'
      })
      return;
    } 
    this.requestChangeToDeliver(tempOrder);
  },

  /**
   * 修改待签收状态为派送中
   */
  requestChangeToDeliver: function (orderItem) {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
    })
    wx.request({
      url: config.URL_Service + config.URL_ChangeToDeliver,
      data: {
        order:{
          orderNo: orderItem.orderNo
        },
        recipientName: orderItem.deliverName,
        recipientPhone: orderItem.deliverPhone,
        address: orderItem.deliverAddress,
      },
      method: 'POST',
      success(res){
        console.log("修改待签收状态 success: \n" + JSON.stringify(res));
        if (res.data.code == 200 && res.data.data > 0) {
          orderItem.orderStates[0].orderType = "派送中";
          orderItem.deliverName = null;
          orderItem.deliverPhone = null;
          orderItem.deliverAddress = null;
          orderItem.showChangeDeliver = false;
          that.setData({
            orderList: that.data.orderList
          })
        } else {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log("修改待签收状态 fail: \n" + JSON.stringify(res));

        wx.showToast({
          title: '失败！网络波动',
          icon: 'none'
        })
      },
      complete(res){
        wx.hideLoading();
      }
    })
  },
})