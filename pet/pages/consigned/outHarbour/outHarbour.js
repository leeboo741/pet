/**
 * ******** 出港 ********
 * =========================================================================================
 * =========================================================================================
 */

const util = require("../../../utils/util.js")
const config = require("../../../utils/config.js")

const app = getApp();
const maxImageCount = 8; // 最大图片数量限制
const maxVideoCount = 8; // 最大视频数量限制
const maxVideoLength = 30; // 最大视频长度限制

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], // 订单列表
    finishPage: false, // 页面是否终结
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestOutHarbour();
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
    console.log("/outharbour/outharbour 销毁")
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
    if (util.isEmpty(order.uploadImages)
      && util.isEmpty(order.uploadVideos)) {
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
    if ((!util.isEmpty(order.images) || !util.isEmpty(order.videos))
      && util.isEmpty(order.uploadImages)
      && util.isEmpty(order.uploadVideos)) {
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
    if (!util.isEmpty(tempOrder.uploadImages)) {
      uploadList = uploadList.concat(tempOrder.uploadImages);
    }
    if (!util.isEmpty(tempOrder.uploadVideos)) {
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

          if (util.isVideo(mediaAddress)) {
            if (order.videos == null) {
              order.videos = [];
            }
            let tempFile = fileList[uploadIndex];
            let tempIndex = that.getIndexOf(tempFile, order.uploadVideos);
            order.videos.push(mediaAddress);
            order.uploadVideos.splice(tempIndex, 1);
          } else {
            if (order.images == null) {
              order.images = [];
            }
            let tempFile = fileList[uploadIndex];
            let tempIndex = that.getIndexOf(tempFile, order.uploadImages);
            order.images.push(tempObj.data[0].viewAddress);
            order.uploadImages.splice(tempIndex, 1);
          }
          that.setData({
            orderList: that.data.orderList
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: "一个文件上传失败",
          icon: 'none'
        })
        typeof callback == "function" && callback("fail");
      },
      complete(res) {
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
  searchOrder: function(e) {
    this.requestOutHarbour(e.detail.value)
  },

  /**
   * 请求出港单
   */
  requestOutHarbour: function (searchKey) {
    wx.showLoading({
      title: '请稍等...',
    })
    let that = this;
    let tempSearchKey = "";
    if (searchKey != null) {
      tempSearchKey = searchKey
    }
    let orderType = "待出港";
    wx.request({
      url: config.URL_Service + config.URL_GetInOrOutHarbourList,
      data: {
        openId: app.globalData.userInfo.openid,
        orderNo: tempSearchKey,
        orderType: orderType
      },
      success(res) {
        console.log("请求出港单 success：\n" + JSON.stringify(res));
        that.setData({
          orderList: res.data.data
        })
      },
      fail(res) {
        console.log("请求出港单 fail：\n" + JSON.stringify(res));
      },
      complete(res) {
        console.log("请求出港单 complete：\n" + JSON.stringify(res));
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
    if (tempOrder.images != null && tempOrder.images.length > 0) {
      tempImageList = tempImageList.concat(tempOrder.images);
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
   * 出港
   */
  tapOutHarbour: function (e) {
    this.requestConfirmInHarbour(e.currentTarget.dataset.tapindex);
  },

  /**
   * 确认入港
   */
  requestConfirmInHarbour: function (orderIndex) {
    const tempIndex = orderIndex;
    let order = this.data.orderList[tempIndex];
    wx.showLoading({
      title: '请稍等...',
    })
    let fileList = [];
    if (!util.isEmpty(order.images)) {
      fileList = fileList.concat(order.images);
    }
    if (!util.isEmpty(order.videos)) {
      fileList = fileList.concat(order.videos);
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
        console.log("确定出港 success: \n" + JSON.stringify(res));
        if (res.data.prompt != null && res.data.prompt == "Error") {
          let msg = "系统异常，出港失败";
          if (res.data.root) {
            msg = res.data.root
          }
          wx.showToast({
            title: msg,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '出港成功',
          })
          that.data.orderList.splice(tempIndex, 1);
          that.setData({
            orderList: that.data.orderList
          })
        }
      },
      fail(res) {
        console.log("确定出港 fail: \n" + JSON.stringify(res));
        wx.showToast({
          title: "网络异常，出港失败",
          icon: 'none'
        })
      },
      complete(res) {
        console.log("确定出港 complete: \n" + JSON.stringify(res));
        wx.hideLoading();
      }
    })
  },

  /**
   * 点击准备上传
   */
  tapUpload: function (e) {
    let tempOrder = this.data.orderList[e.currentTarget.dataset.tapindex];
    let tempImageCount = maxImageCount;
    if (tempOrder.images != null) {
      tempImageCount = tempImageCount - tempOrder.images.length;
    }
    if (tempOrder.uploadImages != null) {
      tempImageCount = tempImageCount - tempOrder.uploadImages.length;
    }
    let that = this;
    wx.showActionSheet({
      itemList: ["上传照片", "上传视频"],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          if (tempOrder.image != null && tempOrder.images.length >= maxImageCount) {
            wx.showToast({
              title: '已经上传全部' + maxImageCount + '张图片',
              icon: 'none'
            })
            return;
          }
          if (tempImageCount <= 0) {
            wx.showToast({
              title: '可上传图片达到最大数量，请先取消部分图片',
              icon: "none",
            })
            return;
          }
          wx.chooseImage({
            count: tempImageCount,
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
          if (!util.isEmpty(tempOrder.videos)) {
            wx.showToast({
              title: '已经上传视频，请勿重复上传！',
              icon: 'none'
            })
            return;
          }
          wx.chooseVideo({
            maxDuration: maxVideoLength,
            success(res) {
              if (tempOrder.uploadVideos == null) {
                tempOrder.uploadVideos = [];
              }
              if (!util.isEmpty(res.tempFilePath)) {
                tempOrder.uploadVideos.push(res.tempFilePath)
                that.handleReadyToUpload(tempOrder);
                that.handleReadyToInHarbour(tempOrder);
              }
            }
          })
        }
      },
    })
  },
})